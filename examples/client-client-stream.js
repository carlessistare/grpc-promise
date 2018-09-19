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

  grpc_promise.promisifyAll(client, { metadata: meta, timeout: 1000 }); // timeout in milliseconds

  client.testStreamSimple(meta)
    .sendMessage({id: 1})
    .sendMessage({id: 2})
    .sendMessage({id: 3})
    .end()
    .then(res => {
      console.log('Client: Simple Message Received = ', res); // Client: Simple Message Received = {id: 3}
    })
    .catch(err => console.error(err))
  ;
}

main();
