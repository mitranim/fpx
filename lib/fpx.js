'use strict'

const {getPrototypeOf, prototype: protoObject} = Object
const {slice: nslice, reduce, reduceRight, map: nmap, find: nfind,
       filter: nfilter} = Array.prototype
const pub = exports  // for minification

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
  return function () {
    return apply(fun, slice(arguments).reverse())
  }
}

const pipe = pub.pipe = rest(function pipe (funs) {
  validateEach(isFunction, funs)
  return !funs.length ? id : rest(reduce.bind(funs, stepPipe))
})

function stepPipe (value, fun, index) {
  return !index ? apply(fun, value) : fun(value)
}

pub.comp = flip(pipe)

pub.seq = rest(function seq (funs) {
  validateEach(isFunction, funs)
  return function () {
    return foldlWith(stepSeq, undefined, funs, arguments)
  }
})

function stepSeq (_, fun, __, args) {
  return apply(fun, args)
}

const and = pub.and = rest(function and (funs) {
  validateEach(isFunction, funs)
  return !funs.length
    ? id
    : function () {return foldlWith(stepAnd, undefined, funs, arguments)}
})

function stepAnd (acc, fun, index, args) {
  return (!index || acc) && apply(fun, args)
}

const or = pub.or = rest(function or (funs) {
  validateEach(isFunction, funs)
  return !funs.length
    ? id
    : function () {return foldlWith(stepOr, undefined, funs, arguments)}
})

function stepOr (acc, fun, _, args) {
  return acc || apply(fun, args)
}

pub.not = not
function not (fun) {
  validate(isFunction, fun)
  return function () {return !apply(fun, arguments)}
}

pub.ifelse = ifelse
function ifelse (test, left, right) {
  validateEach(isFunction, arguments)
  return function () {
    return apply(apply(test, arguments) ? left : right, arguments)
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
  validateEach(isFunction, arguments)
  return fun
    ? ifelse(test, fun, apply(cond, slice(arguments, 2)))
    : test || noop
}

pub.defer = defer
function defer (fun) {
  validate(isFunction, fun)
  return apply(_defer, arguments)
}

const _defer = bind(bind, bind)

pub.rest = rest
function rest (fun) {
  validate(isFunction, fun)
  return function () {return fun(slice(arguments))}
}

pub.spread = spread
function spread (fun) {
  validate(isFunction, fun)
  return apply(_spread, arguments)
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
  return value != null && typeof value === 'object'
}

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
  return isObject(value) && isNumber(value.length) && value.length >= 0
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

pub.test = test
function test (pattern) {
  return isFunction(pattern)
    ? pattern
    : isPrimitive(pattern)
    ? bind(is, pattern)
    : isRegExp(pattern)
    ? pattern.test.bind(pattern)
    : dictTest(pattern)
}

function dictTest (pattern) {
  return apply(and, prepend(mapDict(keyTest, pattern), isObject))
}

function keyTest (pattern, key) {
  return pipe(value => get(value, key), test(pattern))
}

// List

pub.list = rest(id)

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

function toList (value) {
  return isList(value) ? value : []
}

function toArray (value) {
  return isArray(value) ? value : (isList(value) ? slice(value) : [])
}

// Dict

pub.get = get
function get (value, key) {
  return value == null ? undefined : value[key]
}

pub.scan = scan
function scan () {
  return reduce.call(arguments, get)
}

pub.getIn = bind(foldl, get)

// Should be flip(getIn) but flip doesn't account for fun length.
pub.getAt = getAt
function getAt (path, value) {
  return foldl(get, value, path)
}

// Private for now, unsure about name.
function mapDict (fun, value) {
  const out = []
  if (value) for (const key in value) out.push(fun(value[key], key))
  return out
}

pub.mapVals = pub.mapValues = mapVals
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

pub.mask = mask
function mask (pattern) {
  return isFunction(pattern)
    ? pattern
    : isPrimitive(pattern)
    ? val(pattern)
    : isRegExp(pattern)
    ? pattern.test.bind(pattern)
    : dictMask(mapVals(mask, pattern))
}

function dictMask (pattern) {
  return pipe(Object, bind(applyMask, pattern))
}

function applyMask (pattern, dict) {
  return mapVals((mask, key) => mask(dict[key]), pattern)
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
