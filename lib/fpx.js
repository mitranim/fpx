'use strict'

const {getPrototypeOf, prototype: protoObject} = Object
const {slice: nslice, reduce, reduceRight, map: nmap, find: nfind,
       filter: nfilter, every: nevery, some: nsome} = Array.prototype
const pub = exports

// Fun

pub.call = call
function call (fun) {
  validate(isFunction, fun)
  arguments[0] = this  // relies on strict mode
  return fun.call.apply(fun, arguments)
}

pub.apply = apply
function apply (fun, args) {
  validate(isFunction, fun)
  validate(isList, args)
  return fun.apply(this, args)
}

pub.bind = bind
function bind (fun) {
  return bindApply(fun, slice(arguments, 1))
}

// WTB better name
pub.bindApply = bindApply
function bindApply (fun, args) {
  validate(isFunction, fun)
  validate(isArray, args)
  return function bound () {
    return fun.apply(this, args.concat(slice(arguments)))
  }
}

pub.defer = defer
function defer (fun) {
  validate(isFunction, fun)
  return defer_.apply(this, arguments)
}

const defer_ = bind(bind, bind)

pub.flip = flip
function flip (fun) {
  validate(isFunction, fun)
  return function flip_ () {
    return fun.apply(this, slice(arguments).reverse())
  }
}

// TODO should be expressed in terms of seq, or built from same primitives as seq
const and = pub.and = composer(function and (fun, funs) {
  return function and_ () {
    return foldlWith.call(this, stepAnd, fun.apply(this, arguments), funs, arguments)
  }
})

function stepAnd (acc, fun, index, args) {
  return acc && fun.apply(this, args)
}

// TODO should be expressed in terms of seq, or built from same primitives as seq
const or = pub.or = composer(function or (fun, funs) {
  return function or_ () {
    return foldlWith.call(this, stepOr, fun.apply(this, arguments), funs, arguments)
  }
})

function stepOr (acc, fun, index, args) {
  return acc || fun.apply(this, args)
}

pub.not = not
function not (fun) {
  validate(isFunction, fun)
  return function not_ () {return !fun.apply(this, arguments)}
}

pub.ifelse = ifelse
function ifelse (test, left, right) {
  validate(isFunction, test)
  validate(isFunction, left)
  validate(isFunction, right)
  return function ifelse_ () {
    return (test.apply(this, arguments) ? left : right).apply(this, arguments)
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

pub.ifexists = bind(ifthen, id)

pub.cond = cond
function cond (test, fun) {
  if (!arguments.length) return noop
  validate(isFunction, test)
  if (arguments.length === 1) return test
  return ifelse(test, fun, cond(...slice(arguments, 2)))
}

const pipe = pub.pipe = composer(function pipe (fun, funs) {
  return function pipe_ () {
    return funs.reduce(callRight, fun.apply(this, arguments), this)
  }
})

function callRight (value, fun) {
  return fun.call(this, value)
}

pub.comp = flip(pipe)

pub.seq = composer(function seq (fun, funs) {
  return function seq_ () {
    return foldlWith.call(this, stepSeq, fun.apply(this, arguments), funs, arguments)
  }
})

function stepSeq (_, fun, __, args) {
  return fun.apply(this, args)
}

const pipeAnd = pub.pipeAnd = composer(function pipeAnd (fun, funs) {
  return pipe(fun, function pipeAnd_ (value) {
    return funs.reduce(stepPipeAnd, value, this)
  })
})

function stepPipeAnd (acc, fun) {
  return acc && fun.call(this, acc)
}

pub.compAnd = flip(pipeAnd)

pub.juxt = juxt
function juxt () {
  const funs = slice(arguments)
  validateEach(isFunction, funs)
  return function juxt_ () {
    return funs.map(applyRight.bind(this, arguments))
  }
}

function applyRight (args, fun) {
  return fun.apply(this, args)
}

pub.rest = rest
function rest (fun) {
  validate(isFunction, fun)
  return function rest_ () {return fun.call(this, slice(arguments))}
}

// spread = curry1(apply)
pub.spread = spread
function spread (fun) {
  validate(isFunction, fun)
  return bind(apply, fun)
}

pub.alter = alter
function alter (fun) {
  validate(isFunction, fun)
  return pipe(bind(prepend, slice(arguments, 1)), spread(fun))
}

pub.revise = revise
function revise (transforms, fun) {
  validateEach(isFunction, transforms)
  validate(isFunction, fun)
  return function revise_ () {
    return fun.apply(this, nmap.call(transforms, transmute, arguments))
  }
}

function transmute (fun, i) {
  return fun(this[i])
}

pub.fanout = revise([spread(juxt), spread], pipe)

exports.funnel = funnel
function funnel (value, funs) {
  validateEach(isFunction, funs)
  return funs.reduce(callRight, value)
}

function composer (composerFun) {
  return function compose (fun) {
    if (!arguments.length) return id
    validate(isFunction, fun)
    if (arguments.length === 1) return fun
    const funs = slice(arguments, 1)
    validateEach(isFunction, funs)
    return composerFun.call(this, fun, funs)
  }
}

// Bool

pub.truthy = pub.bool = Boolean
pub.falsy = pub.negate = not(Boolean)

pub.is = is
function is (one, other) {
  return one === other || one !== one && other !== other
}

pub.isNumber = isNumber
function isNumber (value) {
  return typeof value === 'number'
}

pub.isFinite = isFinite
function isFinite (value) {
  return isNumber(value) && !isNaN(value) && value !== Infinity && value !== -Infinity
}

pub.isNatural = isNatural
function isNatural (value) {
  return isFinite(value) && value >= 0 && value % 1 === 0
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

const isComplex = pub.isComplex = or(isObject, isFunction)

const isPrimitive = pub.isPrimitive = not(isComplex)

pub.isDict = pub.isPlainObject = isDict
function isDict (value) {
  return isObject(value) && isPlainPrototype(getPrototypeOf(value))
}

// WTB better name, then document
pub.isSpecialObject = isSpecialObject
function isSpecialObject (value) {
  return isObject(value) && (isArguments(value) || !isPlainPrototype(getPrototypeOf(value)))
}

// Should publish?
function isArguments (value) {
  return isObject(value) && 'callee' in value && isNatural(value.length)
}

function isPlainPrototype (value) {
  return value === null || value === protoObject
}

pub.isArray = isArray
function isArray (value) {
  return value instanceof Array
}

pub.isList = isList
function isList (value) {
  return isSpecialObject(value) && isNatural(value.length)
}

pub.isRegExp = isRegExp
function isRegExp (value) {
  return value instanceof RegExp
}

pub.isNil = isNil
function isNil (value) {
  return value == null
}

const testBy = pub.testBy = cond(
  isFunction,  call,
  isPrimitive, is,
  isRegExp,    testRegExp,
  isList,      testList,
  isObject,    testComplex
)

function testRegExp (pattern, value) {
  return pattern.test(value)
}

function testList (pattern, value) {
  return isList(value) && nevery.call(pattern, testByIndex, value)
}

function testByIndex (pattern, i) {
  return testBy(pattern, this[i])
}

function testComplex (pattern, value) {
  if (!isComplex(value)) return false
  for (const key in pattern) if (!testBy(pattern[key], value[key])) return false
  return true
}

// test = curry1(testBy)
pub.test = test
function test (pattern) {
  return bind(testBy, pattern)
}

pub.testAnd = testAnd
function testAnd () {
  return and(...map(test, arguments))
}

pub.testOr = testOr
function testOr () {
  return or(...map(test, arguments))
}

pub.testArgsAnd = testArgsAnd
function testArgsAnd () {
  return and(...map(test, arguments).map(pin))
}

pub.testArgsOr = testArgsOr
function testArgsOr () {
  return or(...map(test, arguments).map(pin))
}

pub.isPromise = test({then: isFunction, catch: isFunction})

function pin (fun, i) {
  return function pin_ () {
    return fun(arguments[i])
  }
}

// List

pub.list = rest(id)

pub.foldl = foldl
function foldl (fun, acc, list) {
  return reduce.call(toList(list), fun, acc, this)
}

pub.foldr = foldr
function foldr (fun, acc, list) {
  return reduceRight.call(toList(list), fun, acc, this)
}

function foldlWith (fun, acc, list, a, b) {
  for (let i = -1; ++i < list.length;) acc = fun.call(this, acc, list[i], i, a, b)
  return acc
}

pub.map = map
function map (fun, list) {
  validate(isFunction, fun)
  return nmap.call(toList(list), fun, this)
}

pub.filter = filter
function filter (fun, list) {
  validate(isFunction, fun)
  return nfilter.call(toList(list), fun, this)
}

pub.find = find
function find (fun, list) {
  validate(isFunction, fun)
  return nfind.call(toList(list), fun, this)
}

pub.every = every
function every (fun, list) {
  validate(isFunction, fun)
  return nevery.call(toList(list), fun, this)
}

pub.some = some
function some (fun, list) {
  validate(isFunction, fun)
  return nsome.call(toList(list), fun, this)
}

pub.procure = procure
function procure (fun, list) {
  validate(isFunction, fun)
  list = toList(list)
  for (let i = -1; ++i < list.length;) {
    const result = fun.call(this, list[i], i)
    if (result) return result
  }
  return undefined
}

pub.includes = includes
function includes (list, value) {
  return !!~indexOf(list, value)
}

pub.indexOf = indexOf
function indexOf (list, value) {
  if (!isList(list)) return -1
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
  return removeAtIndex(list, indexOf(list, value))
}

pub.removeAtIndex = removeAtIndex
function removeAtIndex (list, index) {
  list = toList(list)
  if (isNatural(index) && index < list.length) {
    list = slice(list)
    list.splice(index, 1)
  }
  return list
}

pub.adjoin = ifelse(includes, id, append)

pub.toggle = ifelse(includes, remove, append)

pub.concat = concat
function concat () {
  return foldl(concatTwo, [], arguments)
}

function concatTwo (left, right) {
  return left.concat(toArray(right))
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

pub.reverse = reverse
function reverse (value) {
  return slice(toList(value)).reverse()
}

const toList = ifelse(isList, id, emptyList)

const toArray = cond(isArray, id, isList, slice, emptyList)

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
// coercing it to a list. Not sure if that makes sense. `reduce` valudates the
// input.
pub.getIn = getIn
function getIn (value, path) {
  return reduce.call(path, get, value)
}

// Could be `flip(getIn)`, but `flip` only supports ∞ arity for now.
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

// Coll

const keys = pub.keys = ifelse(isObject, Object.keys, emptyList)

pub.values = cond(isList, toArray, isObject, complexToValues, emptyList)

function complexToValues (value) {
  return keys(value).map(bind(get, value))
}

const length = bind(getAt, ['length'])

pub.size = ifelse(isList, length, pipe(keys, length))

function emptyList () {return []}

// Ops

pub.add = function add (a, b) {return a + b}
pub.sub = function sub (a, b) {return a - b}
pub.mul = function mul (a, b) {return a * b}
pub.div = function div (a, b) {return a / b}
pub.inc = function inc (a)    {return a + 1}
pub.dec = function dec (a)    {return a - 1}

// Misc

pub.id = id
function id (value) {
  return value
}

pub.di = di
function di (_, value) {
  return value
}

// val = curry1(id)
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

const maskBy = pub.maskBy = cond(
  isFunction,  call,
  isPrimitive, id,
  isRegExp,    testRegExp,
  isList,      maskList,
  isObject,    maskDict
)

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

// mask = curry1(maskBy)
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
