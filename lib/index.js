const requestTypes = require('./request-types/request-types');

const promisify = function (client) {
  Object.keys(Object.getPrototypeOf(client)).forEach(function (functionName) {
    const originalFunction = client[functionName];
    client[functionName] = requestTypes[originalFunction.name](client, originalFunction);
  });
};

module.exports = promisify;
