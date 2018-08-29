const ClientStreamMock = require('../../tools/grpc-mock/ClientStreamMock');
const grpc_promise = require('../../../lib/index');

describe('Client Stream Request', function () {

  it('Test ok', function () {
    const client = {};
    const makeClientStreamRequest = function (metadata, callback) {
      return new ClientStreamMock({callback: callback});
    };
    makeClientStreamRequest.requestStream = true;
    makeClientStreamRequest.responseStream = false;
    Object.setPrototypeOf(client, {
      clientStreamReq: makeClientStreamRequest
    });

    grpc_promise.promisifyAll(client);

    return client.clientStreamReq()
      .sendMessage({id: 1})
      .sendMessage({id: 2})
      .end()
      .then(res => {
        res.id.should.equal(2);
      });
  });

  it('Test ko', function () {
    const client = {};
    const makeClientStreamRequest = function (metadata, callback) {
      var stream = new ClientStreamMock();
      stream.on('finish', function () {
        callback('some_error');
      });
      return stream;
    };
    makeClientStreamRequest.requestStream = true;
    makeClientStreamRequest.responseStream = false;
    Object.setPrototypeOf(client, {
      clientStreamReq: makeClientStreamRequest
    });

    grpc_promise.promisifyAll(client);

    return client.clientStreamReq()
      .sendMessage({id: 1})
      .sendMessage({id: 2})
      .end()
      .then(() => {
        throw new Error('Should not happen');
      })
      .catch(err => err.should.equal('some_error'));
  });

});
