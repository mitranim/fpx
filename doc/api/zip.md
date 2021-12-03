Signature: `(Iter<[Key, A]>) => {[Key: A]}`.

Similar to [`Object.fromEntries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values) (more flexible).
    * Each value of this iterable must be a key-value pair.
  * Ignores entries where the first element is not a [#valid key](#function-iskey).
  * Returns a [#null-prototype object](#function-npo).
  * Slightly slower.
