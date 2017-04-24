const grpc = require('grpc');
const hello_proto = grpc.load('/Users/carles/www/grpc-promise/test/fixtures/protobuf/test.proto').test;

const testSimpleSimple = function (call, callback) {
  console.log(call.request);
  callback(null, call.request);
};

const testStreamSimple = function (call, callback) {
  let message = null;
  call.on('data', function (m) {
    console.log(m);
    message = m;
  });
  call.on('end', function () {
    console.log('BYE');
    callback(null, message);
  });
};


const testStreamStream = function (call) {
  call.on('data', function (message) {
    console.log(message);
    setTimeout(function () {
      call.write({
        id: message.id
      });
    }, 10);
  });

  call.on('end', function () {
    console.log('BYE');
    call.end();
  });
};


main = function () {
  server = new grpc.Server();
  server.addProtoService(hello_proto.Test.service, {
    testSimpleSimple: testSimpleSimple,
    testStreamStream: testStreamStream,
    testStreamSimple: testStreamSimple
  });

  server.bind('0.0.0.0:50052', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
