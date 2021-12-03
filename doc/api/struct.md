Similar to `val ?? Object.create(null)` but `val` must be [#nil](#function-isnil) or a [#struct](#function-isstruct), otherwise throws.

Most Fpx functions that operate on data structures, such as [#`filter`](#function-filter), support structs, treating them similarly to maps. A struct is considered a collection of its [#`values`](#function-values). Iterating over [#`keys`](#function-keys) or [#`entries`](#function-entries) is opt-in.
