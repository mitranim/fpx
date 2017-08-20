/* eslint-disable no-invalid-this, prefer-spread */

const {getPrototypeOf, prototype: protoObject, keys: getKeys} = Object
const {
  slice: nslice, reduce, reduceRight, map: nmap, find: nfind,
  filter: nfilter, every: nevery, some: nsome,
} = Array.prototype

// Fun

export function call(fun) {
  validate(isFunction, fun)
  arguments[0] = this  // relies on strict mode
  return fun.call.apply(fun, arguments)
}

export function apply(fun, args) {
  validate(isFunction, fun)
  validate(isList, args)
  return fun.apply(this, args)
}

// Much slower than a version that doesn't preserve "this"
// TODO figure out how to make it go faster, or abandon the preservation of "this"
export function bind(fun) {
  return applyBind(fun, slice(arguments, 1))
}

export function applyBind(fun, args) {
  validate(isFunction, fun)
  validate(isList, args)
  if (!isArray(args)) args = slice(args)
  return function bound() {
    return fun.apply(this, args.concat(slice(arguments)))
  }
}

export function curry1(fun) {
  validate(isFunction, fun)
  return applyBind(bind, arguments)
}

export function flip(fun) {
  validate(isFunction, fun)
  return function flip_() {
    return fun.apply(this, slice(arguments).reverse())
  }
}

// TODO should be expressed in terms of seq, or built from same primitives as seq
export function and() {
  return compose(composeAnd, arguments)
}

function composeAnd(fun, funs) {
  return function and_() {
    return foldlWith.call(this, stepAnd, fun.apply(this, arguments), funs, arguments)
  }
}

function stepAnd(acc, fun, index, args) {
  return acc && fun.apply(this, args)
}

// TODO should be expressed in terms of seq, or built from same primitives as seq
export function or() {
  return compose(composeOr, arguments)
}

function composeOr(fun, funs) {
  return function or_() {
    return foldlWith.call(this, stepOr, fun.apply(this, arguments), funs, arguments)
  }
}

function stepOr(acc, fun, index, args) {
  return acc || fun.apply(this, args)
}

export function not(fun) {
  validate(isFunction, fun)
  return function not_() {return !fun.apply(this, arguments)}
}

export function ifelse(test, left, right) {
  validate(isFunction, test)
  validate(isFunction, left)
  validate(isFunction, right)
  return function ifelse_() {
    return (test.apply(this, arguments) ? left : right).apply(this, arguments)
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
  validate(isFunction, test)
  if (arguments.length === 1) return test
  return ifelse(test, fun, cond(...slice(arguments, 2)))
}

export function pipe() {
  return compose(composePipe, arguments)
}

function composePipe(fun, funs) {
  return function pipe_() {
    return funs.reduce(callRight, fun.apply(this, arguments), this)
  }
}

function callRight(value, fun) {
  return fun.call(this, value)
}

export function comp() {
  return pipe(...reverse(arguments))
}

export function seq() {
  return compose(composeSeq, arguments)
}

function composeSeq(fun, funs) {
  return function seq_() {
    return foldlWith.call(this, stepSeq, fun.apply(this, arguments), funs, arguments)
  }
}

function stepSeq(_, fun, __, args) {
  return fun.apply(this, args)
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
  return acc && fun.call(this, acc)
}

export function compAnd() {
  return pipeAnd(...reverse(arguments))
}

export function juxt() {
  const funs = slice(arguments)
  validateEach(isFunction, funs)
  return function juxt_() {
    return funs.map(applyRight.bind(this, arguments))
  }
}

function applyRight(args, fun) {
  return fun.apply(this, args)
}

export function rest(fun) {
  validate(isFunction, fun)
  return function rest_() {return fun.call(this, slice(arguments))}
}

export function spread(fun) {
  validate(isFunction, fun)
  return bind(apply, fun)
}

export function alter(fun) {
  validate(isFunction, fun)
  return pipe(bind(prepend, slice(arguments, 1)), spread(fun))
}

export function revise(transforms, fun) {
  validateEach(isFunction, transforms)
  validate(isFunction, fun)
  return function revise_() {
    return fun.apply(this, nmap.call(transforms, transmute, arguments))
  }
}

function transmute(fun, i) {
  return fun(this[i])
}

export function fanout(args, fun) {
  return pipe(juxt(...args), spread(fun))
}

export function funnel(value, funs) {
  validateEach(isFunction, funs)
  return funs.reduce(callRight, value, this)
}

function compose(composerFun, funs) {
  if (!funs.length) return id
  const fun = funs[0]
  validate(isFunction, fun)
  if (funs.length === 1) return fun
  const rest = slice(funs, 1)
  validateEach(isFunction, rest)
  return composerFun(fun, rest)
}

// Bool

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
  return isNumber(value) && !isNaN(value) && value !== Infinity && value !== -Infinity
}

export function isInteger(value) {
  return isFinite(value) && ((value % 1) === 0)
}

export function isNatural(value) {
  return isInteger(value) && value >= 0
}

export function isNaN(value) {
  return value !== value  // eslint-disable-line no-self-compare
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
  return isObject(value) && isPlainPrototype(getPrototypeOf(value))
}

// WTB better name, then publish and document.
// "Special object" has a special meaning in the ES spec, this ain't it.
function isSpecialObject(value) {
  return isObject(value) && (!isPlainPrototype(getPrototypeOf(value)) || isArguments(value))
}

// TODO consider documenting
function isArguments(value) {
  return isObject(value) && 'callee' in value && 'length' in value && isNatural(value.length)
}

function isPlainPrototype(value) {
  return value === null || value === protoObject
}

export function isArray(value) {
  return isInstance(value, Array)
}

export function isList(value) {
  return isSpecialObject(value) && 'length' in value && isNatural(value.length)
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

export function isNil(value) {
  return value == null
}

export function testBy(pattern, value) {
  return (
    isFunction(pattern)  ? pattern(value) :
    isPrimitive(pattern) ? is(pattern, value) :
    isRegExp(pattern)    ? pattern.test(value) :
    isList(pattern)      ? isList(value) && nevery.call(pattern, testByIndex, value) :
    isComplex(pattern)   ? testComplex(pattern, value) :
    false
  )
}

function testByIndex(pattern, i) {
  return testBy(pattern, this[i])
}

function testComplex(pattern, value) {
  if (!isComplex(value)) return false
  for (const key in pattern) if (!testBy(pattern[key], value[key])) return false
  return true
}

export function test(pattern) {
  return bind(testBy, pattern)
}

export function testAnd() {
  return and(...map(test, arguments))
}

export function testOr() {
  return or(...map(test, arguments))
}

export function testArgsAnd() {
  return and(...map(test, arguments).map(pin))
}

export function testArgsOr() {
  return or(...map(test, arguments).map(pin))
}

function pin(fun, i) {
  return function pin_() {
    return fun(arguments[i])
  }
}

// List

export function list() {
  return slice(arguments)
}

export function foldl(fun, acc, list) {
  return reduce.call(toList(list), fun, acc, this)
}

export function foldr(fun, acc, list) {
  return reduceRight.call(toList(list), fun, acc, this)
}

function foldlWith(fun, acc, list, a, b) {
  for (let i = -1; (i += 1) < list.length;) acc = fun.call(this, acc, list[i], i, a, b)
  return acc
}

export function map(fun, list) {
  validate(isFunction, fun)
  return nmap.call(toList(list), fun, this)
}

export function filter(fun, list) {
  validate(isFunction, fun)
  return nfilter.call(toList(list), fun, this)
}

export function find(fun, list) {
  validate(isFunction, fun)
  return nfind.call(toList(list), fun, this)
}

export function every(fun, list) {
  validate(isFunction, fun)
  return nevery.call(toList(list), fun, this)
}

export function some(fun, list) {
  validate(isFunction, fun)
  return nsome.call(toList(list), fun, this)
}

export function procure(fun, list) {
  validate(isFunction, fun)
  list = toList(list)
  for (let i = -1; (i += 1) < list.length;) {
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
  for (let i = -1; (i += 1) < list.length;) if (is(list[i], value)) return i
  return -1
}

export function slice() {
  return nslice.call.apply(nslice, arguments)
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

export function removeAtIndex(list, index) {
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
  return foldl(concatTwo, [], arguments)
}

function concatTwo(left, right) {
  return left.concat(toArray(right))
}

export function flat(list) {
  return foldl(concatFlat, [], list)
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

export function take(count, list) {
  validate(isNumber, count)
  return isList(list) ? slice(list, 0, count) : []
}

export function drop(count, list) {
  validate(isNumber, count)
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

// Dict

export function get(value, key) {
  return value == null ? undefined : value[key]
}

export function scan() {
  return arguments.length ? reduce.call(arguments, get) : undefined
}

export function getIn(value, path) {
  return reduce.call(path, get, value)
}

export function getAt(path, value) {
  return reduce.call(path, get, value)
}

export const mapVals = mapDict
export function mapDict(fun, value) {
  const out = {}
  for (const key in value) out[key] = fun(value[key], key)
  return out
}

export function mapKeys(fun, value) {
  const out = {}
  for (const key in value) {
    const prop = value[key]
    out[fun(prop, key)] = prop
  }
  return out
}

// Coll

export function keys(value) {
  return isComplex(value) ? getKeys(value) : []
}

export function values(value) {
  return isArray(value)
    ? value
    : isList(value)
    ? slice(value)
    : isComplex(value)
    ? getKeys(value).map(bind(get, value))
    : []
}

// Note we're not using isComplex here; function size is 0
export function size(value) {
  return isList(value) ? value.length : isObject(value) ? getKeys(value).length : 0
}

// Ops

export function add(a, b) {return a + b}
export function sub(a, b) {return a - b}
export function mul(a, b) {return a * b}
export function div(a, b) {return a / b}
export function inc(a)    {return a + 1}
export function dec(a)    {return a - 1}

// Misc

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

export function rethrow(val) {
  throw val
}

export function maskBy(pattern, value) {
  return (
    isFunction(pattern)  ? pattern(value) :
    isPrimitive(pattern) ? pattern :
    isRegExp(pattern)    ? pattern.test(value) :
    isList(pattern)      ? nmap.call(pattern, maskByIndex, (isList(value) ? value : [])) :
    isComplex(pattern)   ? maskComplex(pattern, value) :
    undefined
  )
}

function maskByIndex(pattern, i) {
  return maskBy(pattern, this[i])
}

function maskComplex(pattern, value) {
  const out = {}
  for (const key in pattern) out[key] = maskBy(pattern[key], get(value, key))
  return out
}

export function mask(pattern) {
  return bind(maskBy, pattern)
}

export function validate(test, value) {
  if (!test(value)) throw Error(`Expected ${show(value)} to satisfy test ${show(test)}`)
}

export function validateEach(test, list) {
  validate(isList, list)
  for (let i = -1; (i += 1) < list.length;) {
    if (!test(list[i])) {
      throw Error(`Expected ${show(list[i])} at index ${i} to satisfy test ${show(test)}`)
    }
  }
}

// Questionable
function show(value) {
  return isFunction(value) ? (value.name || value.toString()) : String(value)
}
