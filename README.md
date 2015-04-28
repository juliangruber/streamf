
# streamf

  Like sprintf but for streams.

## Example

```js
var streamf = require('streamf');


streamf('foo: %s, bar: %j', someRawStream, someJSONStream))
.pipe(process.stdout)
```

Given `someRawStream` emits `"bar"` and `someJSONStream` emits `{beep:"boop"}`,
the output will be:

```
foo: bar, bar: [{"beep":"boop"}]
```

## Installation

```bash
$ npm install streamf
```

## API

### streamf(str, ..args)

  Given printf style string `str`, render using args.

  Supported placeholders:

  - `%s`: stringify
  - `%d`: numberify
  - `%j`: json-parse-ify

  You can pass streams __and__ normal values as args.

## License

  MIT

