const requestTypes = require('./request-types/request-types');

const promisifyAll = function (client, options) {
  Object.keys(Object.getPrototypeOf(client)).forEach(function (functionName) {
    const originalFunction = client[functionName];
    client[functionName] = requestTypes[originalFunction.name](client, originalFunction, options);
  });
};

module.exports = {
  promisifyAll: promisifyAll
};
