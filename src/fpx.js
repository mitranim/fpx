/* eslint-disable no-invalid-this, prefer-spread */

// These aliases are minifiable. At the time of writing, this saves us more than
// 100 bytes in the full minified bundle, without tree shaking. It also reduces
// the _minimum_ amount of garbage left after tree shaking.
const Object_  = Object
const OP       = Object_.prototype
const Array_   = Array
const AP       = Array_.prototype

/**
 * Fun
 */

export function call(fun) {
  validate(fun, isFunction)
  arguments[0] = this  // relies on strict mode
  return fun.call.apply(fun, arguments)
}

export function apply(fun, args) {
  validate(fun, isFunction)
  validate(args, isList)
  return fun.apply(this, args)
}

export function bind(fun) {
  return fun.bind.apply(fun, arguments)
}

export function and() {
  return compose(composeAnd, arguments)
}

function composeAnd(fun, funs) {
  return function and_() {
    return foldlWith(funs, fun(...arguments), stepAnd, arguments)
  }
}

function stepAnd(acc, fun, index, args) {
  return acc && fun(...args)
}

export function or() {
  return compose(composeOr, arguments)
}

function composeOr(fun, funs) {
  return function or_() {
    return foldlWith(funs, fun(...arguments), stepOr, arguments)
  }
}

function stepOr(acc, fun, index, args) {
  return acc || fun(...args)
}

export function not(fun) {
  validate(fun, isFunction)
  return function not_() {return !fun(...arguments)}
}

export function ifelse(test, left, right) {
  validate(test, isFunction)
  validate(left, isFunction)
  validate(right, isFunction)
  return function ifelse_() {
    return (test(...arguments) ? left : right)(...arguments)
  }
}

export function ifthen(test, fun) {
  return ifelse(test, fun, noop)
}

export function ifonly(test, fun) {
  return ifelse(test, fun, id)
}

export function ifexists(fun) {
  return ifthen(id, fun)
}

export function cond(test, fun) {
  if (!arguments.length) return noop
  validate(test, isFunction)
  if (arguments.length === 1) return test
  return ifelse(test, fun, cond(...slice(arguments, 2)))
}

export function pipe() {
  return compose(composePipe, arguments)
}

function composePipe(fun, funs) {
  return function pipe_() {
    return funs.reduce(callRight, fun(...arguments), this)
  }
}

function callRight(value, fun) {
  return fun(value)
}

export function comp() {
  return pipe(...reverse(arguments))
}

export function seq() {
  return compose(composeSeq, arguments)
}

function composeSeq(fun, funs) {
  return function seq_() {
    return foldlWith(funs, fun(...arguments), stepSeq, arguments)
  }
}

function stepSeq(_, fun, __, args) {
  return fun(...args)
}

export function pipeAnd() {
  return compose(composePipeAnd, arguments)
}

function composePipeAnd(fun, funs) {
  return pipe(fun, function pipeAnd_(value) {
    return funs.reduce(stepPipeAnd, value, this)
  })
}

function stepPipeAnd(acc, fun) {
  return acc && fun(acc)
}

export function compAnd() {
  return pipeAnd(...reverse(arguments))
}

export function juxt() {
  const funs = arguments
  validateEach(funs, isFunction)
  return function juxt_() {
    return AP.map.call(funs, applySelf, arguments)
  }
}

function applySelf(fun) {
  return fun(...this)
}

export function rest(fun) {
  validate(fun, isFunction)
  return function rest_() {return fun(slice(arguments))}
}

export function spread(fun) {
  validate(fun, isFunction)
  return bind(apply, fun)
}

export function alter(fun) {
  validate(fun, isFunction)
  return pipe(bind(prepend, slice(arguments, 1)), spread(fun))
}

function compose(composerFun, funs) {
  if (!funs.length) return id
  const fun = funs[0]
  validate(fun, isFunction)
  if (funs.length === 1) return fun
  const rest = slice(funs, 1)
  validateEach(rest, isFunction)
  return composerFun(fun, rest)
}

/**
 * Bool
 */

export const bool = Boolean
export const truthy = bool

export const negate = falsy
export function falsy(value) {return !value}

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
  return value !== value  // eslint-disable-line no-self-compare
}

// In V8, seems to be slightly faster than comparing to both Infinity and -Infinity
export function isInfinity(value) {
  return typeof value === 'number' && Math.abs(value) === Infinity
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

export const isPlainObject = isDict
export function isDict(value) {
  return isObject(value) && isPlainPrototype(Object_.getPrototypeOf(value))
}

function isPlainPrototype(value) {
  return value === null || value === OP
}

export function isArray(value) {
  return isInstance(value, Array_)
}

// Could be made much faster in V8 by retrieving the prototype before checking
// any properties. Should check other engines before making such "weird"
// optimizations.
export function isList(value) {
  return isObject(value) && isNatural(value.length) && (
    !isPlainPrototype(Object_.getPrototypeOf(value)) ||
    OP.hasOwnProperty.call(value, 'callee')
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

export function testBy(value, pattern) {
  return (
    isFunction(pattern)  ? pattern(value) :
    isPrimitive(pattern) ? is(value, pattern) :
    isRegExp(pattern)    ? pattern.test(value) :
    isList(pattern)      ? isList(value) && AP.every.call(pattern, testByIndex, value) :
    isComplex(pattern)   ? testComplex(value, pattern) :
    false
  )
}

function testByIndex(pattern, i) {
  return testBy(this[i], pattern)
}

function testComplex(value, pattern) {
  if (!isComplex(value)) return false
  for (const key in pattern) if (!testBy(value[key], pattern[key])) return false
  return true
}

export function test(pattern) {
  return function test_(value) {return testBy(value, pattern)}
}

export function testAnd() {
  return and(...map(arguments, test))
}

export function testOr() {
  return or(...map(arguments, test))
}

export function testArgsAnd() {
  return and(...map(arguments, testAtIndex))
}

export function testArgsOr() {
  return or(...map(arguments, testAtIndex))
}

function testAtIndex(pattern, i) {
  return function testAtIndex_() {
    return testBy(arguments[i], pattern)
  }
}

/**
 * List
 */

export function list() {
  return slice(arguments)
}

export function foldl(list, init, fun) {
  return AP.reduce.call(toList(list), fun, init, this)
}

export function foldr(list, init, fun) {
  return AP.reduceRight.call(toList(list), fun, init, this)
}

function foldlWith(list, acc, fun, a, b) {
  for (let i = 0; i < list.length; i += 1) acc = fun(acc, list[i], i, a, b)
  return acc
}

export function map(list, fun) {
  validate(fun, isFunction)
  return AP.map.call(toList(list), fun, this)
}

export function filter(list, fun) {
  validate(fun, isFunction)
  return AP.filter.call(toList(list), fun, this)
}

export function find(list, fun) {
  validate(fun, isFunction)
  return AP.find.call(toList(list), fun, this)
}

export function every(list, fun) {
  validate(fun, isFunction)
  return AP.every.call(toList(list), fun, this)
}

export function some(list, fun) {
  validate(fun, isFunction)
  return AP.some.call(toList(list), fun, this)
}

export function procure(list, fun) {
  validate(fun, isFunction)
  list = toList(list)
  for (let i = 0; i < list.length; i += 1) {
    const result = fun.call(this, list[i], i)
    if (result) return result
  }
  return undefined
}

export function includes(list, value) {
  return indexOf(list, value) !== -1
}

export function indexOf(list, value) {
  if (!isList(list)) return -1
  for (let i = 0; i < list.length; i += 1) if (is(list[i], value)) return i
  return -1
}

export function slice() {
  return AP.slice.call.apply(AP.slice, arguments)
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
  validate(index, isNatural)
  list = toList(list)
  if (!(index <= list.length)) {
    throw Error(`Index ${index} out of bounds for length ${list.length}`)
  }
  list = slice(list)
  list.splice(index, 0, value)
  return list
}

export function removeAtIndex(list, index) {
  validate(index, isInteger)
  list = toList(list)
  if (isNatural(index) && index < list.length) {
    list = slice(list)
    list.splice(index, 1)
  }
  return list
}

export function adjoin(list, value) {
  return includes(list, value) ? list : append(list, value)
}

export function toggle(list, value) {
  return includes(list, value) ? remove(list, value) : append(list, value)
}

export function concat() {
  return foldl(arguments, [], concatTwo)
}

function concatTwo(left, right) {
  return left.concat(toArray(right))
}

export function flat(list) {
  return foldl(list, [], concatFlat)
}

function concatFlat(list, value) {
  return list.concat(isList(value) ? flat(value) : value)
}

export const first = head
export function head(list) {
  return isList(list) ? list[0] : undefined
}

export function tail(list) {
  return isList(list) ? slice(list, 1) : []
}

export function init(list) {
  return isList(list) ? slice(list, 0, -1) : []
}

export function last(list) {
  return isList(list) ? list[list.length - 1] : undefined
}

export function take(list, count) {
  validate(count, isNumber)
  return isList(list) ? slice(list, 0, count) : []
}

export function drop(list, count) {
  validate(count, isNumber)
  return isList(list) ? slice(list, count) : []
}

export function reverse(list) {
  return isList(list) ? slice(list).reverse() : []
}

function toList(value) {
  return isList(value) ? value : []
}

function toArray(value) {
  return isArray(value) ? value : isList(value) ? slice(value) : []
}

/**
 * Dict
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

export function getAt(path, value) {
  return getIn(value, path)
}

export function mapVals(dict, fun) {
  validate(fun, isFunction)
  const out = {}
  for (const key in dict) out[key] = fun(dict[key], key)
  return out
}

export function mapKeys(dict, fun) {
  validate(fun, isFunction)
  const out = {}
  for (const key in dict) {
    const prop = dict[key]
    out[fun(key, prop)] = prop
  }
  return out
}

/**
 * Coll
 */

export function keys(value) {
  return isComplex(value) ? Object_.keys(value) : []
}

export function values(value) {
  return isArray(value)
    ? value
    : isList(value)
    ? slice(value)
    : isComplex(value)
    ? Object_.keys(value).map(bind(get, value))
    : []
}

// Note: functions have a `.length` property that specifies the parameter count.
// We consider their size to be 0.
export function size(value) {
  return isList(value)
    ? value.length
    : isObject(value)
    ? Object_.keys(value).length
    : 0
}

/**
 * Ops
 */

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

/**
 * Misc
 */

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

export function maskBy(value, pattern) {
  return (
    isFunction(pattern)  ? pattern(value) :
    isPrimitive(pattern) ? pattern :
    isRegExp(pattern)    ? pattern.test(value) :
    isList(pattern)      ? AP.map.call(pattern, maskByIndex, toList(value)) :
    isComplex(pattern)   ? maskDict(value, pattern) :
    undefined
  )
}

function maskByIndex(pattern, i) {
  return maskBy(this[i], pattern)
}

function maskDict(value, pattern) {
  const out = {}
  for (const key in pattern) out[key] = maskBy(get(value, key), pattern[key])
  return out
}

export function mask(pattern) {
  return function mask_(value) {return maskBy(value, pattern)}
}

export function validate(value, test) {
  if (!isFunction(test)) throw Error(`Expected validator function, got ${show(test)}`)
  if (!test(value)) throw Error(`Expected ${show(value)} to satisfy test ${show(test)}`)
}

export function validateEach(list, test) {
  validate(list, isList)
  for (let i = 0; i < list.length; i += 1) {
    if (!test(list[i])) {
      throw Error(`Expected ${show(list[i])} at index ${i} to satisfy test ${show(test)}`)
    }
  }
}

export function show(value) {
  return (
    isFunction(value) && value.name
    ? value.name
    : isArray(value) || isDict(value)
    ? JSON.stringify(value)
    : String(value)
  )
}
