sinpi
===

> Computes the sine of a number times π.

This package is a rewrite of
 [math-io/sinpi](https://github.com/math-io/sinpi)
 in Typescript.
This package supports both CommonJs and ES Modules.


This package includes the source code (modified).

- [math-io/sinpi](https://github.com/math-io/sinpi)
- [math-io/float-copysign](https://github.com/math-io/float64-copysign)
- [math-io/float64-get-high-word](https://github.com/math-io/float64-get-high-word)
- [math-io/float64-to-words](https://github.com/math-io/float64-to-words)
- [math-io/float64-from-words](https://github.com/math-io/float64-from-words)
- [kgryte/utils-is-little-endian](https://github.com/kgryte/utils-is-little-endian)

## Installation

``` bash
$ npm install @toshiara/sinpi
```


## Usage

``` javascript
// for CommonJs
const { sinpi } = require('@toshiara/sinpi');

// for ES Modules
import { sinpi } from '@toshiara/sinpi';
```

### sinpi(x)

Computes `sin(πx)` more accurately than `sin(pi*x)`, especially for large `x`.


``` javascript
sinpi(0);
// returns 0

sinpi(0.5);
// returns 1

sinpi(0.9);
// returns 0.30901699437494734
```

## License

[MIT license](http://opensource.org/licenses/MIT)


