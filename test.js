var test = require('tape');
var streamf = require('./');
var collect = require('collect-stream');
var Readable = require('stream').Readable;

var tests = {
  'no args': { args: ['hi'], out: 'hi' },
  '% sign': { args: ['oh % no'], out: 'oh % no' },
  'string': { args: ['a %s c', 'b'], out: 'a b c' },
  'string cast': { args: ['a %s c', {}], out: 'a [object Object] c' },
  'number': { args: ['1 %d 3', 2], out: '1 2 3' },
  'number cast': { args: ['1 %d 3', undefined], out: '1 NaN 3' },
  'json': { args: ['foo %j', {bar:'baz'}], out: 'foo {"bar":"baz"}' },
  'string stream': { args: ['aa%scc', emitStr('bb')], out: 'aabbcc' },
  'string stream cast': { args: ['1%s3', emitObj(2)], out: '123' },
  'json stream': { args: ['this -> %j', emitObj('bb')], out: 'this -> [\n"bb"\n]\n' },
  'number stream': { args: ['1%d3', emitObj(2)], out: '123' },
  'number stream cast': { args: ['1%d3', emitStr('2')], out: '123' }
};

var o = {};
o.o = o;
tests['json safe'] = { args: ['foo %j', o], out: 'foo {"o":"[Circular ~]"}' };

Object.keys(tests).forEach(function(name){
  test(name, function(t){
    var stream = streamf.apply(null, tests[name].args);
    collect(stream, function(err, out){
      t.error(err);
      t.equal(out.toString(), tests[name].out);
      t.end();
    });
  });
});

function emitStr(str){
  var r = Readable();
  r.push(str);
  r.push(null);
  return r;
};

function emitObj(obj){
  var r = Readable({ objectMode: true });
  r.push(obj);
  r.push(null);
  return r;
};
