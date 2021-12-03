Takes an arbitrary input and returns an array of its keys:

  * For non-objects: always `[]`.
  * For [#iterables](#function-isiter) with `.keys()`: equivalent to converting the output of `.keys()` to an array. Implementation varies for performance.
    * Examples: `Array`, `Set`, `Map`, and more.
  * For [#lists](#function-islist): equivalent to above for arrays.
  * For [#iterators](#function-iterator): exhausts the iterator, returning an array of indexes equivalent to `f.span(f.len(iterator))`. See [#`span`](#function-span) and [#`len`](#function-len).
  * For [#structs](#function-isstruct): equivalent to [`Object.keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys).
