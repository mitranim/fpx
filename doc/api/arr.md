Converts an arbitrary [#sequence](#function-isseq) to an array. Allows the following inputs:

  * [#Nil](#function-isnil): return `[]`.
  * [#Array](#function-isarr): return as-is.
  * [#List](#function-islist): convert via `Array.prototype.slice`.
  * [#Set](#function-isset) or arbitrary [#iterator](#function-isiterator): convert to array by iterating.

Unlike [#`values`](#function-values), `arr` rejects other inputs such as non-nil primitives, dicts, maps, arbitrary iterables, ensuring that the input is always a sequence.
