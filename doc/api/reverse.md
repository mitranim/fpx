Similar to [`Array.prototype.reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Always creates a new array. Does not mutate the input.
