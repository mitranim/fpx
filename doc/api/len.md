Universal length measurement:

  * For non-objects: always 0.
  * For iterables:
    * For [#lists](#function-islist): same as `.length`.
    * For ES2015 collections such as `Set`: same as `.size`.
    * For iterators: exhausts the iterator, returning element count.
  * For [#structs](#function-isstruct): equivalent to `Object.keys(val).length`.
