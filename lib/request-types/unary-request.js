
class UnaryRequest {

  constructor (client, original_function, options = {}) {
    if (options == null) options = {};
    this.client = client;
    this.metadata = options.metadata;
    this.deadline = options.deadline || undefined;
    this.original_function = original_function;
  }

  sendMessage (content = {}) {
    return new Promise((resolve, reject) => {
      this.original_function.call(this.client, content, this.metadata, { deadline: this.deadline },
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

}

const makeUnaryRequest = function (client, originalFunction, options) {
  // console.log(options);
  return function () {
    return new UnaryRequest(client, originalFunction, options);
  };
};

module.exports = makeUnaryRequest;
