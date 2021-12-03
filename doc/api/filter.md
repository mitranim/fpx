Signature: `(Iter<A>, A => bool) => A[]`.

Similar to [`Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Doesn't support `this` or additional arguments.
