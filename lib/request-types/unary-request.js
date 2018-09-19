
class UnaryRequest {

  constructor (client, original_function, options = {}) {
    if (options == null) options = {};
    this.client = client;
    this.metadata = options.metadata;
    this.timeout = options.timeout || undefined;
    this.original_function = original_function;
  }

  sendMessage (content = {}) {
    return new Promise((resolve, reject) => {
      // Deadline is advisable to be set
      // It should be a timestamp value in milliseconds
      let deadline = undefined;
      if (this.timeout !== undefined) {
        deadline = Date.now() + this.timeout;
      }
      this.original_function.call(this.client, content, this.metadata, { deadline: deadline },
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
