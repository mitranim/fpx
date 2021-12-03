Takes an arbitrary input and returns an array of its entries (key-value tuples):

  * For non-objects: always `[]`.
  * For [#iterables](#function-isiter) with `.entries()`: equivalent to converting the output of `.entries()` to an array. Implementation varies for performance.
    * Examples: `Set`, `Map`, and more.
  * For [#lists](#function-islist): equivalent to above for arrays.
  * For [#iterators](#function-iterator): exhausts the iterator, returning an array of entries where keys are indexes starting with 0.
  * For [#structs](#function-isstruct): equivalent to [`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries).
