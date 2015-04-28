var Readable = require('stream').Readable;
var Transform = require('stream').Transform;
var cat = require('stream-cat');
var stringify = require('json-stringify-safe');
var pipe = require('multipipe');
var JSONStream = require('JSONStream');

module.exports = function(str){
  var streams = [];
  var reg = /%[sdj]/g;
  var lastIdx = 0;
  var argIdx = 0;
  var m;

  while (m = reg.exec(str)) {
    var start = lastIdx;
    var end = m.index;
    var lastIdx = end + 2;
    streams.push(emit(str.slice(start, end)));

    var value = arguments[1 + argIdx++];
    var isStream = value && typeof value.pipe == 'function';

    if (m == '%s') {
      if (isStream) value = pipe(value, stringifyStream());
      else value = emit(String(value));
    }
    else if (m == '%d') {
      if (isStream) value = pipe(value, stringifyStream(true))
      else value = emit(String(Number(value)));
    }
    else if (m == '%j') {
      if (isStream) value = pipe(value, JSONStream.stringify());
      else value = emit(stringify(value));
    }
    streams.push(value);
  }
  streams.push(emit(str.slice(lastIdx, str.length)));

  return cat(streams);
};

function emit(str){
  var r = Readable();
  r.push(str);
  r.push(null);
  return r;
};

function stringifyStream(expectNumbers){
  var t = Transform();
  t._writableState.objectMode = true;
  t._transform = expectNumbers
    ? function(o, _, cb){ cb(null, String(Number(o))) }
    : function(o, _, cb){ cb(null, String(o)) }
  return t;
}

