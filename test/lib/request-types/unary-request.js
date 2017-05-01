const grpc_promise = require('../../../lib/index');

describe('Unary Request', function () {

  it('Test ok', function () {
    let client = {};
    Object.setPrototypeOf(client, {
      unaryReq: function makeUnaryRequest (request, callback) {
        callback(null, request);
      }
    });

    grpc_promise.promisifyAll(client);

    return client.unaryReq()
      .sendMessage({id: 1})
      .then(res => res.id.should.equal(1));
  });

  it('Test ko', function () {
    let client = {};
    Object.setPrototypeOf(client, {
      unaryReq: function makeUnaryRequest (request, callback) {
        callback('timeout', null);
      }
    });

    grpc_promise.promisifyAll(client);

    return client.unaryReq()
      .sendMessage({id: 1})
      .then(() => {
        throw new Error('Should not happen');
      })
      .catch(err => err.should.equal('timeout'));
  });

});
