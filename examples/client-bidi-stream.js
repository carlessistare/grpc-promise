const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const grpc_promise = require('../lib/index'); // require('grpc-promise')

const packageDefinition = protoLoader.loadSync(
  __dirname + '/protobuf/test.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const test_proto = protoDescriptor.test;

function main() {
  const client = new test_proto.Test('localhost:50052', grpc.credentials.createInsecure());

  const meta = new grpc.Metadata();
  meta.add('key', 'value');

  // Optional timeout definition, defaults = 50
  grpc_promise.promisifyAll(client, { timeout_message: 100, metadata: meta, timeout: 1000 }); // timeout in milliseconds

  let t = client.testStreamStream();
  t.sendMessage({})
    .then(res => {
      console.log('Client: Stream Message Received = ', res); // Client: Stream Message Received = {id: 0}
    })
    .catch(err => console.error(err))
  ;
  t.sendMessage({})
    .then(res => {
      console.log('Client: Stream Message Received = ', res); // Client: Stream Message Received = {id: 1}
    })
    .catch(err => console.error(err))
  ;
  setTimeout(function () {
    t.end();
  }, 200);
}

main();
