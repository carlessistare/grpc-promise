module.exports = {
  makeUnaryRequest: require('./unary-request'),
  makeBidiStreamRequest: require('./bidi-stream-request'),
  makeClientStreamRequest: require('./client-stream-request'),
  makeServerStreamRequest: require('./server-stream-request')
};
