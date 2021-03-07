// See implementation notes in `impl.md`.

/** Fun **/

export function call(fun, ...args) {
  return fun(...args)
}

export function apply(fun, args) {
  return fun(...args)
}

export function bind(fun, ...args) {
  return fun.bind(undefined, ...args)
}

export function not(fun) {
  validate(fun, isFunction)
  return function not_() {return !fun(...arguments)}
}

/** Bool **/

// Same as global `Boolean`, redefined for symmetry with `negate/falsy`.
export const bool = truthy

export function truthy(value) {
  return !!value // eslint-disable-line no-implicit-coercion
}

export const negate = falsy
export function falsy(value) {
  return !value
}

export function is(one, other) {
  return one === other || (isNaN(one) && isNaN(other))
}

export function isNumber(value) {
  return typeof value === 'number'
}

export function isFinite(value) {
  return isNumber(value) && !isNaN(value) && !isInfinity(value)
}

export function isInteger(value) {
  return isNumber(value) && ((value % 1) === 0)
}

export function isNatural(value) {
  return isInteger(value) && value >= 0
}

export function isNaN(value) {
  return value !== value // eslint-disable-line no-self-compare
}

export function isInfinity(value) {
  return value === Infinity || value === -Infinity
}

// Tentative, private for now.
function isNaturalOrInfinity(value) {
  return isNatural(value) || isInfinity(value)
}

export function isString(value) {
  return typeof value === 'string'
}

export function isBoolean(value) {
  return typeof value === 'boolean'
}

export function isSymbol(value) {
  return typeof value === 'symbol'
}

export function isKey(value) {
  return isString(value) || isSymbol(value) || isBoolean(value) || isFinite(value)
}

export function isPrimitive(value) {
  return !isComplex(value)
}

export function isComplex(value) {
  return isObject(value) || isFunction(value)
}

export function isInstance(value, Class) {
  return isComplex(value) && value instanceof Class
}

export function isFunction(value) {
  return typeof value === 'function'
}

export function isObject(value) {
  return value !== null && typeof value === 'object'
}

export function isDict(value) {
  if (!isObject(value)) return false
  const proto = Object.getPrototypeOf(value)
  return proto === null || proto === Object.prototype
}

export function isStruct(value) {
  return isObject(value) && !isList(value)
}

export function isArray(value) {
  return isInstance(value, Array)
}

export function isList(value) {
  return isObject(value) && (
    isArray(value) || (
      isNatural(value.length) && (!isDict(value) || has(value, 'callee'))
    )
  )
}

export function isRegExp(value) {
  return isInstance(value, RegExp)
}

export function isDate(value) {
  return isInstance(value, Date)
}

export function isValidDate(value) {
  return isDate(value) && isFinite(value.valueOf())
}

export function isInvalidDate(value) {
  return isDate(value) && !isValidDate(value)
}

export function isPromise(value) {
  return isComplex(value) && isFunction(value.then) && isFunction(value.catch)
}

export function isIterator(value) {
  return (
    isObject(value) &&
    isFunction(value.next) &&
    isFunction(value.return) &&
    isFunction(value.throw)
  )
}

export function isNil(value) {
  return value == null
}

export function isSomething(value) {
  return value != null
}

export function isEmpty(value) {
  return !size(value)
}

export function has(val, key) {
  return isComplex(val) && Object.prototype.hasOwnProperty.call(val, key)
}

export function testBy(value, pattern) {
  return (
    isFunction(pattern)  ? bool(pattern(value)) :
    isPrimitive(pattern) ? is(value, pattern) :
    isRegExp(pattern)    ? isString(value) && pattern.test(value) :
    isDate(pattern)      ? isDate(value) && is(pattern.valueOf(), value.valueOf()) :
    isList(pattern)      ? isList(value) && every(pattern, testAt, value) :
    isStruct(pattern)    ? isStruct(value) && everyVal(pattern, testAt, value) :
    false
  )
}

function testAt(pattern, key, value) {
  return testBy(value[key], pattern)
}

export function test(pattern) {
  return function test_(value) {return testBy(value, pattern)}
}

/** Casts **/

export function onlyString(value) {
  if (value == null) return ''
  validate(value, isString)
  return value
}

export function onlyList(value) {
  if (value == null) return []
  validate(value, isList)
  return value
}

export function onlyDict(value) {
  if (value == null) return {}
  validate(value, isDict)
  return value
}

export function onlyStruct(value) {
  if (value == null) return {}
  validate(value, isStruct)
  return value
}

export function toArray(value) {
  return isArray(value) ? value : slice(value)
}

/** List **/

export function each(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  for (let i = 0; i < list.length; i += 1) fun(list[i], i, ...args)
}

export function fold(list, acc, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  for (let i = 0; i < list.length; i += 1) acc = fun(acc, list[i], i, ...args)
  return acc
}

export function foldRight(list, acc, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  for (let i = list.length - 1; i >= 0; i -= 1) acc = fun(acc, list[i], i, ...args)
  return acc
}

export function map(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  const out = Array(list.length)
  for (let i = 0; i < list.length; i += 1) out[i] = fun(list[i], i, ...args)
  return out
}

export function flatMap(list, fun, ...args) {
  return flatten(map(list, fun, ...args))
}

export function flatMapDeep(list, fun, ...args) {
  return flattenDeep(map(list, fun, ...args))
}

export function mapFilter(list, fun, ...args) {
  return compact(map(list, fun, ...args))
}

export function filter(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  const out = []
  for (let i = 0; i < list.length; i += 1) {
    if (fun(list[i], i, ...args)) out.push(list[i])
  }
  return out
}

export function reject(list, fun, ...args) {
  validate(fun, isFunction)
  return filter(list, notBy, fun, ...args)
}

function notBy(value, key, fun, ...args) {
  return !fun(value, key, ...args)
}

export function compact(list) {
  return filter(list, id)
}

export function find(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  return list[findIndex(list, fun, ...args)]
}

export function findRight(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  return list[findIndexRight(list, fun, ...args)]
}

export function findIndex(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  for (let i = 0; i < list.length; i += 1) {
    if (fun(list[i], i, ...args)) return i
  }
  return -1
}

export function findIndexRight(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  for (let i = list.length; --i >= 0;) {
    if (fun(list[i], i, ...args)) return i
  }
  return -1
}

export function indexOf(list, value) {
  return findIndex(list, isAt, value)
}

export function lastIndexOf(list, value) {
  return findIndexRight(list, isAt, value)
}

function isAt(candidate, _i, value) {
  return is(candidate, value)
}

export function includes(list, value) {
  return indexOf(list, value) !== -1
}

export function procure(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  for (let i = 0; i < list.length; i += 1) {
    const result = fun(list[i], i, ...args)
    if (result) return result
  }
  return undefined
}

export function every(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  for (let i = 0; i < list.length; i += 1) {
    if (!fun(list[i], i, ...args)) return false
  }
  return true
}

export function some(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  for (let i = 0; i < list.length; i += 1) {
    if (fun(list[i], i, ...args)) return true
  }
  return false
}

export function slice(list, start, nextStart) {
  return Array.prototype.slice.call(onlyList(list), start, nextStart)
}

export function append(list, value) {
  return toArray(list).concat([value])
}

export function prepend(list, value) {
  return [value].concat(toArray(list))
}

export function remove(list, value) {
  return removeAtIndex(list, indexOf(list, value))
}

export function insertAtIndex(list, index, value) {
  list = slice(list)
  validate(index, isNatural)
  if (!(index <= list.length)) {
    throw Error(`index ${index} out of bounds for length ${list.length}`)
  }
  list.splice(index, 0, value)
  return list
}

export function removeAtIndex(list, index) {
  list = onlyList(list)
  validate(index, isInteger)
  if (isNatural(index) && index < list.length) {
    list = slice(list)
    list.splice(index, 1)
  }
  return list
}

export function adjoin(list, value) {
  return includes(list, value) ? toArray(list) : append(list, value)
}

export function toggle(list, value) {
  return includes(list, value) ? remove(list, value) : append(list, value)
}

// Uses native concat because it seems to perform very well in many JS engines.
export function concat() {
  return [].concat(...map(arguments, toArray))
}

/*
This could be made more efficient for very large and deep lists by
precalculating the length and allocating the result all at once. Unfortunately
this requires quite a bit of extra code and would be slower for relatively small
lists. It would also be faster to use native array concat, but I haven't found a
way to bypass `.apply`/spread and the argument size limit.
*/
export function flatten(list) {
  const out = []
  each(list, pushFlat, out)
  return out
}

function pushFlat(value, _i, out) {
  if (isList(value)) for (let i = 0; i < value.length; i += 1) out.push(value[i])
  else out.push(value)
}

export function flattenDeep(list) {
  const out = []
  each(list, pushFlatDeep, out)
  return out
}

function pushFlatDeep(value, _key, out) {
  if (isList(value)) each(value, pushFlatDeep, out)
  else out.push(value)
}

export const first = head
export function head(list) {
  return onlyList(list)[0]
}

export function tail(list) {
  return slice(list, 1)
}

export function init(list) {
  list = onlyList(list)
  return slice(list, 0, list.length - 1)
}

export function last(list) {
  list = onlyList(list)
  return list[list.length - 1]
}

export function take(list, count) {
  validate(count, isNaturalOrInfinity)
  return slice(list, 0, count)
}

export function drop(list, count) {
  validate(count, isNaturalOrInfinity)
  return slice(list, count)
}

export function reverse(list) {
  list = onlyList(list)
  const len = list.length
  const out = Array(len)
  for (let i = len; --i >= 0;) out[len - i - 1] = list[i]
  return out
}

export function sort(list, comparator) {
  return slice(list).sort(comparator)
}

export function sortBy(list, fun, ...args) {
  validate(fun, isFunction)
  return sort(list, function compareBy(left, right) {
    return sortCompare(fun(left, ...args), fun(right, ...args))
  })
}

// https://tc39.github.io/ecma262/#sec-sortcompare
function sortCompare(left, right) {
  if (left === undefined && right === undefined) return 0
  if (left === undefined) return 1
  if (right === undefined) return -1
  left += '' // eslint-disable-line no-implicit-coercion
  right += '' // eslint-disable-line no-implicit-coercion
  if (left < right) return -1
  if (right < left) return 1
  return 0
}

export function intersection(left, right) {
  left = onlyList(left)
  right = onlyList(right)
  const lr = left.length <= right.length
  const lesser = lr ? left : right
  const greater = lr ? right : left
  const out = []
  each(greater, intersectionAdd, out, lesser)
  return out
}

function intersectionAdd(value, _key, out, control) {
  if (includes(control, value) && !includes(out, value)) out.push(value)
}

export function keyBy(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  const out = {}
  for (let i = 0; i < list.length; i += 1) {
    const value = list[i]
    const key = fun(value, i, ...args)
    if (isKey(key)) out[key] = value
  }
  return out
}

export function groupBy(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  const out = {}
  for (let i = 0; i < list.length; i += 1) {
    const value = list[i]
    const groupKey = fun(value, i, ...args)
    if (isKey(groupKey)) {
      if (!has(out, groupKey)) out[groupKey] = []
      out[groupKey].push(value)
    }
  }
  return out
}

export function uniq(list) {
  return uniqBy(list, id)
}

export function uniqBy(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  const out = []
  const attrs = []
  for (let i = 0; i < list.length; i += 1) {
    const value = list[i]
    const attr = fun(value, i, ...args)
    if (!includes(attrs, attr)) {
      attrs.push(attr)
      out.push(value)
    }
  }
  return out
}

export function partition(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  const accepted = []
  const rejected = []
  for (let i = 0; i < list.length; i += 1) {
    const value = list[i]
    if (fun(value, i, ...args)) accepted.push(value)
    else rejected.push(value)
  }
  return [accepted, rejected]
}

export function sum(list) {
  return sumBy(list, id)
}

export function sumBy(list, fun, ...args) {
  list = onlyList(list)
  validate(fun, isFunction)
  let acc = 0
  for (let i = 0; i < list.length; i += 1) {
    const value = fun(list[i], i, ...args)
    if (isFinite(value)) acc += value
  }
  return acc
}

export function min(list) {
  return minBy(list, id)
}

export function max(list) {
  return maxBy(list, id)
}

export function minBy(list, fun, ...args) {
  validate(fun, isFunction)
  return fold(list, undefined, compareNumbersBy, lt, fun, ...args)
}

export function maxBy(list, fun, ...args) {
  validate(fun, isFunction)
  return fold(list, undefined, compareNumbersBy, gt, fun, ...args)
}

function compareNumbersBy(acc, value, key, compare, fun, ...args) {
  value = fun(value, key, ...args)
  return !isFinite(value)
    ? acc
    : !isFinite(acc) || compare(value, acc)
    ? value
    : acc
}

export function findMinBy(list, fun, ...args) {
  validate(fun, isFunction)
  return findNumBy(list, lt, fun, ...args)
}

export function findMaxBy(list, fun, ...args) {
  validate(fun, isFunction)
  return findNumBy(list, gt, fun, ...args)
}

// WTF too large!
function findNumBy(list, compare, fun, ...args) {
  list = onlyList(list)
  validate(compare, isFunction)
  validate(fun, isFunction)
  let winningValue = undefined
  let winningAttr = undefined
  for (let i = 0; i < list.length; i += 1) {
    const value = list[i]
    const attr = fun(value, i, ...args)
    if (isFinite(attr) && (winningAttr == null || compare(attr, winningAttr))) {
      winningValue = value
      winningAttr = attr
    }
  }
  return winningValue
}

export function range(start, end) {
  validate(start, isInteger)
  validate(end, isInteger)
  let remaining = end - start
  // Note: this rejects negatives, producing a decent error message.
  const out = Array(remaining)
  while (--remaining >= 0) out[remaining] = start + remaining
  return out
}

/**
 * Struct
 */

export function get(value, key) {
  return value == null ? undefined : value[key]
}

export function scan(value) {
  for (let i = 1; i < arguments.length; i += 1) value = get(value, arguments[i])
  return value
}

export function getIn(value, path) {
  validate(path, isList)
  for (let i = 0; i < path.length; i += 1) value = get(value, path[i])
  return value
}

export function getter(key) {
  validate(key, isKey)
  return function get_(value) {return get(value, key)}
}

// Like `Object.keys`, but only for non-list objects.
export function keys(value) {
  return Object.keys(onlyStruct(value))
}

// Like `Object.values`, but only for non-list objects.
export function values(value) {
  const out = keys(value)
  for (let i = 0; i < out.length; i += 1) out[i] = value[out[i]]
  return out
}

// Like `Object.entries`, but only for non-list objects.
export function entries(value) {
  const out = keys(value)
  for (let i = 0; i < out.length; i += 1) out[i] = [out[i], value[out[i]]]
  return out
}

export function eachVal(struct, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const inputKeys = keys(struct)
  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i]
    fun(struct[key], key, ...args)
  }
}

export function foldVals(struct, acc, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const inputKeys = keys(struct)
  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i]
    acc = fun(acc, struct[key], key, ...args)
  }
  return acc
}

export function mapVals(struct, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const out = {}
  const inputKeys = keys(struct)
  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i]
    out[key] = fun(struct[key], key, ...args)
  }
  return out
}

/*
Note: there's no corresponding `mapKeysMut`. The point of in-place mapping is
efficiency. In this case, the possibility of key collisions would require an
additional temporary structure for book-keeping, negating any possible gains.
*/
export function mapKeys(struct, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const out = {}
  const inputKeys = keys(struct)
  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i]
    const value = struct[key]
    const newKey = fun(key, value, ...args)
    if (isKey(newKey)) out[newKey] = value
  }
  return out
}

export function mapValsSort(struct, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const out = keys(struct).sort()
  for (let i = -1; ++i < out.length;) {
    const key = out[i]
    out[i] = fun(struct[key], key, ...args)
  }
  return out
}

// TODO rename to `filterVals`.
export function pickBy(struct, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const out = {}
  const inputKeys = keys(struct)
  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i]
    const value = struct[key]
    if (fun(value, key, ...args)) out[key] = value
  }
  return out
}

// TODO rename to `rejectVals`.
export function omitBy(struct, fun, ...args) {
  validate(fun, isFunction)
  return pickBy(struct, notBy, fun, ...args)
}

// TODO: consider `keys = onlyList(keys)`.
// TODO: consider renaming to `pickByKeys` or `pick`.
export function pickKeys(struct, keys) {
  struct = onlyStruct(struct)
  validateEach(keys, isKey)
  const out = {}
  each(keys, pickKnown, struct, out)
  return out
}

function pickKnown(key, _i, src, out) {
  if (has(src, key)) out[key] = src[key]
}

// TODO: consider `keys = onlyList(keys)`.
// TODO: consider renaming to `omitByKeys` or `omit`.
export function omitKeys(struct, keys) {
  validateEach(keys, isKey)
  const out = {}
  assign(out, struct)
  each(keys, deleteAt, out)
  return out
}

function deleteAt(key, _i, out) {
  delete out[key]
}

export function findVal(struct, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const inputKeys = keys(struct)
  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i]
    const value = struct[key]
    if (fun(value, key, ...args)) return value
  }
  return undefined
}

export function findKey(struct, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const inputKeys = keys(struct)
  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i]
    if (fun(struct[key], key, ...args)) return key
  }
  return undefined
}

export function everyVal(struct, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const inputKeys = keys(struct)
  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i]
    if (!fun(struct[key], key, ...args)) return false
  }
  return true
}

export function someVal(struct, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const inputKeys = keys(struct)
  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i]
    if (fun(struct[key], key, ...args)) return true
  }
  return false
}

export function invert(struct) {
  return invertBy(struct, id)
}

export function invertBy(struct, fun, ...args) {
  struct = onlyStruct(struct)
  validate(fun, isFunction)
  const out = {}
  const inputKeys = keys(struct)
  for (let i = 0; i < inputKeys.length; i += 1) {
    const key = inputKeys[i]
    const newKey = fun(struct[key], key, ...args)
    if (isKey(newKey)) out[newKey] = key
  }
  return out
}

/** Coll **/

/*
Only collections (lists and objects) have a size. Functions and primitives,
including strings, are considered empty.

TODO consider requiring the input to be a collection or nil, and producing an
exception otherwise.
*/
export function size(value) {
  return isList(value)
    ? value.length
    : isObject(value)
    ? keys(value).length
    : 0
}

export function vacate(value) {
  return size(value) ? value : undefined
}

/** Ops **/

export function add(a, b) {return a + b}
export function sub(a, b) {return a - b}
export function mul(a, b) {return a * b}
export function div(a, b) {return a / b}
export function rem(a, b) {return a % b}
export function lt(a, b)  {return a < b}
export function gt(a, b)  {return a > b}
export function lte(a, b) {return a <= b}
export function gte(a, b) {return a >= b}
export function inc(a)    {return a + 1}
export function dec(a)    {return a - 1}

/** Misc **/

// The "pure" annotation allows UglifyJS to drop this if the result is unused.
export const global = /* #__PURE__ */Function('return this')() // eslint-disable-line no-new-func

export function id(value) {
  return value
}

export function di(_, value) {
  return value
}

export function val(value) {
  return bind(id, value)
}

export function noop() {}

export function rethrow(value) {
  throw value
}

export function assign(target) {
  validate(target, isComplex)
  for (let i = 1; i < arguments.length; ++i) {
    eachVal(arguments[i], setAt, target)
  }
}

function setAt(value, key, target) {
  target[key] = value
}

export function maskBy(value, pattern) {
  return (
    isFunction(pattern)  ? pattern(value) :
    isPrimitive(pattern) ? pattern :
    isRegExp(pattern)    ? onlyString(value).match(pattern) :
    isList(pattern)      ? map(pattern, maskAt, onlyList(value)) :
    isStruct(pattern)    ? mapVals(pattern, maskAt, onlyStruct(value)) :
    undefined
  )
}

function maskAt(pattern, key, value) {
  return maskBy(value[key], pattern)
}

export function mask(pattern) {
  return function mask_(value) {return maskBy(value, pattern)}
}

export function validate(value, test) {
  if (!isFunction(test)) {
    throw Error(`expected validator function, got ${show(test)}`)
  }
  if (!test(value)) {
    throw Error(`expected ${show(value)} to satisfy test ${show(test)}`)
  }
}

export function validateEach(list, test) {
  validate(list, isList)
  for (let i = 0; i < list.length; i += 1) {
    if (!test(list[i])) {
      throw Error(`expected ${show(list[i])} at index ${i} to satisfy test ${show(test)}`)
    }
  }
}

export function validateInstance(value, Class) {
  if (!isInstance(value, Class)) {
    throw Error(`expected ${show(value)} to be an instance of ${show(Class)}`)
  }
}

export function show(value) {
  if (isFunction(value) && value.name) return value.name

  // Plain data becomes JSON, if possible.
  if (isArray(value) || isDict(value) || isString(value)) {
    try {
      return JSON.stringify(value)
    }
    catch (__) {
      return `${value}`
    }
  }

  return `${value}`
}
