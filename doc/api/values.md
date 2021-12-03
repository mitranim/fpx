Takes an arbitrary input and returns an array of its values:

  * For non-objects: always `[]`.
  * For [#arrays](#function-isarr): **returns as-is without copying**.
  * For [#lists](#function-islist): slice to array.
  * For [#iterables](#function-isiter) with `.values()`: equivalent to converting the output of `.values()` to an array. Implementation varies for performance.
    * Examples: `Set`, `Map`, and more.
  * For [#iterators](#function-iterator): equivalent to `[...iterator]`.
  * For [#structs](#function-isstruct): equivalent to [`Object.values`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values).
