const requestTypes = require('./request-types/request-types');

const promisifyAll = function (client, options) {
  Object.keys(Object.getPrototypeOf(client)).forEach(function (functionName) {
    const originalFunction = client[functionName];
    if (originalFunction.requestStream === undefined && originalFunction.responseStream === undefined) {
      return;
    }

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

const promisify = function (client, methods, options) {
  Object.keys(Object.getPrototypeOf(client)).forEach(function (functionName) {
    const originalFunction = client[functionName];
    if (originalFunction.requestStream === undefined && originalFunction.responseStream === undefined) {
      return;
    }
    if (methods.indexOf(functionName) === -1) {
      return;
    }

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
  promisifyAll: promisifyAll,
  promisify: promisify
};
