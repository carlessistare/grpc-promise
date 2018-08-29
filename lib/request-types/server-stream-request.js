
class ServerStreamRequest {

  constructor (client, original_function, options = {}) {
    if (options == null) options = {};
    this.queue = [];
    this.client = client;
    this.metadata = options.metadata;
    this.original_function = original_function;
  }

  sendMessage (content = {}) {
    return new Promise((resolve, reject) => {
      this.stream = this.original_function.call(this.client, content, this.metadata);
      this.stream.on('error', error => {
        reject(error);
      });
      this.stream.on('data', data => {
        this.queue.push(data);
      });
      this.stream.on('end', () => {
        resolve(this.queue);
      });
    });
  }

}

const makeServerStreamRequest = function (client, originalFunction, options) {
  return function () {
    return new ServerStreamRequest(client, originalFunction, options);
  };
};

module.exports = makeServerStreamRequest;
