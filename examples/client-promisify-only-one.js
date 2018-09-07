const grpc = require('grpc');
const grpc_promise = require('../lib/index'); // require('grpc-promise')
const test_proto = grpc.load(__dirname + '/protobuf/test.proto').test;

function main() {
  const client = new test_proto.Test('localhost:50052', grpc.credentials.createInsecure());

  const meta = new grpc.Metadata();
  meta.add('key', 'value');

  grpc_promise.promisify(client, ['testSimpleSimple'], {metadata: meta});

  client.testSimpleSimple()
    .sendMessage({id: 1})
    .then(res => {
      console.log('Client: Simple Message Received = ', res) // Client: Simple Message Received = {id: 1}

      const call = client.testSimpleStream({id: 1})
      call.on('data', function (res) {
        console.log('Client: Stream Message Received = ', res)
      })
    })
    .catch(err => console.error(err))
  ;
}

main();
