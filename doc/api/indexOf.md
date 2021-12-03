Like [`Array.prototype.indexOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf). Differences:

  * Uses [#`is`](#function-is) rather than `===`, therefore able to detect `NaN`.
  * Input may be [#nil](#function-isnil) or any [#list](#function-islist).
