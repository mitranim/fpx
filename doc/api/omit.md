Signature: `({[Key: A]}, A => bool) => {[Key: A]}`.

Similar to [#`reject`](#function-reject) but for dicts. Returns a version of the given dict without properties for which `fun` returned something truthy. Returns an empty dict if the input is [#nil](#function-isnil).
