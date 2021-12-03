Like [`Array.prototype.concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat). Differences:

  * Takes two arguments, without rest/spread.
  * Supports arbitrary iterables compatible with [#`values`](#function-values).
  * Iterables may be [#nil](#function-isnil), equivalent to `[]`.

Note: for individual elements, use [#`append`](#function-append) and
[#`prepend`](#function-prepend).
