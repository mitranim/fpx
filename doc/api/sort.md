Signature: `(src: Iter<A>, fun?: (prev: A, next: A) => -1 | 0 | 1) => A[]`.

Similar to [`Array.prototype.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Always creates a new array. Does not mutate the input.

The comparison function is optional. If omitted, default JS sorting is used.
