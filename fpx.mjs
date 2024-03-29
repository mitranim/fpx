/** Fun **/

export function bind(val, ...args) {return val.bind(this, ...args)}

export function not(val) {
  req(val, isFun)
  return function not() {return !val.apply(this, arguments)}
}

/** Bool **/

export function is(a, b) {return a === b || (isNaN(a) && isNaN(b))}
export function truthy(val) {return !!val}
export function falsy(val) {return !val}
export function isNil(val) {return val == null}
export function isSome(val) {return !isNil(val)}
export function isBool(val) {return typeof val === `boolean`}
export function isNum(val) {return typeof val === `number`}
export function isFin(val) {return isNum(val) && !isNaN(val) && !isInf(val)}
export function isFinNeg(val) {return isNum(val) && val < 0 && val > -Infinity}
export function isFinPos(val) {return isNum(val) && val > 0 && val < Infinity}
export function isInt(val) {return isNum(val) && ((val % 1) === 0)}
export function isNat(val) {return isInt(val) && val >= 0}
export function isIntNeg(val) {return isInt(val) && val < 0}
export function isIntPos(val) {return isInt(val) && val > 0}
export function isNaN(val) {return val !== val}
export function isInf(val) {return val === Infinity || val === -Infinity}
export function isBigInt(val) {return typeof val === `bigint`}
export function isStr(val) {return typeof val === `string`}
export function isSym(val) {return typeof val === `symbol`}
export function isKey(val) {return isPrim(val) && !isJunk(val)}
export function isJunk(val) {return isNil(val) || isNaN(val) || isInf(val)}
export function isComp(val) {return isObj(val) || isFun(val)}
export function isPrim(val) {return !isComp(val)}
export function isFun(val) {return typeof val === `function`}
export function isFunSync(val) {return isFunType(val, `Function`)}
export function isFunGen(val) {return isFunType(val, `GeneratorFunction`)}
export function isFunAsync(val) {return isFunType(val, `AsyncFunction`)}
export function isFunAsyncGen(val) {return isFunType(val, `AsyncGeneratorFunction`)}
export function isObj(val) {return !isNull(val) && typeof val === `object`}
export function isStruct(val) {return isObj(val) && !isIter(val) && !isIterAsync(val)}
export function isArr(val) {return Array.isArray(val)}
export function isReg(val) {return isInst(val, RegExp)}
export function isDate(val) {return isInst(val, Date)}
export function isValidDate(val) {return isDate(val) && isFin(val.valueOf())}
export function isInvalidDate(val) {return isDate(val) && !isValidDate(val)}
export function isSet(val) {return isInst(val, Set)}
export function isMap(val) {return isInst(val, Map)}
export function isPromise(val) {return hasMeth(val, `then`)}
export function isIter(val) {return hasMeth(val, Symbol.iterator)}
export function isIterAsync(val) {return hasMeth(val, Symbol.asyncIterator)}
export function isIterator(val) {return isIter(val) && hasMeth(val, `next`)}
export function isIteratorAsync(val) {return isIterAsync(val) && hasMeth(val, `next`)}
export function isGen(val) {return isIterator(val) && hasMeth(val, `return`) && hasMeth(val, `throw`)}
export function isCls(val) {return isFun(val) && isObj(val.prototype)}
export function isDict(val) {return isObj(val) && isDictProto(Object.getPrototypeOf(val))}
export function isList(val) {return isArr(val) || (isIter(val) && isNat(getLength(val)))}
export function isSeq(val) {return isList(val) || isSet(val) || isIterator(val)}
export function isVac(val) {return !val || (isList(val) && every(val, isVac))}

export function isScalar(val) {
  if (isObj(val)) {
    const fun = get(val, `toString`)
    return isFun(fun) && fun !== Object.prototype.toString && fun !== Array.prototype.toString
  }
  return !isFun(val)
}

export function isInst(val, cls) {
  req(cls, isCls)
  return isObj(val) && val instanceof cls
}

export function isListOf(val, fun) {
  req(fun, isFun)
  return isList(val) && every(val, fun)
}

export function isEmpty(val) {
  if (!isObj(val)) return true
  if (isList(val)) return val.length === 0
  if (isIter(val)) return getSize(val) === 0
  return false
}

export function hasMeth(val, key) {return isFun(get(val, key))}

function isNull(val) {return val === null} // eslint-disable-line eqeqeq
function isDictProto(val) {return isNull(val) || val === Object.prototype}
function isFunType(val, name) {return isFun(val) && val.constructor.name === name}

/** Assert/Cast **/

export function req(val, fun) {
  reqValidator(fun)
  if (!fun(val)) {
    throw TypeError(`expected ${show(val)} to satisfy test ${showFunName(fun)}`)
  }
  return val
}

function reqValidator(val) {
  if (!isFun(val)) {
    throw TypeError(`expected validator function, got ${show(val)}`)
  }
}

export function opt(val, fun) {
  reqValidator(fun)
  return isNil(val) ? val : req(val, fun)
}

export function reqInst(val, cls) {
  if (!isInst(val, cls)) {
    throw TypeError(`expected ${show(val)}${instDesc(getCon(val))} to be an instance of ${showFunName(cls)}`)
  }
  return val
}

function instDesc(val) {return isFun(val) ? ` (instance of ${showFunName(val)})` : ``}

export function optInst(val, cls) {
  req(cls, isCls)
  return isNil(val) ? val : reqInst(val, cls)
}

export function only(val, fun) {return req(fun, isFun)(val) ? val : undefined}

export function arrOf(seq, fun) {
  req(fun, isFun)
  seq = arr(seq)
  for (const val of seq) req(val, fun)
  return seq
}

export function prim(val) {return isNil(val) ? val : req(val, isPrim)}
export function bool(val) {return isNil(val) ? false : req(val, isBool)}
export function num(val) {return isNil(val) ? 0 : req(val, isNum)}
export function fin(val) {return isNil(val) ? 0 : req(val, isFin)}
export function int(val) {return isNil(val) ? 0 : req(val, isInt)}
export function nat(val) {return isNil(val) ? 0 : req(val, isNat)}
export function intPos(val) {return isNil(val) ? 0 : req(val, isIntPos)}
export function str(val) {return isNil(val) ? `` : req(val, isStr)}
export function dict(val) {return isNil(val) ? npo() : req(val, isDict)}
export function struct(val) {return isNil(val) ? npo() : req(val, isStruct)}
export function scalar(val) {return req(val, isScalar)}
export function inst(val, cls) {return isInst(val, cls) ? val : new cls(val)}

function errConvert(val, msg) {
  return TypeError(`unable to convert ${show(val)} to ${msg}`)
}

/** Ops **/

export function add(a, b) {return a + b}
export function sub(a, b) {return a - b}
export function mul(a, b) {return a * b}
export function div(a, b) {return a / b}
export function rem(a, b) {return a % b}
export function lt(a, b) {return a < b}
export function gt(a, b) {return a > b}
export function lte(a, b) {return a <= b}
export function gte(a, b) {return a >= b}
export function neg(val) {return -val}
export function inc(val) {return val + 1}
export function dec(val) {return val - 1}

/** Misc **/

export function nop() {}
export function True() {return true}
export function False() {return false}
export function id(val) {return val}
export function di(_, val) {return val}
export function val(value) {return function val() {return value}}
export function panic(val) {throw val}

export function render(val) {
  if (isNil(val)) return ``
  if (isScalar(val)) return val + ``
  throw errConvert(val, `string`)
}

export function show(val) {
  if (isStr(val)) return JSON.stringify(val)
  if (isFun(val)) return showFun(val)
  if (isObj(val)) return showObj(val)
  return val + ``
}

function showFun(val) {return `[function ${val.name || val}]`}
function showFunName(fun) {return fun.name || showFun(fun)}

function showObj(val) {
  const con = getCon(val)
  if (!con || con === Object || con === Array) return JSON.stringify(val)
  const name = getName(con)
  return name ? `[object ${name}]` : val + ``
}

function get(val, key) {return isComp(val) && key in val ? val[key] : undefined}
function getCon(val) {return get(val, `constructor`)}
function getName(val) {return get(val, `name`)}
function getLength(val) {return get(val, `length`)}
function getSize(val) {return get(val, `size`)}

/** Struct **/

export function npo() {return Object.create(null)}

export function hasOwn(val, key) {
  req(key, isKey)
  return isComp(val) && Object.prototype.hasOwnProperty.call(val, key)
}

export function hasOwnEnum(val, key) {
  req(key, isKey)
  return isComp(val) && Object.prototype.propertyIsEnumerable.call(val, key)
}

export function mut(tar, src) {
  req(tar, isStruct)
  for (const key of structKeys(src)) {
    if (!(key in tar) || hasOwnEnum(tar, key)) tar[key] = src[key]
  }
  return tar
}

export function mapDict(val, fun) {
  req(fun, isFun)
  const out = npo()
  for (const key of structKeys(val)) out[key] = fun(val[key])
  return out
}

export function pick(val, fun) {
  req(fun, isFun)
  const out = npo()
  for (const key of structKeys(val)) {
    const elem = val[key]
    if (fun(elem)) out[key] = elem
  }
  return out
}

export function omit(val, fun) {return pick(val, not(fun))}

export function pickKeys(val, keys) {
  val = struct(val)
  const out = npo()
  for (const key of values(keys)) if (hasOwnEnum(val, key)) out[key] = val[key]
  return out
}

export function omitKeys(val, keys) {
  val = struct(val)
  keys = set(keys)
  const out = npo()
  for (const key of structKeys(val)) if (!keys.has(key)) out[key] = val[key]
  return out
}

/** Iter **/

export function more(val) {return val.next().done === false}
export function alloc(len) {return Array(nat(len))}
export function arr(val) {return isArr(val) ? val : slice(val)}
export function arrCopy(val) {return maybeCopy(val, arr(val))}

function maybeCopy(src, out) {return is(src, out) ? reslice(out) : out}
function reslice(val) {return Array.prototype.slice.call(val)}

export function slice(val, start, next) {
  opt(start, isInt)
  opt(next, isInt)
  if (isNil(val)) return []
  if (isList(val)) return Array.prototype.slice.call(val, start, next)
  if (isSet(val) || isIterator(val)) return values(val).slice(start, next)
  throw errConvert(val, `array`)
}

export function keys(val) {
  if (!isObj(val)) return []
  if (isList(val)) return span(val.length)
  if (isSet(val)) return copy(val, setValues)
  if (isMap(val)) return copy(val, mapKeys)
  if (isIterator(val)) return span(iterLen(val))
  if (isIter(val) && hasMeth(val, `keys`)) return arr(val.keys())
  if (isStruct(val)) return structKeys(val)
  throw errConvert(val, `keys`)
}

// Doesn't prealloc because performance improvement would be minimal.
function copy(src, fun) {const out = []; fun(src, out); return out}
function setValues(val, out) {for (val of val) out.push(val)}
function mapKeys(val, out) {for (val of val.keys()) out.push(val)}
function structKeys(val) {return Object.keys(struct(val))}

export function values(val) {
  if (!isObj(val)) return []
  if (isArr(val)) return val
  if (isList(val)) return Array.prototype.slice.call(val)
  if (isSet(val)) return copy(val, setValues)
  if (isMap(val)) return copy(val, mapValues)
  if (isIterator(val)) return copy(val, iterValues)
  if (isIter(val) && hasMeth(val, `values`)) return arr(val.values())
  if (isStruct(val)) return structValues(val)
  throw errConvert(val, `values`)
}

function mapValues(val, out) {for (val of val.values()) out.push(val)}
function iterValues(val, out) {for (val of val) out.push(val)}

// Like `Object.values` but much faster.
function structValues(src) {
  const out = Object.keys(src)
  let ind = -1
  while (++ind < out.length) out[ind] = src[out[ind]]
  return out
}

export function valuesCopy(val) {return maybeCopy(val, values(val))}

export function entries(val) {
  if (!isObj(val)) return []
  if (isArr(val)) return copy(val, arrEntries)
  if (isList(val)) return copy(val, listEntries)
  if (isSet(val)) return copy(val, setEntries)
  if (isMap(val)) return copy(val, mapEntries)
  if (isIterator(val)) return copy(val, iterEntries)
  if (isIter(val) && hasMeth(val, `entries`)) return arr(val.entries())
  if (isStruct(val)) return structEntries(val)
  throw errConvert(val, `entries`)
}

function arrEntries(val, out, ind = -1) {for (val of val) out.push([++ind, val])}
function listEntries(val, out, ind = -1) {for (val of val) out.push([++ind, val])}
function setEntries(val, out) {for (val of val.entries()) out.push(val)}
function mapEntries(val, out) {for (val of val.entries()) out.push(val)}
function iterEntries(val, out, ind = -1) {for (val of val) out.push([++ind, val])}

// Like `Object.entries` but much faster.
function structEntries(src) {
  const out = Object.keys(src)
  let ind = -1
  while (++ind < out.length) out[ind] = [out[ind], src[out[ind]]]
  return out
}

export function reify(val) {return hasIter(val) ? map(val, reify) : val}

function hasIter(val) {return isList(val) ? some(val, hasIter) : isIterator(val)}

export function vac(val) {return isVac(val) ? undefined : val}

export function indexOf(val, elem) {
  if (opt(val, isList)) {
    let ind = -1
    while (++ind < val.length) if (is(val[ind], elem)) return ind
  }
  return -1
}

export function includes(val, elem) {return values(val).includes(elem)}
export function concat(one, two) {return values(one).concat(values(two))}
export function append(val, elem) {return values(val).concat([elem])}
export function prepend(val, elem) {return [elem].concat(values(val))}

export function len(val) {
  if (!isObj(val)) return 0

  if (isIter(val)) {
    const len = getLength(val)
    if (isNat(len)) return len

    const size = getSize(val)
    if (isNat(size)) return size

    if (isIterator(val)) return iterLen(val)
    return 0
  }

  if (isStruct(val)) return Object.keys(val).length
  throw TypeError(`unable to measure length of ${show(val)}`)
}

function iterLen(val) {
  let out = 0
  while (more(val)) out++
  return out
}

export function hasLen(val) {return len(val) > 0}

export function each(val, fun) {
  req(fun, isFun)
  for (val of values(val)) fun(val)
}

export function map(val, fun) {return mapMut(valuesCopy(val), fun)}

export function mapMut(val, fun) {
  req(val, isArr)
  req(fun, isFun)
  let ind = -1
  while (++ind < val.length) val[ind] = fun(val[ind])
  return val
}

export function mapCompact(val, fun) {return compact(map(val, fun))}

export function filter(val, fun) {
  req(fun, isFun)
  const out = []
  for (val of values(val)) if (fun(val)) out.push(val)
  return out
}

export function reject(val, fun) {return filter(val, not(fun))}

export function compact(val) {
  const out = []
  for (val of values(val)) if (val) out.push(val)
  return out
}

export function remove(src, val) {
  return filter(src, function remove(elem) {return !is(val, elem)})
}

export function fold(val, acc, fun) {
  req(fun, isFun)
  for (val of values(val)) acc = fun(acc, val)
  return acc
}

export function find(val, fun) {
  req(fun, isFun)
  for (val of values(val)) if (fun(val)) return val
  return undefined
}

export function procure(val, fun) {
  req(fun, isFun)
  for (val of values(val)) if ((val = fun(val))) return val
  return undefined
}

export function every(val, fun) {
  req(fun, isFun)
  for (val of values(val)) if (!fun(val)) return false
  return true
}

export function some(val, fun) {
  req(fun, isFun)
  for (val of values(val)) if (fun(val)) return true
  return false
}

export function head(val) {
  if (!isObj(val)) return undefined
  if (isList(val)) return val[0]
  if (isIter(val)) return iter(val).next().value
  return val[keys(val)[0]]
}

function iter(val) {return hasMeth(val, `values`) ? val.values() : val[Symbol.iterator]()}

export function last(val) {return val = values(val), val[val.length - 1]}
export function init(val) {return values(val).slice(0, -1)}
export function tail(val) {return values(val).slice(1)}
export function take(val, len) {return values(val).slice(0, nat(len))}

export function count(val, fun) {
  req(fun, isFun)
  let out = 0
  for (val of values(val)) if (fun(val)) out++
  return out
}

// https://tc39.github.io/ecma262/#sec-sortcompare
export function compare(one, two) {
  if (one === undefined && two === undefined) return 0
  if (one === undefined) return 1
  if (two === undefined) return -1
  one += ``
  two += ``
  if (one < two) return -1
  if (two < one) return 1
  return 0
}

export function compareFin(one, two) {
  one = fin(one)
  two = fin(two)
  if (one < two) return -1
  if (one > two) return 1
  return 0
}

export function sort(val, fun) {return valuesCopy(val).sort(fun)}
export function reverse(val) {return valuesCopy(val).reverse()}

export function index(val, fun) {
  req(fun, isFun)
  const out = npo()
  for (val of values(val)) {
    const key = fun(val)
    if (isKey(key)) out[key] = val
  }
  return out
}

export function group(val, fun) {
  req(fun, isFun)
  const out = npo()
  for (val of values(val)) {
    const key = fun(val)
    if (isKey(key)) (out[key] || (out[key] = [])).push(val)
  }
  return out
}

export function partition(val, fun) {
  req(fun, isFun)
  const one = []
  const two = []
  for (val of values(val)) (fun(val) ? one : two).push(val)
  return [one, two]
}

export function sum(val) {return fold(val, 0, addFin)}

function addFin(acc, val) {return onlyFin(acc) + onlyFin(val)}
function onlyFin(val) {return isFin(val) ? val : 0}

export function zip(src) {
  const out = npo()
  for (const [key, val] of values(src)) if (isKey(key)) out[key] = val
  return out
}

export function mapFrom(...args) {
  const out = new Map()
  let ind = 0
  while (ind < args.length) out.set(args[ind++], args[ind++])
  return out
}

export function range(min, max) {
  min = int(min)
  max = int(max)
  if (!(max >= min)) throw Error(`invalid range [${min},${max})`)

  const out = alloc(max - min)
  let ind = -1
  while (++ind < out.length) out[ind] = min + ind
  return out
}

export function span(len) {return range(0, nat(len))}
export function times(len, fun) {return mapMut(span(len), fun)}
export function repeat(len, val) {return alloc(len).fill(val)}
export function set(val) {return isSet(val) ? val : new Set(values(val))}
export function setCopy(val) {return new Set(values(val))}
