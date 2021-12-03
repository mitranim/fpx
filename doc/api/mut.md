Signature: `(tar, src) => tar`.

Similar to [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). Differences:

  * Supports only one source argument.
  * Much faster.
  * Much safer:
    * Target must be a [#struct](#function-isstruct). Throws if target is a function or iterable.
    * Source must be nil or a struct. Throws if source is an iterable, non-nil primitive, etc.
    * Does not override inherited properties.
    * Does not override own non-enumerable properties.
