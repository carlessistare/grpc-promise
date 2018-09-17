const grpc_promise = require('../../../lib/index');

describe('Unary Request', function () {

  describe('With promisifyAll', function () {

    it('Test ok', function () {
      const client = {};
      const makeUnaryRequest = function (request, metadata, options, callback) {
        callback(null, request);
      };
      makeUnaryRequest.requestStream = false;
      makeUnaryRequest.responseStream = false;
      Object.setPrototypeOf(client, {
        unaryReq: makeUnaryRequest
      });

      grpc_promise.promisifyAll(client);

      return client.unaryReq()
        .sendMessage({id: 1})
        .then(res => res.id.should.equal(1));
    });

    it('Test ko', function () {
      const client = {};
      const makeUnaryRequest = function (request, metadata, options, callback) {
        callback('timeout');
      };
      makeUnaryRequest.requestStream = false;
      makeUnaryRequest.responseStream = false;
      Object.setPrototypeOf(client, {
        unaryReq: makeUnaryRequest
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

  describe('With promisify', function () {

    it('Test ok', function () {
      const client = {};
      const makeUnaryRequest = function (request, metadata, options, callback) {
        callback(null, request);
      };
      makeUnaryRequest.requestStream = false;
      makeUnaryRequest.responseStream = false;
      const makeUnaryRequest2 = function (request, metadata, callback) {
        callback(null, request);
      };
      makeUnaryRequest2.requestStream = false;
      makeUnaryRequest2.responseStream = false;
      Object.setPrototypeOf(client, {
        unaryReq: makeUnaryRequest,
        unaryReq2: makeUnaryRequest2
      });

      grpc_promise.promisify(client, ['unaryReq']);

      return client.unaryReq()
        .sendMessage({id: 1})
        .then(res => {
          res.id.should.equal(1);
          client.unaryReq2({id: 1}, null, function (err, res) {
            res.id.should.equal(1);
          });
        });

    });

  });

});
