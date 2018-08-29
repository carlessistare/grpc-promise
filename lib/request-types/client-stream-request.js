
class ClientStreamRequest {

  constructor (client, original_function, options = {}) {
    if (options == null) options = {};
    this.promise = new Promise((resolve, reject) => {
      this.stream = original_function.call(client, options.metadata, function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
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
