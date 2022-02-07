True for a value that could be considered a single scalar, rather than a collection / data structure:

  * Any [#primitive](#function-isprim).
  * Any [#object](#function-isobj) with a custom `.toString` method, distinct from both `Object.prototype.toString` and `Array.prototype.toString`.
