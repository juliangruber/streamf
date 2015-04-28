var streamf = require('.');

var stream = streamf('foo: %s, bar: %j', emitStr('foo'), emitObj({ some: 'object' }))
stream.pipe(process.stdout);

var emitStr = function(str){
  var r = Readable();
  r.push(str);
  r.push(null);
  return r;
}

var emitObj = function(obj){
  var r = Readable({ objectMode: true });
  r.push(obj;
  r.push(null);
  return r;
}
