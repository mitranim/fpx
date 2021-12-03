Same as `typeof val === 'object' && val !== null`. True for any JS object: plain dict, array, various other classes. Doesn't include functions, even though JS functions are extensible objects.

Note: this is _not_ equivalent to Lodash's `_.isObject`, which counts functions as objects. Use [#`isComp`](#function-iscomp) for that.

For plain objects used as dictionaries, see [#`isDict`](#function-isdict). For fancy non-list objects, see [#`isStruct`](#function-isstruct).
