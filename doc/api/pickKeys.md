Signature: `({[Key: A]}, keys) => {[Key: A]}`.

Returns a version of the given dict, keeping only the given properties. Keys can be either a `Set` or an arbitrary [#sequence](#function-arr). Each key must satisfy [#`isKey`](#function-iskey). Existence is not required: missing properties are silently ignored. Returns an empty dict if the input is [#nil](#function-isnil).
