Signature: `({[Key: A]}, A => bool) => {[Key: A]}`.

Similar to [#`filter`](#function-filter) but for dicts. Returns a version of the given dict with only the properties for which `fun` returned something truthy. Returns an empty dict if the input is [#nil](#function-isnil).
