
class ClientStreamRequest {

  constructor (client, original_function, options = {}) {
    if (options == null) options = {};
    this.promise = new Promise((resolve, reject) => {
      // Deadline is advisable to be set
      // It should be a timestamp value in milliseconds
      let deadline = undefined;
      if (options.timeout !== undefined) {
        deadline = Date.now() + options.timeout;
      }
      this.stream = original_function.call(client, options.metadata, { deadline: deadline },
        function (error, response) {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  sendMessage (content = {}) {
    this.stream.write(content);
    return this;
  }

  end () {
    this.stream.end();
    return this.promise;
  }

}

const makeClientStreamRequest = function (client, originalFunction, options) {
  return function () {
    return new ClientStreamRequest(client, originalFunction, options);
  };
};

module.exports = makeClientStreamRequest;
