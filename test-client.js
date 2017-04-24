const promisify = require('./lib/index');
const grpc = require('grpc');
const hello_proto = grpc.load('/Users/carles/www/grpc-promise/test/fixtures/protobuf/test.proto').test;

function main() {
  const client = new hello_proto.Test('localhost:50052', grpc.credentials.createInsecure());

  promisify(client);
  // client.testSimpleSimple()
  //   .sendMessage({id: 1})
  //   .then(res => console.log(res))
  //   .catch(err => console.error(err))
  // ;
  t = client.testStreamStream();
  t.sendMessage({})
    .then(res => console.log(res))
    .catch(err => console.error(err))
  ;
  t.sendMessage({})
    .then(res => {
      console.log(res);
      t.end();
    })
    .catch(err => {
      console.error(err);
    })
  ;
  // t.end();
  // client.testStreamSimple()
  //   .sendMessage({id: 1})
  //   .sendMessage({id: 2})
  //   .end()
  //   .then(res => console.log(res))
  //   .catch(err => console.error(err))
  // ;
}

main();
