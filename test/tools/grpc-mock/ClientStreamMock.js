const stream = require('stream');
const util = require('util');

const ClientStreamMock = function (options) {
  if (options == null) {
    options = {};
  }
  stream.Writable.call(this, {objectMode: true});
  this.readArr = [];
  this.callback = options.callback;
  this.on('finish', function () {
    if (typeof options.callback === 'function') {
      options.callback(null, this.readArr[this.readArr.length - 1]);
    }
  });

};
util.inherits(ClientStreamMock, stream.Writable);

ClientStreamMock.prototype._write = function (chunk, enc, cb) {
  this.readArr.push(chunk);
  cb();
};

module.exports = ClientStreamMock;
