'use strict'

const {getPrototypeOf, prototype: protoObject} = Object
const {slice: nslice, reduce, reduceRight, map: nmap, find: nfind,
       filter: nfilter, every} = Array.prototype
const pub = exports

// Fun

pub.call = call
function call (fun) {
  validate(isFunction, fun)
  arguments[0] = undefined  // relies on strict mode
  return fun.call.apply(fun, arguments)
}

pub.apply = apply
function apply (fun, args) {
  validate(isFunction, fun)
  return fun.apply(undefined, args)
}

pub.bind = bind
function bind (fun) {
  validate(isFunction, fun)
  arguments[0] = undefined  // relies on strict mode
  return fun.bind.apply(fun, arguments)
}

pub.flip = flip
function flip (fun) {
  validate(isFunction, fun)
  return function flip_ () {
    return fun(...slice(arguments).reverse())
  }
}

pub.and = and
function and () {
  const funs = slice(arguments)
  validateEach(isFunction, funs)
  return !funs.length
    ? id
    : function and_ () {return foldlWith(stepAnd, undefined, funs, arguments)}
}

function stepAnd (acc, fun, index, args) {
  return (!index || acc) && fun(...args)
}

pub.or = or
function or () {
  const funs = slice(arguments)
  validateEach(isFunction, funs)
  return !funs.length
    ? id
    : function or_ () {return foldlWith(stepOr, undefined, funs, arguments)}
}

function stepOr (acc, fun, _, args) {
  return acc || fun(...args)
}

pub.not = not
function not (fun) {
  validate(isFunction, fun)
  return function not_ () {return !fun(...arguments)}
}

pub.ifelse = ifelse
function ifelse (test, left, right) {
  validate(isFunction, test)
  validate(isFunction, left)
  validate(isFunction, right)
  return function ifelse_ () {
    return (test(...arguments) ? left : right)(...arguments)
  }
}

pub.ifthen = ifthen
function ifthen (test, fun) {
  return ifelse(test, fun, noop)
}

pub.ifonly = ifonly
function ifonly (test, fun) {
  return ifelse(test, fun, id)
}

pub.cond = cond
function cond (test, fun) {
  if (!arguments.length) return noop
  validate(isFunction, test)
  if (arguments.length === 1) return test
  return ifelse(test, fun, cond(...slice(arguments, 2)))
}

/**
 * piper arguments
 */
function pass (a, b) {
  return b
}

const original = pass
const result = id
const fnReduce = pass

function fnMap (res, acc) {
  return (res || []).concat(acc)
}

function piper (agg, arg, cnd) {
  return function pre () {
    const fun = arguments[0]
    if (!arguments.length) return id
    validate(isFunction, fun)
    if (arguments.length === 1) return fun
    const funs = arguments
    validateEach(isFunction, funs)
    return function pipe_ () {
      let acc = arguments
      let res
      for (let i = -1; ++i < funs.length;) {
        acc = [funs[i](...arg(acc, arguments))]
        if (cnd && !cnd(() => (acc[0]))()) return acc[0]
        res = agg(res, acc[0])
      }
      return res
    }
  }
}

pub.pipe = piper(fnReduce, result, and)

pub.comp = flip(pub.pipe)

pub.seq = piper(fnReduce, original)

pub.pipeAnd = piper(fnReduce, result, and)

pub.compAnd = flip(pub.pipeAnd)

pub.juxt = function juxt() {
  return or(piper(fnMap, original)(...arguments), () => [])
}

pub.defer = defer
function defer (fun) {
  validate(isFunction, fun)
  return _defer(...arguments)
}

const _defer = bind(bind, bind)

pub.rest = rest
function rest (fun) {
  validate(isFunction, fun)
  return function rest_ () {return fun(slice(arguments))}
}

pub.spread = spread
function spread (fun) {
  validate(isFunction, fun)
  return _spread(...arguments)
}

const _spread = defer(apply)

// Bool

pub.is = is
function is (one, other) {
  return one === other || one !== one && other !== other
}

pub.isNumber = isNumber
function isNumber (value) {
  return typeof value === 'number'
}

// Doesn't call the global `isFinite` to avoid infinite recursion if someone
// accidentally overwrites it with ours.
pub.isFinite = isFinite
function isFinite (value) {
  return isNumber(value) && !isNaN(value) && value !== Infinity && value !== -Infinity
}

pub.isNaN = isNaN
function isNaN (value) {
  return value !== value
}

pub.isString = isString
function isString (value) {
  return typeof value === 'string'
}

pub.isBoolean = isBoolean
function isBoolean (value) {
  return typeof value === 'boolean'
}

pub.isSymbol = isSymbol
function isSymbol (value) {
  return typeof value === 'symbol'
}

pub.isFunction = isFunction
function isFunction (value) {
  return typeof value === 'function'
}

pub.isObject = isObject
function isObject (value) {
  return value !== null && typeof value === 'object'
}

// TODO consider aliasing as `isDict` or `isPlainDict`.
pub.isPlainObject = isPlainObject
function isPlainObject (value) {
  return isObject(value) && isPlainObjectProto(getPrototypeOf(value))
}

function isPlainObjectProto (value) {
  return value === null || value === protoObject
}

pub.isArray = isArray
function isArray (value) {
  return value instanceof Array
}

pub.isList = isList
function isList (value) {
  return isObject(value) && isFinite(value.length) && value.length >= 0
}

pub.isRegExp = isRegExp
function isRegExp (value) {
  return value instanceof RegExp
}

pub.isPromise = isPromise
function isPromise (value) {
  return value != null && isFunction(value.then) && isFunction(value.catch)
}

const isPrimitive = pub.isPrimitive = not(or(isObject, isFunction))

pub.isNil = isNil
function isNil (value) {
  return value == null
}

// (patter, value) => ...
const testBy = cond(isFunction, call,
                    isPrimitive, is,
                    isRegExp, maskRegExp,
                    isList, testList,
                    isObject, testDict,
                    () => undefined)

pub.testBy = testBy

function testList (pattern, value) {
  return isList(value) && every.call(pattern, testByIndex, value)
}

function testByIndex (pattern, i) {
  return testBy(pattern, this[i])
}

function testDict (pattern, value) {
  if (!isObject(value)) return false
  for (const key in pattern) if (!testBy(pattern[key], value[key])) return false
  return true
}

pub.test = test
function test (pattern) {
  return bind(testBy, pattern)
}

// List

pub.list = list
function list () {
  return slice(arguments)
}

pub.foldl = foldl
function foldl (fun, acc, list) {
  return reduce.call(toList(list), fun, acc)
}

pub.foldr = foldr
function foldr (fun, acc, list) {
  return reduceRight.call(toList(list), fun, acc)
}

function foldlWith (fun, acc, list, a, b) {
  for (let i = -1; ++i < list.length;) acc = fun(acc, list[i], i, a, b)
  return acc
}

pub.map = map
function map (fun, list) {
  return nmap.call(toList(list), fun)
}

pub.filter = filter
function filter (test, list) {
  return nfilter.call(toList(list), test)
}

pub.find = find
function find (test, list) {
  return nfind.call(toList(list), test)
}

pub.includes = includes
function includes (list, value) {
  return !!~indexOf(list, value)
}

pub.indexOf = indexOf
function indexOf (list, value) {
  list = toList(list)
  for (let i = -1; ++i < list.length;) if (is(list[i], value)) return i
  return -1
}

pub.slice = slice
function slice () {
  return nslice.call.apply(nslice, arguments)
}

pub.append = append
function append (list, value) {
  return toArray(list).concat([value])
}

pub.prepend = prepend
function prepend (list, value) {
  return [value].concat(toArray(list))
}

pub.remove = remove
function remove (list, value) {
  return filter(not(bind(is, value)), list)
}

const flat = pub.flat = bind(foldl, concatFlat, [])

function concatFlat (list, value) {
  return list.concat(isList(value) ? flat(toArray(value)) : value)
}

pub.head = pub.first = head
function head (value) {
  return isList(value) ? value[0] : undefined
}

pub.tail = tail
function tail (value) {
  return isList(value) ? slice(value, 1) : []
}

pub.init = init
function init (value) {
  return isList(value) ? slice(value, 0, -1) : []
}

pub.last = last
function last (value) {
  return isList(value) ? value[value.length - 1] : undefined
}

const toList = ifelse(isList, id, val([]))

const toArray = cond(isArray, id, isList, slice, val([]))

// Dict

pub.get = get
function get (value, key) {
  return value == null ? undefined : value[key]
}

pub.scan = scan
function scan () {
  return arguments.length ? reduce.call(arguments, get) : undefined
}

// Could be `bind(foldl, get)`, but then it would accept any garbage as `path`,
// coercing it to a list. Not sure if that makes sense.
pub.getIn = getIn
function getIn (value, path) {
  return reduce.call(path, get, value)
}

// Could be `flip(getIn)`, but `flip` can only handle 0-∞ arity for now.
pub.getAt = getAt
function getAt (path, value) {
  return reduce.call(path, get, value)
}

pub.mapVals = mapVals
function mapVals (fun, value) {
  const out = {}
  if (value) for (const key in value) out[key] = fun(value[key], key)
  return out
}

pub.mapKeys = mapKeys
function mapKeys (fun, value) {
  const out = {}
  if (value) for (const key in value) out[fun(value[key], key)] = value[key]
  return out
}

// Ops

pub.yes = Boolean
pub.no = not(Boolean)
pub.add = function add (a, b) {return a + b}
pub.sub = function sub (a, b) {return a - b}
pub.inc = function inc (a) {return a + 1}
pub.dec = function dec (a) {return a - 1}

// Misc

pub.id = id
function id (value) {
  return value
}

// Alternative version `defer(id)` breaks when called with zero arguments.
pub.val = val
function val (value) {
  return bind(id, value)
}

pub.noop = noop
function noop () {}

pub.rethrow = rethrow
function rethrow (val) {
  throw val
}

// (patter, value) => ...
const maskBy = cond(isFunction, call,
                    isPrimitive, id,
                    isRegExp, maskRegExp,
                    isList, maskList,
                    isObject, maskDict,
                    () => undefined)

pub.maskBy = maskBy

function maskRegExp (pattern, value) {
  return pattern.test(value)
}

function maskList (pattern, value) {
  return nmap.call(pattern, maskByIndex, value)
}

function maskByIndex (pattern, i) {
  return maskBy(pattern, get(this, i))
}

function maskDict (pattern, value) {
  const out = {}
  for (const key in pattern) out[key] = maskBy(pattern[key], get(value, key))
  return out
}

pub.mask = mask
function mask (pattern) {
  return bind(maskBy, pattern)
}

pub.validate = validate
function validate (test, value) {
  if (!test(value)) throw Error(`Expected ${value} to satisfy test ${test.name}`)
}

pub.validateEach = validateEach
function validateEach (test, list) {
  validate(isList, list)
  for (let i = -1; ++i < list.length;) {
    if (!test(list[i])) {
      throw Error(`Expected ${list[i]} at index ${i} to satisfy test ${test.name}`)
    }
  }
}
