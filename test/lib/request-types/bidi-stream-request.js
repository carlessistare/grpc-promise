const BidiStreamMock = require('../../tools/grpc-mock/BidiStreamMock');
const grpc_promise = require('../../../lib/index');

describe('Bidi Stream Request', function () {

  it('If no delay, test ok', function () {
    let client = {};
    Object.setPrototypeOf(client, {
      bidiStreamReq: function makeBidiStreamRequest () {
        return new BidiStreamMock();
      }
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
    let client = {};
    Object.setPrototypeOf(client, {
      bidiStreamReq: function makeBidiStreamRequest () {
        return new BidiStreamMock({delay: 5});
      }
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
    let client = {};
    Object.setPrototypeOf(client, {
      bidiStreamReq: function makeBidiStreamRequest () {
        return new BidiStreamMock({delay: 60});
      }
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
    let client = {};
    Object.setPrototypeOf(client, {
      bidiStreamReq: function makeBidiStreamRequest () {
        return new BidiStreamMock({delay: 75});
      }
    });

    grpc_promise.promisifyAll(client, {timeout: 80});

    const s = client.bidiStreamReq();
    return Promise.all([s.sendMessage({}), s.sendMessage({})])
      .then(res => {
        res[0].id.should.equal(0);
        res[1].id.should.equal(1);
      });
  });

});
