// See implementation notes in `impl.md`.

/** Var **/

// The "pure" annotation allows minifiers to drop this if the var is unused.
// eslint-disable-next-line no-new-func
export const global = /* @__PURE__ */Function('return this')()

/** Bool **/

export function truthy(val)        {return Boolean(val)}
export function falsy(val)         {return !val}
export function is(a, b)           {return a === b || (isNaN(a) && isNaN(b))}
export function isNil(val)         {return val == null}
export function isSome(val)        {return !isNil(val)}
export function isBool(val)        {return typeof val === 'boolean'}
export function isNum(val)         {return typeof val === 'number'}
export function isFin(val)         {return isNum(val) && !isNaN(val) && !isInf(val)}
export function isInt(val)         {return isNum(val) && ((val % 1) === 0)}
export function isNat(val)         {return isInt(val) && val >= 0}
export function isNatPos(val)      {return isInt(val) && val > 0}
export function isNaN(val)         {return val !== val} // eslint-disable-line no-self-compare
export function isInf(val)         {return val === Infinity || val === -Infinity}
export function isStr(val)         {return typeof val === 'string'}
export function isKey(val)         {return isStr(val) || isSym(val) || isBool(val) || isFin(val)}
export function isPrim(val)        {return !isComp(val)}
export function isComp(val)        {return isObj(val) || isFun(val)}
export function isFun(val)         {return typeof val === 'function'}
export function isObj(val)         {return val !== null && typeof val === 'object'}
export function isStruct(val)      {return isObj(val) && !isList(val) && !isInst(val, String)}
export function isArr(val)         {return isInst(val, Array)}
export function isReg(val)         {return isInst(val, RegExp)}
export function isSym(val)         {return typeof val === 'symbol'}
export function isDate(val)        {return isInst(val, Date)}
export function isValidDate(val)   {return isDate(val) && isFin(val.valueOf())}
export function isInvalidDate(val) {return isDate(val) && !isValidDate(val)}
export function isPromise(val)     {return isComp(val) && isFun(val.then) && isFun(val.catch)}
export function isCls(val)         {return isFun(val) && typeof val.prototype === 'object'}

export function isInst(val, Cls) {
  req(Cls, isCls)
  return isComp(val) && val instanceof Cls
}

export function isDict(val) {
  if (!isObj(val)) return false
  const proto = Object.getPrototypeOf(val)
  return proto === null || proto === Object.prototype
}

export function isList(val) {
  if (!isObj(val))                 return false
  if (isArr(val))                  return true
  if (!isNat(val.length))          return false
  if (isDict(val))                 return hasOwn(val, 'callee')
  if (isInst(val, String))         return false
  if (isFun(val.forEach))          return true
  if (isFun(val[Symbol.iterator])) return true
  return false
}

export function isIter(val) {
  return isObj(val) && isFun(val.next) && isFun(val.return) && isFun(val.throw)
}

export function isOpt(val, fun, ...args) {
  req(fun, isFun)
  return isNil(val) || truthy(fun(val, ...args))
}

export function isListOf(val, fun, ...args) {
  req(fun, isFun)
  return isList(val) && every(val, cwk, fun, ...args)
}

export function isDictOf(val, fun, ...args) {
  req(fun, isFun)
  return isDict(val) && everyVal(val, cwk, fun, ...args)
}

export function hasOwn(val, key) {
  req(key, isKey)
  return isComp(val) && Object.prototype.hasOwnProperty.call(val, key)
}

export function testBy(val, pattern) {
  return (
    isFun(pattern)    ? truthy(pattern(val)) :
    isPrim(pattern)   ? is(val, pattern) :
    isReg(pattern)    ? isStr(val) && pattern.test(val) :
    isDate(pattern)   ? isDate(val) && is(pattern.valueOf(), val.valueOf()) :
    isList(pattern)   ? isList(val) && every(pattern, testAt, val) :
    isStruct(pattern) ? isStruct(val) && everyVal(pattern, testAt, val) :
    false
  )
}

function testAt(pattern, key, val) {return testBy(val[key], pattern)}

export function test(pattern) {
  return function test_(val) {return testBy(val, pattern)}
}

// Internal for now.
function isNatOrInf(val) {return isNat(val) || isInf(val)}

/** Casts **/

export function prim(val)   {return isNil(val) ? undefined : req(val, isPrim)}
export function bool(val)   {return isNil(val) ? false     : req(val, isBool)}
export function num(val)    {return isNil(val) ? 0         : req(val, isNum)}
export function fin(val)    {return isNil(val) ? 0         : req(val, isFin)}
export function int(val)    {return isNil(val) ? 0         : req(val, isInt)}
export function nat(val)    {return isNil(val) ? 0         : req(val, isNat)}
export function natPos(val) {return isNil(val) ? 0         : req(val, isNatPos)}
export function str(val)    {return isNil(val) ? ''        : req(val, isStr)}
export function list(val)   {return isNil(val) ? []        : req(val, isList)}
export function arr(val)    {return isNil(val) ? []        : req(val, isArr)}
export function dict(val)   {return isNil(val) ? npo()     : req(val, isDict)}
export function struct(val) {return isNil(val) ? npo()     : req(val, isStruct)}
export function comp(val)   {return isNil(val) ? npo()     : req(val, isComp)}

export function toStr(val) {return isNil(val) ? '' : String(prim(val))}
export function toArr(val) {return isArr(val) ? val : slice(val)}

/** Assertions **/

export function req(val, test, ...args) {
  if (!isFun(test, ...args)) {
    throw TypeError(`expected validator function, got ${show(test)}`)
  }
  if (!test(val)) {
    throw TypeError(`expected ${show(val)} to satisfy test ${show(test)}`)
  }
  return val
}

export function opt(val, test, ...args) {
  req(test, isFun)
  return isNil(val) ? val : req(val, test, ...args)
}

export function reqInst(val, Cls) {
  if (!isInst(val, Cls)) {
    const cons = isComp(val) ? val.constructor : undefined
    throw TypeError(`expected ${show(val)}${cons ? ` (instance of ${show(cons)})` : ``} to be an instance of ${show(Cls)}`)
  }
  return val
}

export function optInst(val, Cls) {
  req(Cls, isFun)
  return isNil(val) ? val : reqInst(val, Cls)
}

export function reqEach(val, test, ...args) {
  req(test, isFun)
  each(val, reqAt, test, ...args)
  return val
}

export function reqEachVal(val, test, ...args) {
  req(test, isFun)
  eachVal(val, reqAt, test, ...args)
  return val
}

/** Fun **/

export function call(fun, ...args) {return fun.apply(this, args)}
export function apply(fun, args)   {return fun.apply(this, args)}
export function bind(fun, ...args) {return fun.bind(this, ...args)}

export function not(fun) {
  req(fun, isFun)
  return function not_() {return !fun.apply(this, arguments)}
}

// Short for "call without key".
export function cwk(val, _key, fun, ...args) {return fun(val, ...args)}

/** List **/

export function len(val)    {return isNil(val) ? 0 : list(val).length}
export function hasLen(val) {return isList(val) && truthy(val.length)}
export function vacate(val) {return hasLen(val) ? val : undefined}

export function each(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  for (let i = 0; i < val.length; i++) fun(val[i], i, ...args)
}

export function map(val, fun, ...args) {
  return mapMut(slice(val), fun, ...args)
}

export function mapMut(val, fun, ...args) {
  req(val, isList)
  req(fun, isFun)
  for (let i = 0; i < val.length; i++) val[i] = fun(val[i], i, ...args)
  return val
}

export function mapFlat(val, fun, ...args) {
  return flat(map(val, fun, ...args))
}

export function mapFlatDeep(val, fun, ...args) {
  return flatDeep(map(val, fun, ...args))
}

export function mapFilter(val, fun, ...args) {
  return compact(map(val, fun, ...args))
}

export function filter(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  const out = []
  for (let i = 0; i < val.length; i++) {
    const elem = val[i]
    if (fun(elem, i, ...args)) out.push(elem)
  }
  return out
}

export function reject(val, fun, ...args) {
  req(fun, isFun)
  return filter(val, notBy, fun, ...args)
}

function notBy(val, key, fun, ...args) {
  return !fun(val, key, ...args)
}

export function fold(val, acc, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  for (let i = 0; i < val.length; i++) acc = fun(acc, val[i], i, ...args)
  return acc
}

export function foldRight(val, acc, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  for (let i = val.length - 1; i >= 0; i--) acc = fun(acc, val[i], i, ...args)
  return acc
}

export function fold1(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  let acc = val[0]
  for (let i = 1; i < val.length; i++) acc = fun(acc, val[i], i, ...args)
  return acc
}

export function compact(val) {return filter(val, id)}

export function find(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  return val[findIndex(val, fun, ...args)]
}

export function findRight(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  return val[findIndexRight(val, fun, ...args)]
}

export function findIndex(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  for (let i = 0; i < val.length; i++) {
    if (fun(val[i], i, ...args)) return i
  }
  return -1
}

export function findIndexRight(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  for (let i = val.length; --i >= 0;) {
    if (fun(val[i], i, ...args)) return i
  }
  return -1
}

export function indexOf(val, elem) {
  return findIndex(val, isAt, elem)
}

export function lastIndexOf(val, elem) {
  return findIndexRight(val, isAt, elem)
}

function isAt(candidate, _i, val) {
  return is(candidate, val)
}

export function includes(val, elem) {
  return indexOf(val, elem) !== -1
}

export function procure(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  for (let i = 0; i < val.length; i++) {
    const res = fun(val[i], i, ...args)
    if (res) return res
  }
  return undefined
}

export function every(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  for (let i = 0; i < val.length; i++) {
    if (!fun(val[i], i, ...args)) return false
  }
  return true
}

export function some(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  for (let i = 0; i < val.length; i++) {
    if (fun(val[i], i, ...args)) return true
  }
  return false
}

export function slice(val, start, next) {
  return Array.prototype.slice.call(list(val), start, next)
}

export function append(val, elem) {
  return toArr(val).concat([elem])
}

export function prepend(val, elem) {
  return [elem].concat(toArr(val))
}

export function remove(val, elem) {
  return removeAt(val, indexOf(val, elem))
}

export function adjoin(val, elem) {
  return includes(val, elem) ? toArr(val) : append(val, elem)
}

export function toggle(val, elem) {
  return includes(val, elem) ? remove(val, elem) : append(val, elem)
}

export function insertAt(val, ind, elem) {
  val = slice(val)
  reqBounded(val.length, ind)
  val.splice(ind, 0, elem)
  return val
}

export function replaceAt(val, ind, elem) {
  val = slice(val)
  req(ind, isNat)
  val[ind] = elem
  return val
}

function reqBounded(len, ind) {
  req(ind, isNat)
  if (!(ind <= len)) {
    throw Error(`index ${ind} out of bounds for length ${len}`)
  }
}

export function removeAt(val, ind) {
  val = list(val)
  req(ind, isInt)
  if (isNat(ind) && ind < val.length) {
    val = slice(val)
    val.splice(ind, 1)
  }
  return val
}

// Uses native concat because it seems to perform very well in many JS engines.
export function concat(...args) {
  return [].concat(...mapMut(args, toArr))
}

export function flat(val) {
  const out = []
  each(val, pushFlat, out)
  return out
}

function pushFlat(val, _i, out) {
  if (isList(val)) for (let i = 0; i < val.length; i++) out.push(val[i])
  else out.push(val)
}

export function flatDeep(val) {
  const out = []
  each(val, pushFlatDeep, out)
  return out
}

function pushFlatDeep(val, _key, out) {
  if (isList(val)) each(val, pushFlatDeep, out)
  else out.push(val)
}

export function head(val) {
  return list(val)[0]
}

export function tail(val) {
  return slice(val, 1)
}

export function init(val) {
  val = list(val)
  return slice(val, 0, val.length - 1)
}

export function last(val) {
  val = list(val)
  return val[val.length - 1]
}

export function take(val, count) {
  req(count, isNatOrInf)
  return slice(val, 0, count)
}

export function takeWhile(val, fun, ...args) {
  req(fun, isFun)
  const ind = findIndex(val, notBy, fun, ...args)
  return isNat(ind) ? slice(val, 0, ind) : list(val)
}

export function drop(val, count) {
  req(count, isNatOrInf)
  return slice(val, count)
}

export function dropWhile(val, fun, ...args) {
  req(fun, isFun)
  const ind = findIndex(val, notBy, fun, ...args)
  return isNat(ind) ? slice(val, ind) : []
}

export function count(val, fun, ...args) {
  req(fun, isFun)
  return fold(val, 0, incIf, fun, ...args)
}

function incIf(acc, val, i, fun, ...args) {
  return fun(val, i, ...args) ? acc + 1 : acc
}

export function countWhile(val, fun, ...args) {
  req(fun, isFun)
  const ind = findIndex(val, notBy, fun, ...args)
  return isNat(ind) ? ind : len(val)
}

export function times(count, fun, ...args) {
  req(fun, isFun)
  req(count, isNat)
  const out = Array(count)
  for (let i = 0; i < count; i++) out[i] = fun(i, ...args)
  return out
}

export function reverse(val) {
  val = list(val)
  const len = val.length
  const out = Array(len)
  for (let i = len; --i >= 0;) out[len - i - 1] = val[i]
  return out
}

export function sort(val, comparator) {
  return slice(val).sort(comparator)
}

export function sortBy(val, fun, ...args) {
  req(fun, isFun)
  return sort(val, function compareBy(left, right) {
    return sortCompare(fun(left, ...args), fun(right, ...args))
  })
}

// https://tc39.github.io/ecma262/#sec-sortcompare
export function sortCompare(left, right) {
  if (left === undefined && right === undefined) return 0
  if (left === undefined) return 1
  if (right === undefined) return -1
  left = String(left)
  right = String(right)
  if (left < right) return -1
  if (right < left) return 1
  return 0
}

export function intersect(left, right) {
  left = list(left)
  right = list(right)
  const lr = left.length <= right.length
  const lesser = lr ? left : right
  const greater = lr ? right : left
  const out = []
  each(greater, intersectAdd, out, lesser)
  return out
}

function intersectAdd(val, _key, out, control) {
  if (includes(control, val) && !includes(out, val)) out.push(val)
}

export function keyBy(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  const out = npo()
  for (let i = 0; i < val.length; i++) {
    const elem = val[i]
    const key = fun(elem, i, ...args)
    if (isKey(key)) out[key] = elem
  }
  return out
}

export function groupBy(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  const out = npo()
  for (let i = 0; i < val.length; i++) {
    const elem = val[i]
    const groupKey = fun(elem, i, ...args)
    if (isKey(groupKey)) {
      if (!hasOwn(out, groupKey)) out[groupKey] = []
      out[groupKey].push(elem)
    }
  }
  return out
}

export function uniq(val) {
  return uniqBy(val, id)
}

export function uniqBy(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  const out = []
  const attrs = []
  for (let i = 0; i < val.length; i++) {
    const elem = val[i]
    const attr = fun(elem, i, ...args)
    if (!includes(attrs, attr)) {
      attrs.push(attr)
      out.push(elem)
    }
  }
  return out
}

export function partition(val, fun, ...args) {
  val = list(val)
  req(fun, isFun)
  const accepted = []
  const rejected = []
  for (let i = 0; i < val.length; i++) {
    const elem = val[i]
    if (fun(elem, i, ...args)) accepted.push(elem)
    else rejected.push(elem)
  }
  return [accepted, rejected]
}

export function sum(val) {
  return sumBy(val, id)
}

export function sumBy(val, fun, ...args) {
  req(fun, isFun)
  return fold(val, 0, maybeAddBy, fun, ...args)
}

function maybeAddBy(acc, val, i, fun, ...args) {
  val = fun(val, i, ...args)
  return isFin(val) ? acc + val : acc
}

export function min(val) {
  return minBy(val, id)
}

export function max(val) {
  return maxBy(val, id)
}

export function minBy(val, fun, ...args) {
  req(fun, isFun)
  return fold(val, undefined, compareNumsBy, lt, fun, ...args)
}

export function maxBy(val, fun, ...args) {
  req(fun, isFun)
  return fold(val, undefined, compareNumsBy, gt, fun, ...args)
}

function compareNumsBy(acc, val, key, compare, fun, ...args) {
  val = fun(val, key, ...args)
  return !isFin(val)
    ? acc
    : !isFin(acc) || compare(val, acc)
    ? val
    : acc
}

export function findMinBy(val, fun, ...args) {
  req(fun, isFun)
  return findNumBy(val, lt, fun, ...args)
}

export function findMaxBy(val, fun, ...args) {
  req(fun, isFun)
  return findNumBy(val, gt, fun, ...args)
}

// WTF too large!
function findNumBy(val, compare, fun, ...args) {
  val = list(val)
  req(compare, isFun)
  req(fun, isFun)
  let winningValue = undefined
  let winningAttr = undefined
  for (let i = 0; i < val.length; i++) {
    const elem = val[i]
    const attr = fun(elem, i, ...args)
    if (isFin(attr) && (isNil(winningAttr) || compare(attr, winningAttr))) {
      winningValue = elem
      winningAttr = attr
    }
  }
  return winningValue
}

export function range(start, next) {
  req(start, isInt)
  req(next, isInt)
  let remaining = next - start
  // Note: this rejects negatives, producing a decent error message.
  const out = Array(remaining)
  while (--remaining >= 0) out[remaining] = start + remaining
  return out
}

export function zip(entries) {
  return fold(entries, npo(), zipAdd)
}

function zipAdd(acc, pair) {
  req(pair, isList)
  const key = pair[0]
  if (!isNil(key)) acc[req(key, isKey)] = pair[1]
  return acc
}

/** Struct **/

// TODO good short name.
function npo() {return Object.create(null)}

export function size(val)    {return keys(val).length}
export function keys(val)    {return Object.keys(struct(val))}
export function vals(val)    {return Object.values(struct(val))}
export function entries(val) {return Object.entries(struct(val))}
export function hasSize(val) {return isStruct(val) && truthy(size(val))}

export function eachVal(val, fun, ...args) {
  val = struct(val)
  req(fun, isFun)
  for (const key in val) fun(val[key], key, ...args)
}

export function foldVals(val, acc, fun, ...args) {
  val = struct(val)
  req(fun, isFun)
  for (const key in val) acc = fun(acc, val[key], key, ...args)
  return acc
}

export function mapVals(val, fun, ...args) {
  return mapValsMut(assign(npo(), val), fun, ...args)
}

export function mapValsMut(val, fun, ...args) {
  req(val, isStruct)
  req(fun, isFun)
  for (const key in val) val[key] = fun(val[key], key, ...args)
  return val
}

export function mapKeys(val, fun, ...args) {
  val = struct(val)
  req(fun, isFun)

  const out = npo()
  for (let key in val) {
    const elem = val[key]
    key = fun(key, elem, ...args)
    if (isKey(key)) out[key] = elem
  }
  return out
}

export function mapValsSort(val, fun, ...args) {
  val = struct(val)
  req(fun, isFun)

  const out = keys(val).sort()
  for (let i = 0; i < out.length; i++) {
    const key = out[i]
    out[i] = fun(val[key], key, ...args)
  }
  return out
}

export function pick(val, fun, ...args) {
  val = struct(val)
  req(fun, isFun)

  const out = npo()
  for (const key in val) {
    const elem = val[key]
    if (fun(elem, key, ...args)) out[key] = elem
  }
  return out
}

export function omit(val, fun, ...args) {
  req(fun, isFun)
  return pick(val, notBy, fun, ...args)
}

export function pickKeys(val, keys) {
  return fold(keys, npo(), pickKnown, struct(val))
}

function pickKnown(tar, key, _i, src) {
  if (hasOwn(src, key)) tar[key] = src[key]
  return tar
}

export function omitKeys(val, keys) {
  return fold(keys, mut(npo(), val), deleteKnown)
}

function deleteKnown(tar, key) {
  delete tar[key]
  return tar
}

export function findVal(val, fun, ...args) {
  val = struct(val)
  req(fun, isFun)

  for (const key in val) {
    const elem = val[key]
    if (fun(elem, key, ...args)) return elem
  }
  return undefined
}

export function findKey(val, fun, ...args) {
  val = struct(val)
  req(fun, isFun)
  const inputKeys = keys(val)
  for (let i = 0; i < inputKeys.length; i++) {
    const key = inputKeys[i]
    if (fun(val[key], key, ...args)) return key
  }
  return undefined
}

export function everyVal(val, fun, ...args) {
  val = struct(val)
  req(fun, isFun)
  for (const key in val) if (!fun(val[key], key, ...args)) return false
  return true
}

export function someVal(val, fun, ...args) {
  val = struct(val)
  req(fun, isFun)
  const inputKeys = keys(val)
  for (let i = 0; i < inputKeys.length; i++) {
    const key = inputKeys[i]
    if (fun(val[key], key, ...args)) return true
  }
  return false
}

export function invert(val) {
  return invertBy(val, id)
}

export function invertBy(val, fun, ...args) {
  val = struct(val)
  req(fun, isFun)
  const out = npo()
  const inputKeys = keys(val)
  for (let i = 0; i < inputKeys.length; i++) {
    const key = inputKeys[i]
    const newKey = fun(val[key], key, ...args)
    if (isKey(newKey)) out[newKey] = key
  }
  return out
}

/** Ops **/

export function neg(a)    {return -a}
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

export function nop()        {}
export function True()       {return true}
export function False()      {return false}
export function vac(val)     {return val || undefined} // TODO consider replacing "||" with "??".
export function id(val)      {return val}
export function di(_, val)   {return val}
export function val(val)     {return bind(id, val)}
export function rethrow(val) {throw val}

export function get(val, key) {
  req(key, isKey)
  return isComp(val) ? val[key] : undefined
}

export function scan(val, ...path) {return fold(path, val, get)}
export function getIn(val, path) {return fold(path, val, get)}

export function getter(key) {
  req(key, isKey)
  return function get_(val) {return get(val, key)}
}

export function assign(tar, ...args) {
  return fold(args, req(tar, isComp), mut)
}

function mut(tar, src) {
  src = struct(src)
  for (const key in src) tar[key] = src[key]
  return tar
}

function reqAt(val, key, test, ...args) {
  if (!test(val, ...args)) {
    throw TypeError(`expected ${show(val)} at key ${key} to satisfy test ${show(test)}`)
  }
}

export function show(val) {
  if (isFun(val) && val.name) return val.name

  // Plain data becomes JSON, if possible.
  if (isArr(val) || isDict(val) || isStr(val)) {
    try {return JSON.stringify(val)}
    catch (_) {return String(val)}
  }

  return String(val)
}
