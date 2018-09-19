const BidiStreamMock = require('../../tools/grpc-mock/BidiStreamMock');
const grpc_promise = require('../../../lib/index');

describe('Bidi Stream Request', function () {

  describe('With promisifyAll', function () {

    it('If no delay, test ok', function () {
      const client = {};
      const makeBidiStreamRequest = function () {
        return new BidiStreamMock();
      };
      makeBidiStreamRequest.requestStream = true;
      makeBidiStreamRequest.responseStream = true;
      Object.setPrototypeOf(client, {
        bidiStreamReq: makeBidiStreamRequest
      });

      grpc_promise.promisifyAll(client);

      const s = client.bidiStreamReq();
      return Promise.all([s.sendMessage({}), s.sendMessage({})])
        .then(res => {
          res[0].id.should.equal(0);
          res[1].id.should.equal(1);
        });
    });

    it('If a bit of delay, test ok', function () {
      const client = {};
      const makeBidiStreamRequest = function () {
        return new BidiStreamMock({delay: 5});
      };
      makeBidiStreamRequest.requestStream = true;
      makeBidiStreamRequest.responseStream = true;
      Object.setPrototypeOf(client, {
        bidiStreamReq: makeBidiStreamRequest
      });

      grpc_promise.promisifyAll(client);

      const s = client.bidiStreamReq();
      return Promise.all([s.sendMessage({}), s.sendMessage({})])
        .then(res => {
          res[0].id.should.equal(0);
          res[1].id.should.equal(1);
        });
    });

    it('If a lot of delay, test ko', function () {
      const client = {};
      const makeBidiStreamRequest = function () {
        return new BidiStreamMock({delay: 60});
      };
      makeBidiStreamRequest.requestStream = true;
      makeBidiStreamRequest.responseStream = true;
      Object.setPrototypeOf(client, {
        bidiStreamReq: makeBidiStreamRequest
      });

      grpc_promise.promisifyAll(client);

      return client.bidiStreamReq()
        .sendMessage({})
        .then(() => {
          throw new Error('Should not happen');
        })
        .catch(err => err.should.equal('timeout'));
    });

    it('If a lot of delay and a lot of timeout, test ko', function () {
      const client = {};
      const makeBidiStreamRequest = function () {
        return new BidiStreamMock({delay: 75});
      };
      makeBidiStreamRequest.requestStream = true;
      makeBidiStreamRequest.responseStream = true;
      Object.setPrototypeOf(client, {
        bidiStreamReq: makeBidiStreamRequest
      });

      grpc_promise.promisifyAll(client, {timeout_message: 80});

      const s = client.bidiStreamReq();
      return Promise.all([s.sendMessage({}), s.sendMessage({})])
        .then(res => {
          res[0].id.should.equal(0);
          res[1].id.should.equal(1);
        });
    });

  });

  describe('With promisify', function () {

    it('Test ok', function (done) {
      const client = {};
      const makeBidiStreamRequest = function () {
        return new BidiStreamMock();
      };
      makeBidiStreamRequest.requestStream = true;
      makeBidiStreamRequest.responseStream = true;
      const makeBidiStreamRequest2 = function () {
        return new BidiStreamMock();
      };
      makeBidiStreamRequest2.requestStream = true;
      makeBidiStreamRequest2.responseStream = true;
      Object.setPrototypeOf(client, {
        bidiStreamReq: makeBidiStreamRequest,
        bidiStreamReq2: makeBidiStreamRequest2
      });

      grpc_promise.promisify(client, ['bidiStreamReq']);

      const s = client.bidiStreamReq();
      Promise.all([s.sendMessage({}), s.sendMessage({})])
        .then(res => {
          res[0].id.should.equal(0);
          res[1].id.should.equal(1);
          const call = client.bidiStreamReq2();
          call.write({id: 1});
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
