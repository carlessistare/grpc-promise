const grpc = require('grpc');
const grpc_promise = require('../lib/index'); // require('grpc-promise')
const test_proto = grpc.load(__dirname + '/protobuf/test.proto').test;

function main() {
  const client = new test_proto.Test('localhost:50052', grpc.credentials.createInsecure());

  const meta = new grpc.Metadata();
  meta.add('key', 'value');

  grpc_promise.promisifyAll(client, {metadata: meta});

  client.testSimpleStream()
    .sendMessage({id: 1})
    .then(res => {
      console.log('Client: Stream Message Received = ', res); // Client: Stream Message Received = [{id: 1}, {id: 1}]
    })
    .catch(err => console.error(err))
  ;
}

main();
