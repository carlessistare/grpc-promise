const requestTypes = require('./request-types/request-types');

const promisifyAll = function (client, options) {
  Object.keys(Object.getPrototypeOf(client)).forEach(function (functionName) {
    const originalFunction = client[functionName];
    const genericFunctionSelector =
      (originalFunction.requestStream ? 2 : 0) | (originalFunction.responseStream ? 1 : 0);
    let genericFunctionName;
    switch (genericFunctionSelector) {
    case 0:
      genericFunctionName = 'makeUnaryRequest';
      break;
    case 1:
      genericFunctionName = 'makeServerStreamRequest';
      break;
    case 2:
      genericFunctionName = 'makeClientStreamRequest';
      break;
    case 3:
      genericFunctionName = 'makeBidiStreamRequest';
      break;
    }

    client[functionName] = requestTypes[genericFunctionName](client, originalFunction, options);
  });
};

module.exports = {
  promisifyAll: promisifyAll
};
