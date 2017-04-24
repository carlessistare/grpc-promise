
class ClientStreamRequest {

  constructor (client, original_function) {
    this.promise = new Promise((resolve, reject) => {
      this.stream = original_function.call(client, function (error, response) {
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

const makeClientStreamRequest = function (client, originalFunction) {
  return function () {
    return new ClientStreamRequest(client, originalFunction);
  };
};

module.exports = makeClientStreamRequest;
