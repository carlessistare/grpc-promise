
class BidiStreamRequest {

  static get MAX_INT32 () {
    return 2147483647;
  }

  constructor (client, original_function, options = {}) {
    if (options == null) options = {};
    this.queue = {};
    this.correlationId = 0;
    this.timeout_message = options.timeout_message || 50;

    // Deadline is advisable to be set
    // It should be a timestamp value in milliseconds
    let deadline = undefined;
    if (options.timeout !== undefined) {
      deadline = Date.now() + options.timeout;
    }
    this.stream = original_function.call(client, options.metadata, { deadline: deadline });

    this.stream.on('error', () => {});
    this.stream.on('data', data => {
      if (this.queue[data.id]) {
        clearTimeout(this.queue[data.id]['timeout']);
        this.queue[data.id]['cb'](null, data);
        delete this.queue[data.id];
      }
    });
  }

  _nextId () {
    if (this.correlationId >= BidiStreamRequest.MAX_INT32) {
      this.correlationId = 0;
    }
    return this.correlationId++;
  }


  sendMessage (content = {}) {
    return new Promise((resolve, reject) => {
      const id = this._nextId();

      if (this.stream.received_status) {
        return reject('stream_closed');
      }

      const cb = function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      };

      this.queue[id] = {
        cb: cb,
        timeout: setTimeout(() => {
          delete this.queue[id];
          cb('timeout');
        }, this.timeout_message)
      };
      content['id'] = id;
      this.stream.write(content);
    });
  }

  end () {
    this.stream.end();
  }

}

const makeBidiStreamRequest = function (client, originalFunction, options) {
  return function () {
    return new BidiStreamRequest(client, originalFunction, options);
  };
};

module.exports = makeBidiStreamRequest;
