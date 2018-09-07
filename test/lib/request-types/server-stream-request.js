const ServerStreamMock = require('../../tools/grpc-mock/ServerStreamMock');
const grpc_promise = require('../../../lib/index');

describe('Server Stream Request', function () {

  describe('With promisifyAll', function () {

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

  describe('With promisify', function () {

    it('Test ok', function (done) {
      const client = {};
      const makeServerStreamRequest = function () {
        return new ServerStreamMock({response: [{id: 1}, {id: 2}]});
      };
      makeServerStreamRequest.requestStream = false;
      makeServerStreamRequest.responseStream = true;
      const makeServerStreamRequest2 = function () {
        return new ServerStreamMock({response: [{id: 1}, {id: 2}]});
      };
      makeServerStreamRequest2.requestStream = false;
      makeServerStreamRequest2.responseStream = true;
      Object.setPrototypeOf(client, {
        serverStreamReq: makeServerStreamRequest,
        serverStreamReq2: makeServerStreamRequest2
      });

      grpc_promise.promisify(client, ['serverStreamReq']);

      Promise.all([client.serverStreamReq().sendMessage({}), client.serverStreamReq().sendMessage({})])
        .then(res => {
          res[0][0].id.should.equal(1);
          res[0][1].id.should.equal(2);
          res[1][0].id.should.equal(1);
          res[1][1].id.should.equal(2);
          const call = client.serverStreamReq2({id: 1});
          let responseCounter = 1;
          call.on('data', function (res) {
            res.id.should.equal(responseCounter++);
            if (responseCounter === 2) {
              done();
            }
          });
        });
    });

  });

});
