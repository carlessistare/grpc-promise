const grpc = require('grpc');
const grpc_promise = require('../lib/index'); // require('grpc-promise')
const test_proto = grpc.load(__dirname + '/protobuf/test.proto').test;

function main() {
  const client = new test_proto.Test('localhost:50052', grpc.credentials.createInsecure());

  grpc_promise.promisifyAll(client);

  client.testSimpleSimple()
    .sendMessage({id: 1})
    .then(res => {
      console.log('Client: Simple Message Received = ', res) // Client: Simple Message Received = {id: 1}
    })
    .catch(err => console.error(err))
  ;
}

main();
