const ServerStreamMock = require('../../tools/grpc-mock/ServerStreamMock');
const grpc_promise = require('../../../lib/index');

describe('Server Stream Request', function () {

  it('Test ok', function () {
    const client = {};
    const makeServerStreamRequest = function () {
      return new ServerStreamMock({response: [{id: 1}, {id: 2}]});
    };
    makeServerStreamRequest.requestStream = false;
    makeServerStreamRequest.responseStream = true;
    Object.setPrototypeOf(client, {
      serverStreamReq: makeServerStreamRequest
    });

    grpc_promise.promisifyAll(client);

    return Promise.all([client.serverStreamReq().sendMessage({}), client.serverStreamReq().sendMessage({})])
      .then(res => {
        res[0][0].id.should.equal(1);
        res[0][1].id.should.equal(2);
        res[1][0].id.should.equal(1);
        res[1][1].id.should.equal(2);
      });
  });

  it('Test ko', function () {
    const client = {};
    const makeServerStreamRequest = function () {
      return new ServerStreamMock();
    };
    makeServerStreamRequest.requestStream = false;
    makeServerStreamRequest.responseStream = true;
    Object.setPrototypeOf(client, {
      serverStreamReq: makeServerStreamRequest
    });

    grpc_promise.promisifyAll(client);

    return client.serverStreamReq()
      .sendMessage({})
      .then(() => {
        throw new Error('Should not happen');
      })
      .catch(err => err.should.equal('some_error'));
  });

});
