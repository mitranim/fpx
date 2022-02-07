import 'https://cdn.jsdelivr.net/npm/@mitranim/test@0.1.2/emptty.mjs'
import * as t from 'https://cdn.jsdelivr.net/npm/@mitranim/test@0.1.2/test.mjs'
import * as f from '../fpx.mjs'

const cli = t.Args.os()
t.conf.testFilterFrom(cli.get(`run`))
if (cli.bool(`v`)) t.conf.testRep = t.conf.benchRep

/* Utils */

function args() {return arguments}
function arrgs(...args) {return args}
function toArgs(val) {return args(...(val ?? []))}
function unreachable() {throw Error(`unreachable`)}
function* gen() {unreachable()}
async function* agen() {unreachable()}
function* copygen(val) {for (val of val) yield val}
const inherit = Object.create
function fail() {unreachable()}

function testSeqs(src, fun) {
  t.ok(Array.isArray(src))
  fun(function make() {return src.slice()})
  fun(function make() {return new Set(src)})
  fun(function make() {return args(...src)})
  fun(function make() {return copygen(src)})
}

function testMaps(src, fun) {
  fun(function make() {return Object.fromEntries(Object.entries(src))})
  fun(function make() {return new Map(Object.entries(src))})
}

function testColls(list, dict, fun) {
  testSeqs(list, fun)
  testMaps(dict, fun)
}

/* Tests */

// Tested first because used in most Fpx assertions.
t.test(function test_show() {
  function test(src, exp) {t.is(f.show(src), exp)}

  test(undefined,                   `undefined`)
  test(null,                        `null`)
  test(0,                           `0`)
  test(NaN,                         `NaN`)
  test(Infinity,                    `Infinity`)
  test(-10,                         `-10`)
  test(10,                          `10`)
  test(``,                          `""`)
  test(`str`,                       `"str"`)
  test({},                          `{}`)
  test(inherit(null),               `{}`)
  test(inherit(inherit(null)),      `{}`)
  test({one: `two`, three: `four`}, `{"one":"two","three":"four"}`)
  test([],                          `[]`)
  test([10, `str`],                 `[10,"str"]`)
  test(args,                        `[function args]`)
  test(gen(),                       `[object Generator]`)
  test(agen(),                      `[object AsyncGenerator]`)
  test(class Cls {},                `[function Cls]`)
  test(new class {}(),              `[object Object]`)

  function testCls(cls) {test(new cls(), `[object Cls]`)}

  testCls(class Cls {})
  testCls(class Cls extends Array {})
  testCls(class Cls extends Set {})
  testCls(class Cls extends Map {})

  testCls(class Cls               {get [Symbol.toStringTag]() {return this.constructor.name}})
  testCls(class Cls extends Array {get [Symbol.toStringTag]() {return this.constructor.name}})
  testCls(class Cls extends Set   {get [Symbol.toStringTag]() {return this.constructor.name}})
  testCls(class Cls extends Map   {get [Symbol.toStringTag]() {return this.constructor.name}})

  testCls(class Cls               {toString() {unreachable()}})
  testCls(class Cls extends Array {toString() {unreachable()}})
  testCls(class Cls extends Set   {toString() {unreachable()}})
  testCls(class Cls extends Map   {toString() {unreachable()}})

  testCls(class Cls               {toString() {unreachable()} get [Symbol.toStringTag]() {return this.constructor.name}})
  testCls(class Cls extends Array {toString() {unreachable()} get [Symbol.toStringTag]() {return this.constructor.name}})
  testCls(class Cls extends Set   {toString() {unreachable()} get [Symbol.toStringTag]() {return this.constructor.name}})
  testCls(class Cls extends Map   {toString() {unreachable()} get [Symbol.toStringTag]() {return this.constructor.name}})

  // For comparison, inane behavior we dislike:
  t.is(`` + {}, `[object Object]`)
  t.is(`` + [], ``)
  t.is(`` + new class Cls extends Set {}(), `[object Set]`)
  t.is(`` + new class Cls extends Map {}(), `[object Map]`)
})

t.test(function test_render() {
  t.throws(() => f.render({}), TypeError, `unable to convert {} to string`)
  t.throws(() => f.render(inherit(null)), TypeError, `unable to convert {} to string`)
  t.throws(() => f.render(inherit(inherit(null))), TypeError, `unable to convert {} to string`)
  t.throws(() => f.render({one: `two`, three: `four`}), TypeError, `unable to convert {"one":"two","three":"four"} to string`)
  t.throws(() => f.render([]), TypeError, `unable to convert [] to string`)
  t.throws(() => f.render([10, `str`]), TypeError, `unable to convert [10,"str"] to string`)
  t.throws(() => f.render(args), TypeError, `unable to convert [function args] to string`)
  t.throws(() => f.render(gen()), TypeError, `unable to convert [object Generator] to string`)
  t.throws(() => f.render(agen()), TypeError, `unable to convert [object AsyncGenerator] to string`)
  t.throws(() => f.render(class Cls {}), TypeError, `unable to convert [function Cls] to string`)
  t.throws(() => f.render(new class {}), TypeError, `unable to convert [object Object] to string`)
  t.throws(() => f.render(new class Cls {}), TypeError, `unable to convert [object Cls] to string`)
  t.throws(() => f.render(new class Cls extends Array {}), TypeError, `unable to convert [object Cls] to string`)

  t.is(f.render(), ``)
  t.is(f.render(null), ``)
  t.is(f.render(0), `0`)
  t.is(f.render(NaN), `NaN`)
  t.is(f.render(Infinity), `Infinity`)
  t.is(f.render(-10), `-10`)
  t.is(f.render(10), `10`)
  t.is(f.render(``), ``)
  t.is(f.render(`str`), `str`)
  t.is(f.render({toString() {return `blah`}}), `blah`)
})

t.test(function test_bind() {
  t.throws(f.bind, TypeError, `read properties of undefined`)

  t.is(f.bind(f.add)(10, 20), f.add(10, 20))
  t.is(f.bind(f.add, 10)(20), f.add(10, 20))
  t.is(f.bind(f.add, 10, 20)(), f.add(10, 20))

  t.test(function test_bind_this() {
    function self() {return this}
    function test(ref) {t.is(f.bind.call(ref, self)(), ref)}

    test()
    test(10)
    test(`str`)
    test({})
    test([])
  })
})

t.test(function test_not() {
  t.throws(f.not, TypeError, `satisfy test isFun`)

  t.is(f.not(f.add)(10, 20), !f.add(10, 20))
  t.no(f.not(f.add)(10, 20))

  t.is(f.not(f.add)(-10, 10), !f.add(-10, 10))
  t.ok(f.not(f.add)(-10, 10))
})

t.test(function test_truthy() {
  t.is(f.truthy(), !!(undefined))
  t.is(f.truthy(0), !!(0))
  t.is(f.truthy(``), !!(``))
  t.is(f.truthy(10), !!(10))
})

t.test(function test_falsy() {
  t.is(f.falsy(), !undefined)
  t.is(f.falsy(0), !0)
  t.is(f.falsy(``), !``)
  t.is(f.falsy(10), !10)
})

t.test(function test_is() {
  t.no(f.is(`one`, `two`))
  t.no(f.is({}, {}))

  t.ok(f.is())
  t.ok(f.is(NaN, NaN))
  t.ok(f.is(-0, +0))
  t.ok(f.is(`one`, `one`))
})

t.test(function test_isNil() {
  t.no(f.isNil(false))

  t.ok(f.isNil())
  t.ok(f.isNil(null))
  t.ok(f.isNil(undefined))
})

t.test(function test_isSome() {
  t.no(f.isSome())
  t.no(f.isSome(null))
  t.no(f.isSome(undefined))

  t.ok(f.isSome(false))
})

t.test(function test_isBool() {
  t.no(f.isBool())
  t.no(f.isBool(null))
  t.no(f.isBool(Boolean))

  t.ok(f.isBool(true))
  t.ok(f.isBool(false))
})

t.test(function test_isNum() {
  t.no(f.isNum())
  t.no(f.isNum(null))
  t.no(f.isNum(`10`))
  t.no(f.isNum([]))

  t.ok(f.isNum(10))
  t.ok(f.isNum(NaN))
  t.ok(f.isNum(Infinity))
})

t.test(function test_isFin() {
  t.no(f.isFin())
  t.no(f.isFin(NaN))
  t.no(f.isFin(Infinity))
  t.no(f.isFin(-Infinity))
  t.no(f.isFin(null))
  t.no(f.isFin(`10`))
  t.no(f.isFin([]))

  t.ok(f.isFin(10))
  t.ok(f.isFin(10.20))
  t.ok(f.isFin(-10.20))
})

t.test(function test_isFinNeg() {
  t.no(f.isFinNeg())
  t.no(f.isFinNeg(`-10`))
  t.no(f.isFinNeg(`10`))
  t.no(f.isFinNeg([]))

  t.no(f.isFinNeg(NaN))
  t.no(f.isFinNeg(Infinity))
  t.no(f.isFinNeg(-Infinity))

  t.no(f.isFinNeg(-0))
  t.no(f.isFinNeg(0))
  t.no(f.isFinNeg(10))
  t.no(f.isFinNeg(10.20))

  t.ok(f.isFinNeg(-10))
  t.ok(f.isFinNeg(-10.20))
})

t.test(function test_isFinPos() {
  t.no(f.isFinPos())
  t.no(f.isFinPos(`-10`))
  t.no(f.isFinPos(`10`))
  t.no(f.isFinPos([]))

  t.no(f.isFinPos(NaN))
  t.no(f.isFinPos(Infinity))
  t.no(f.isFinPos(-Infinity))

  t.no(f.isFinPos(0))
  t.no(f.isFinPos(-0))
  t.no(f.isFinPos(-10))
  t.no(f.isFinPos(-10.20))

  t.ok(f.isFinPos(10))
  t.ok(f.isFinPos(10.20))
})

t.test(function test_isInt() {
  t.no(f.isInt())
  t.no(f.isInt(10.20))
  t.no(f.isInt(-10.20))
  t.no(f.isInt(NaN))
  t.no(f.isInt(Infinity))
  t.no(f.isInt(-Infinity))
  t.no(f.isInt(null))
  t.no(f.isInt(`10`))
  t.no(f.isInt([]))

  t.ok(f.isInt(0))
  t.ok(f.isInt(10))
  t.ok(f.isInt(10))
  t.ok(f.isInt(-10))
  t.ok(f.isInt(-10))
})

t.test(function test_isNat() {
  t.no(f.isNat())
  t.no(f.isNat(-1))
  t.no(f.isNat(-10))
  t.no(f.isNat(10.20))
  t.no(f.isNat(-10.20))
  t.no(f.isNat(NaN))
  t.no(f.isNat(Infinity))
  t.no(f.isNat(-Infinity))
  t.no(f.isNat(null))
  t.no(f.isNat(`10`))
  t.no(f.isNat([]))

  t.ok(f.isNat(0))
  t.ok(f.isNat(1))
  t.ok(f.isNat(10))
})

t.test(function test_isIntNeg() {
  t.no(f.isIntNeg())
  t.no(f.isIntNeg(null))
  t.no(f.isIntNeg(`10`))
  t.no(f.isIntNeg(`-10`))
  t.no(f.isIntNeg(NaN))
  t.no(f.isIntNeg(Infinity))
  t.no(f.isIntNeg(-Infinity))
  t.no(f.isIntNeg(0))
  t.no(f.isIntNeg(-0))
  t.no(f.isIntNeg(10))
  t.no(f.isIntNeg(20))
  t.no(f.isIntNeg(10.20))
  t.no(f.isIntNeg(-10.20))

  t.ok(f.isIntNeg(-10))
  t.ok(f.isIntNeg(-20))
})

t.test(function test_isIntPos() {
  t.no(f.isIntPos())
  t.no(f.isIntPos(null))
  t.no(f.isIntPos(`10`))
  t.no(f.isIntPos(`-10`))
  t.no(f.isIntPos(NaN))
  t.no(f.isIntPos(Infinity))
  t.no(f.isIntPos(-Infinity))
  t.no(f.isIntPos(0))
  t.no(f.isIntPos(-0))
  t.no(f.isIntPos(-10))
  t.no(f.isIntPos(-20))
  t.no(f.isIntPos(10.20))
  t.no(f.isIntPos(-10.20))

  t.ok(f.isIntPos(10))
  t.ok(f.isIntPos(20))
})

t.test(function test_isNaN() {
  t.no(f.isNaN())
  t.no(f.isNaN(-Infinity))
  t.no(f.isNaN(Infinity))
  t.no(f.isNaN(-10))
  t.no(f.isNaN(10))
  t.no(f.isNaN(0))
  t.no(f.isNaN(`0`))
  t.no(f.isNaN(`NaN`))
  t.no(f.isNaN([]))
  t.no(f.isNaN({}))

  t.ok(f.isNaN(NaN))
})

t.test(function test_isInf() {
  t.no(f.isInf())
  t.no(f.isInf(NaN))
  t.no(f.isInf(undefined))
  t.no(f.isInf(10))
  t.no(f.isInf(-10))
  t.no(f.isInf(`Infinity`))
  t.no(f.isInf(`-Infinity`))
  t.no(f.isInf([]))
  t.no(f.isInf({}))

  t.ok(f.isInf(Infinity))
  t.ok(f.isInf(-Infinity))
})

t.test(function test_isBigInt() {
  t.no(f.isBigInt(0))
  t.no(f.isBigInt(10))
  t.no(f.isBigInt(-10))
  t.no(f.isBigInt(10.20))
  t.no(f.isBigInt(-10.20))
  t.no(f.isBigInt(NaN))
  t.no(f.isBigInt(Infinity))
  t.no(f.isBigInt(new Number(10)))
  t.no(f.isBigInt(`10`))

  t.ok(f.isBigInt(0n))
  t.ok(f.isBigInt(10n))
  t.ok(f.isBigInt(-10n))
  t.ok(f.isBigInt(BigInt(0)))
  t.ok(f.isBigInt(BigInt(10)))
  t.ok(f.isBigInt(BigInt(-10)))
})

t.test(function test_isStr() {
  t.no(f.isStr())
  t.no(f.isStr(new String(``)))

  t.ok(f.isStr(``))
})

t.test(function test_isSym() {
  t.no(f.isSym())
  t.no(f.isSym(`Symbol(blah)`))

  t.ok(f.isSym(Symbol(`blah`)))
})

t.test(function test_isKey() {
  t.no(f.isKey(null))
  t.no(f.isKey(undefined))
  t.no(f.isKey(NaN))
  t.no(f.isKey(Infinity))
  t.no(f.isKey(-Infinity))
  t.no(f.isKey({}))
  t.no(f.isKey([]))

  t.ok(f.isKey(``))
  t.ok(f.isKey(0))
  t.ok(f.isKey(-10))
  t.ok(f.isKey(10))
  t.ok(f.isKey(10.20))
  t.ok(f.isKey(Symbol(`blah`)))
  t.ok(f.isKey(true))
  t.ok(f.isKey(10n))
  t.ok(f.isKey(-10n))
})

t.test(function test_isJunk() {
  t.no(f.isJunk(0))
  t.no(f.isJunk(false))
  t.no(f.isJunk(``))
  t.no(f.isJunk([]))
  t.no(f.isJunk({}))

  t.ok(f.isJunk())
  t.ok(f.isJunk(undefined))
  t.ok(f.isJunk(null))
  t.ok(f.isJunk(NaN))
  t.ok(f.isJunk(Infinity))
  t.ok(f.isJunk(-Infinity))
})

t.test(function test_isComp() {
  t.no(f.isComp())
  t.no(f.isComp(null))
  t.no(f.isComp(10))
  t.no(f.isComp(``))
  t.no(f.isComp(Symbol()))
  t.no(f.isComp(true))

  t.ok(f.isComp({}))
  t.ok(f.isComp([]))
  t.ok(f.isComp(f.id))
  t.ok(f.isComp(/_/))
})

t.test(function test_isPrim() {
  t.no(f.isPrim({}))
  t.no(f.isPrim([]))
  t.no(f.isPrim(f.id))
  t.no(f.isPrim(/_/))

  t.ok(f.isPrim())
  t.ok(f.isPrim(null))
  t.ok(f.isPrim(10))
  t.ok(f.isPrim(``))
  t.ok(f.isPrim(Symbol()))
  t.ok(f.isPrim(true))
})

t.test(function test_isFun() {
  t.no(f.isFun())
  t.no(f.isFun(true))
  t.no(f.isFun(10))
  t.no(f.isFun(`str`))
  t.no(f.isFun([]))
  t.no(f.isFun({}))

  // `val instanceof Function` would have returned `true` here.
  t.no(f.isFun(inherit(() => {})))
  t.no(f.isFun(inherit(function() {})))
  t.no(f.isFun(inherit(function*() {})))
  t.no(f.isFun(inherit(async () => {})))
  t.no(f.isFun(inherit(async function() {})))
  t.no(f.isFun(inherit(async function*() {})))

  t.ok(f.isFun(() => {}))
  t.ok(f.isFun(function() {}))
  t.ok(f.isFun(function*() {}))
  t.ok(f.isFun(async () => {}))
  t.ok(f.isFun(async function() {}))
  t.ok(f.isFun(async function*() {}))
})

t.test(function test_isFunSync() {
  t.no(f.isFunSync(function*() {}))
  t.no(f.isFunSync(async () => {}))
  t.no(f.isFunSync(async function() {}))
  t.no(f.isFunSync(async function*() {}))

  t.ok(f.isFunSync(() => {}))
  t.ok(f.isFunSync(function() {}))
})

t.test(function test_isFunGen() {
  t.no(f.isFunGen(() => {}))
  t.no(f.isFunGen(function() {}))
  t.no(f.isFunGen(async () => {}))
  t.no(f.isFunGen(async function() {}))
  t.no(f.isFunGen(async function*() {}))

  t.ok(f.isFunGen(function*() {}))
})

t.test(function test_isFunAsync() {
  t.no(f.isFunAsync(() => {}))
  t.no(f.isFunAsync(function() {}))
  t.no(f.isFunAsync(function*() {}))
  t.no(f.isFunAsync(async function*() {}))

  t.ok(f.isFunAsync(async () => {}))
  t.ok(f.isFunAsync(async function() {}))
})

t.test(function test_isFunAsyncGen() {
  t.no(f.isFunAsyncGen(() => {}))
  t.no(f.isFunAsyncGen(function() {}))
  t.no(f.isFunAsyncGen(function*() {}))
  t.no(f.isFunAsyncGen(async () => {}))
  t.no(f.isFunAsyncGen(async function() {}))

  t.ok(f.isFunAsyncGen(async function*() {}))
})

t.test(function test_isObj() {
  t.no(f.isObj())
  t.no(f.isObj(null))
  t.no(f.isObj(``))
  t.no(f.isObj(f.id))

  t.ok(f.isObj({}))
  t.ok(f.isObj([]))
  t.ok(f.isObj(/_/))
  t.ok(f.isObj(inherit(null)))
  t.ok(f.isObj(inherit({})))
  t.ok(f.isObj(new String()))
  t.ok(f.isObj(new Number()))
  t.ok(f.isObj(new Boolean()))
})

t.test(function test_isStruct() {
  t.no(f.isStruct())
  t.no(f.isStruct(null))
  t.no(f.isStruct(``))
  t.no(f.isStruct(f.id))
  t.no(f.isStruct([]))
  t.no(f.isStruct(new String()))
  t.no(f.isStruct(gen()))
  t.no(f.isStruct(agen()))

  t.ok(f.isStruct({}))
  t.ok(f.isStruct(/_/))
  t.ok(f.isStruct(inherit({})))
  t.ok(f.isStruct(new Number()))
  t.ok(f.isStruct(new Boolean()))
})

t.test(function test_isArr() {
  class Arr extends Array {}

  t.no(f.isArr())
  t.no(f.isArr(``))
  t.no(f.isArr(args(10, 20)))
  t.no(f.isArr(inherit([])))

  t.ok(f.isArr([]))
  t.ok(f.isArr(new Arr()))
})

t.test(function test_isReg() {
  t.no(f.isReg())
  t.no(f.isReg({}))

  t.ok(f.isReg(/_/))
  t.ok(f.isReg(inherit(/_/)))
})

t.test(function test_isDate() {
  t.no(f.isDate())
  t.no(f.isDate(Date.now()))
  t.no(f.isDate(new Date().toString()))

  t.ok(f.isDate(new Date()))
})

t.test(function test_isValidDate() {
  t.no(f.isValidDate())
  t.no(f.isValidDate(new Date(NaN)))

  t.ok(f.isValidDate(new Date()))
})

t.test(function test_isInvalidDate() {
  t.no(f.isInvalidDate())
  t.no(f.isInvalidDate(new Date()))

  t.ok(f.isInvalidDate(new Date(NaN)))
})

t.test(function test_isSet() {
  t.no(f.isSet())
  t.no(f.isSet(new Map()))
  t.no(f.isSet([]))
  t.no(f.isSet({}))

  t.ok(f.isSet(new Set()))
  t.ok(f.isSet(new class extends Set {}()))
})

t.test(function test_isMap() {
  t.no(f.isMap())
  t.no(f.isMap(new Set()))
  t.no(f.isMap([]))
  t.no(f.isMap({}))

  t.ok(f.isMap(new Map()))
  t.ok(f.isMap(new class extends Map {}()))
})

t.test(function test_isPromise() {
  t.no(f.isPromise())
  t.no(f.isPromise({}))

  t.ok(f.isPromise(Promise.resolve()))
  t.ok(f.isPromise({then() {}}))
  t.ok(f.isPromise({then() {}, catch() {}}))
})

t.test(function test_isIter() {
  t.no(f.isIter())
  t.no(f.isIter(null))
  t.no(f.isIter(10))
  t.no(f.isIter(true))
  t.no(f.isIter(gen))
  t.no(f.isIter(agen))
  t.no(f.isIter(agen()))
  t.no(f.isIter(``))
  t.no(f.isIter(`str`))
  t.no(f.isIter({length: 0}))
  t.no(f.isIter({size: 0}))
  t.no(f.isIter({}))
  t.no(f.isIter({next: f.nop}))
  t.no(f.isIter({[Symbol.asyncIterator]: f.nop}))

  t.ok(f.isIter(gen()))
  t.ok(f.isIter([]))
  t.ok(f.isIter(new Set()))
  t.ok(f.isIter(new Map()))
  t.ok(f.isIter(args()))
  t.ok(f.isIter(new String()))
  t.ok(f.isIter(new String(`str`)))
  t.ok(f.isIter({[Symbol.iterator]: f.nop}))
})

t.test(function test_isIterAsync() {
  t.no(f.isIterAsync())
  t.no(f.isIterAsync(null))
  t.no(f.isIterAsync(`str`))
  t.no(f.isIterAsync(gen))
  t.no(f.isIterAsync(gen()))
  t.no(f.isIterAsync([]))
  t.no(f.isIterAsync(new Set()))
  t.no(f.isIterAsync(new Map()))
  t.no(f.isIterAsync(args()))
  t.no(f.isIterAsync(agen))
  t.no(f.isIterAsync({[Symbol.iterator]: f.nop}))

  t.ok(f.isIterAsync(agen()))
  t.ok(f.isIterAsync({[Symbol.asyncIterator]: f.nop}))
})

t.test(function test_isIterator() {
  t.no(f.isIterator())
  t.no(f.isIterator(null))
  t.no(f.isIterator(10))
  t.no(f.isIterator(true))
  t.no(f.isIterator(gen))
  t.no(f.isIterator([]))
  t.no(f.isIterator(new Set()))
  t.no(f.isIterator(new Map()))
  t.no(f.isIterator(args()))
  t.no(f.isIterator(``))
  t.no(f.isIterator(new String()))
  t.no(f.isIterator({length: 0}))
  t.no(f.isIterator({size: 0}))
  t.no(f.isIterator({}))
  t.no(f.isIterator({next: f.nop}))
  t.no(f.isIterator({[Symbol.iterator]: f.nop}))
  t.no(f.isIterator({[Symbol.asyncIterator]: f.nop}))
  t.no(f.isIterator({[Symbol.asyncIterator]: f.nop, next: f.nop}))
  t.no(f.isIterator(agen))
  t.no(f.isIterator(agen()))

  t.ok(f.isIterator(gen()))
  t.ok(f.isIterator({[Symbol.iterator]: f.nop, next: f.nop}))
})

t.test(function test_isIteratorAsync() {
  t.no(f.isIteratorAsync())
  t.no(f.isIteratorAsync(null))
  t.no(f.isIteratorAsync(10))
  t.no(f.isIteratorAsync(true))
  t.no(f.isIteratorAsync(gen))
  t.no(f.isIteratorAsync([]))
  t.no(f.isIteratorAsync(new Set()))
  t.no(f.isIteratorAsync(new Map()))
  t.no(f.isIteratorAsync(args()))
  t.no(f.isIteratorAsync(``))
  t.no(f.isIteratorAsync(new String()))
  t.no(f.isIteratorAsync({length: 0}))
  t.no(f.isIteratorAsync({size: 0}))
  t.no(f.isIteratorAsync({}))
  t.no(f.isIteratorAsync({next: f.nop}))
  t.no(f.isIteratorAsync({[Symbol.iterator]: f.nop}))
  t.no(f.isIteratorAsync({[Symbol.asyncIterator]: f.nop}))
  t.no(f.isIteratorAsync({[Symbol.iterator]: f.nop, next: f.nop}))
  t.no(f.isIteratorAsync(agen))
  t.no(f.isIteratorAsync(gen()))

  t.ok(f.isIteratorAsync(agen()))
  t.ok(f.isIteratorAsync({[Symbol.asyncIterator]: f.nop, next: f.nop}))
})

t.test(function test_isGen() {
  t.no(f.isGen())
  t.no(f.isGen(null))
  t.no(f.isGen(10))
  t.no(f.isGen(true))
  t.no(f.isGen(gen))
  t.no(f.isGen(agen))
  t.no(f.isGen(agen()))
  t.no(f.isGen([]))
  t.no(f.isGen(new Set()))
  t.no(f.isGen(new Map()))
  t.no(f.isGen(args()))
  t.no(f.isGen(``))
  t.no(f.isGen(new String()))
  t.no(f.isGen({length: 0}))
  t.no(f.isGen({size: 0}))
  t.no(f.isGen({}))
  t.no(f.isGen({next: f.nop}))
  t.no(f.isGen({[Symbol.iterator]: f.nop}))

  t.no(f.isGen({
    [Symbol.iterator]: f.nop,
    next: f.nop,
  }))

  t.no(f.isGen({
    [Symbol.iterator]: f.nop,
    next: f.nop,
    return: f.nop,
  }))

  t.no(f.isGen({
    [Symbol.iterator]: f.nop,
    next: f.nop,
    throw: f.nop,
  }))

  t.no(f.isGen({
    [Symbol.iterator]: f.nop,
    return: f.nop,
    throw: f.nop,
  }))

  t.no(f.isGen({
    [Symbol.asyncIterator]: f.nop,
    next: f.nop,
    return: f.nop,
    throw: f.nop,
  }))

  t.ok(f.isGen(gen()))

  t.ok(f.isGen({
    [Symbol.iterator]: f.nop,
    next: f.nop,
    return: f.nop,
    throw: f.nop,
  }))
})

t.test(function test_isCls() {
  t.no(f.isCls(undefined))
  t.no(f.isCls({}))
  t.no(f.isCls(() => {}))
  t.no(f.isCls({}.toString))
  t.no(f.isCls(`str`))

  t.ok(f.isCls(Object))
  t.ok(f.isCls(function Cls() {}))
  t.ok(f.isCls(class Cls {}))
})

t.test(function test_isDict() {
  t.no(f.isDict(undefined))
  t.no(f.isDict(null))
  t.no(f.isDict(``))
  t.no(f.isDict(f.id))
  t.no(f.isDict([]))
  t.no(f.isDict(/_/))
  t.no(f.isDict(inherit({})))

  t.ok(f.isDict({}))
  t.ok(f.isDict(inherit(null)))
})

t.test(function test_isList() {
  t.no(f.isList(undefined))
  t.no(f.isList(null))
  t.no(f.isList(``))
  t.no(f.isList({length: 0}))
  t.no(f.isList(gen()))
  t.no(f.isList(new Set()))
  t.no(f.isList(new Map()))

  t.ok(f.isList([]))
  t.ok(f.isList(inherit([])))
  t.ok(f.isList(args(10, 20)))
  t.ok(f.isList(new String(``)))
})

t.test(function test_isSeq() {
  t.no(f.isSeq(undefined))
  t.no(f.isSeq(null))
  t.no(f.isSeq(10))
  t.no(f.isSeq(`str`))
  t.no(f.isSeq(false))
  t.no(f.isSeq({}))
  t.no(f.isSeq(new Map()))
  t.no(f.isSeq({length: 0}))

  t.ok(f.isSeq([]))
  t.ok(f.isSeq(args()))
  t.ok(f.isSeq(gen()))
  t.ok(f.isSeq(new Set()))
  t.ok(f.isSeq(new String(``)))
})

t.test(function test_isVac() {
  function test(val, exp) {t.is(f.isVac(val), exp)}
  function empty(val) {test(val, true)}
  function full(val) {test(val, false)}
  testVac(empty, full)
})

function testVac(empty, full) {
  empty()
  empty(null)
  empty(false)
  empty(0)
  empty(NaN)
  empty(``)
  empty([])
  empty([``])
  empty([0])
  empty([NaN])
  empty([false])
  empty([[]])
  empty([[[]]])
  empty([[[], NaN]])
  empty([[[]], false])
  empty([[[0]], false])
  empty([[[0], NaN], false])

  full(true)
  full(10)
  full(`str`)
  full({})
  full([10])
  full([true])
  full([{}])
  full([[], {}])
  full([[[true]]])
  full([[], [[true]]])
}

t.test(function test_isScalar() {
  t.no(f.isScalar(inherit(null)))
  t.no(f.isScalar({}))
  t.no(f.isScalar([]))
  t.no(f.isScalar(gen()))
  t.no(f.isScalar(agen()))
  t.no(f.isScalar(new class Cls {}()))
  t.no(f.isScalar(new Map()))
  t.no(f.isScalar(new Set()))
  t.no(f.isScalar(Promise.resolve()))
  t.no(f.isScalar(f.id))
  t.no(f.isScalar(class Cls {}))

  t.ok(f.isScalar())
  t.ok(f.isScalar(null))
  t.ok(f.isScalar(false))
  t.ok(f.isScalar(true))
  t.ok(f.isScalar(0))
  t.ok(f.isScalar(NaN))
  t.ok(f.isScalar(Infinity))
  t.ok(f.isScalar(10))
  t.ok(f.isScalar(10n))
  t.ok(f.isScalar(``))
  t.ok(f.isScalar(`str`))
  t.ok(f.isScalar(Symbol()))
  t.ok(f.isScalar(new Boolean()))
  t.ok(f.isScalar(new Number()))
  t.ok(f.isScalar(new String()))
  t.ok(f.isScalar(new URL(`https://example.com`)))
  t.ok(f.isScalar({toString: unreachable}))
  t.ok(f.isScalar(new class Cls {toString() {unreachable()}} ()))
  t.ok(f.isScalar(new class Cls extends Array {toString() {unreachable()}} ()))
  t.ok(f.isScalar(new class Cls extends Map {toString() {unreachable()}} ()))
  t.ok(f.isScalar(new class Cls extends Set {toString() {unreachable()}} ()))
  t.ok(f.isScalar(new class Cls extends URL {} (`https://example.com`)))
})

t.test(function test_isInst() {
  t.throws(f.isInst, TypeError, `expected undefined to satisfy test isCls`)
  t.throws(() => f.isInst({}), TypeError, `expected undefined to satisfy test isCls`)
  t.throws(() => f.isInst({}, `str`), TypeError, `expected "str" to satisfy test isCls`)
  t.throws(() => f.isInst({}, () => {}), TypeError, `expected [function () => {}] to satisfy test isCls`)
  t.throws(() => f.isInst(f.nop, Function), TypeError, `expected [function Function] to satisfy test isCls`)

  t.no(f.isInst(null,   Object))
  t.no(f.isInst(Object, Object))
  t.no(f.isInst({},     Array))

  t.ok(f.isInst([], Object))
  t.ok(f.isInst([], Array))
  t.ok(f.isInst({}, Object))
})

t.test(function test_isListOf() {
  t.throws(() => f.isListOf(),          TypeError, `expected undefined to satisfy test isFun`)
  t.throws(() => f.isListOf([]),        TypeError, `expected undefined to satisfy test isFun`)
  t.throws(() => f.isListOf([], 10),    TypeError, `expected 10 to satisfy test isFun`)
  t.throws(() => f.isListOf([], `str`), TypeError, `expected "str" to satisfy test isFun`)

  t.no(f.isListOf(10,             f.isStr))
  t.no(f.isListOf(null,           f.isStr))
  t.no(f.isListOf(undefined,      f.isStr))
  t.no(f.isListOf(`str`,          f.isStr))
  t.no(f.isListOf({},             f.isStr))
  t.no(f.isListOf([10],           f.isStr))
  t.no(f.isListOf([`one`, 10],    f.isStr))
  t.no(f.isListOf([`one`, 10],    f.isFin))
  t.ok(f.isListOf([],             f.isStr))
  t.ok(f.isListOf([`one`, `two`], f.isStr))
  t.ok(f.isListOf([10, 20],       f.isFin))
})

t.test(function test_isEmpty() {
  t.no(f.isEmpty([0]))
  t.no(f.isEmpty([[]]))
  t.no(f.isEmpty({}))
  t.no(f.isEmpty({length: 0}))
  t.no(f.isEmpty({size: 0}))
  t.no(f.isEmpty(args(0)))

  t.ok(f.isEmpty())
  t.ok(f.isEmpty(10))
  t.ok(f.isEmpty(`str`))
  t.ok(f.isEmpty([]))
  t.ok(f.isEmpty(new Set()))
  t.ok(f.isEmpty(new Map()))
  t.ok(f.isEmpty(args()))
})

t.test(function test_hasMeth() {
  t.no(f.hasMeth())
  t.no(f.hasMeth(undefined, `toString`))
  t.no(f.hasMeth(inherit(null), `toString`))
  t.no(f.hasMeth(10, `toString`))
  t.no(f.hasMeth(`str`, `toString`))
  t.no(f.hasMeth({}, `call`))
  t.no(f.hasMeth({}, `bind`))
  t.no(f.hasMeth({key: `val`}, `key`))

  t.ok(f.hasMeth({}, `toString`))
  t.ok(f.hasMeth([], `toString`))
  t.ok(f.hasMeth(new Number(10), `toString`))
  t.ok(f.hasMeth(new String(`str`), `toString`))
  t.ok(f.hasMeth(f.nop, `toString`))
  t.ok(f.hasMeth(f.nop, `call`))
  t.ok(f.hasMeth(f.nop, `bind`))
  t.ok(f.hasMeth({key() {}}, `key`))
})

t.test(function test_req() {
  t.test(function test_invalid() {
    t.throws(() => f.req(true, null), TypeError, `expected validator function, got null`)
    t.throws(() => f.req(true, 10), TypeError, `expected validator function, got 10`)
  })

  t.test(function test_rejected() {
    t.throws(() => f.req(10, f.False), TypeError, `expected 10 to satisfy test False`)
    t.throws(() => f.req(`str`, f.False), TypeError, `expected "str" to satisfy test False`)
  })

  t.test(function test_valid() {
    function test(val, fun) {t.is(f.req(val, fun), val)}
    test(null, f.True)
    test(10, f.True)
    test(`str`, f.True)
    test([], f.True)
    test({}, f.True)
  })
})

t.test(function test_opt() {
  t.test(function test_invalid() {
    t.throws(() => f.opt(10, undefined), TypeError, `expected validator function, got undefined`)
    t.throws(() => f.opt(undefined, 10), TypeError, `expected validator function, got 10`)
  })

  t.test(function test_rejected() {
    t.throws(() => f.opt(10,    f.False), TypeError, `expected 10 to satisfy test False`)
    t.throws(() => f.opt(`str`, f.False), TypeError, `expected "str" to satisfy test False`)
  })

  t.test(function test_nil() {
    t.is(f.opt(undefined, f.False), undefined)
    t.is(f.opt(null,      f.False), null)
  })

  t.test(function test_valid() {
    function test(val, fun) {t.is(f.opt(val, fun), val)}
    test(null,  f.True)
    test(10,    f.True)
    test(`str`, f.True)
    test([],    f.True)
    test({},    f.True)
  })
})

t.test(function test_reqInst() {
  t.test(function test_invalid() {
    t.throws(f.reqInst,           TypeError, `expected undefined to satisfy test isCls`)
    t.throws(() => f.reqInst({}), TypeError, `expected undefined to satisfy test isCls`)
  })

  t.test(function test_rejected() {
    t.throws(() => f.reqInst(undefined, Object), TypeError, `expected undefined to be an instance of Object`)
    t.throws(() => f.reqInst(`str`,     String), TypeError, `expected "str" to be an instance of String`)
    t.throws(() => f.reqInst({},        String), TypeError, `expected {} (instance of Object) to be an instance of String`)
  })

  t.test(function test_valid() {
    function test(val, cls) {t.is(f.reqInst(val, cls), val)}
    test({},             Object)
    test([],             Object)
    test([],             Array)
    test(new String(``), Object)
    test(new String(``), String)
  })
})

t.test(function test_optInst() {
  t.test(function test_invalid() {
    t.throws(f.optInst,           TypeError, `expected undefined to satisfy test isCls`)
    t.throws(() => f.optInst({}), TypeError, `expected undefined to satisfy test isCls`)
  })

  t.test(function test_rejected() {
    t.throws(() => f.optInst(`str`, Object), TypeError, `expected "str" to be an instance of Object`)
    t.throws(() => f.optInst(`str`, String), TypeError, `expected "str" to be an instance of String`)
    t.throws(() => f.optInst({},    String), TypeError, `expected {} (instance of Object) to be an instance of String`)
  })

  t.test(function test_nil() {
    function test(val) {
      t.is(f.optInst(val, Object), val)
      t.is(f.optInst(val, Array), val)
      t.is(f.optInst(val, String), val)
    }
    test(undefined)
    test(null)
  })

  t.test(function test_valid() {
    function test(val, cls) {t.is(f.optInst(val, cls), val)}
    test({},             Object)
    test([],             Object)
    test([],             Array)
    test(new String(``), Object)
    test(new String(``), String)
  })
})

t.test(function test_only() {
  t.test(function test_invalid() {
    t.throws(f.only,                         TypeError, `expected undefined to satisfy test isFun`)
    t.throws(() => f.only(undefined, `str`), TypeError, `expected "str" to satisfy test isFun`)
  })

  t.test(function test_empty() {
    function test(val) {t.is(f.only(val, f.False), undefined)}

    test(true)
    test(`str`)
    test(10)
    test({one: 10})
    test([10, 20, 30])
  })

  t.test(function test_full() {
    function test(val) {t.is(f.only(val, f.True), val)}

    test(true)
    test(`str`)
    test(10)
    test({one: 10})
    test([10, 20, 30])
  })
})

t.test(function test_arrOf() {
  t.throws(f.arrOf,                      TypeError, `expected undefined to satisfy test isFun`)
  t.throws(() => f.arrOf(null, 10),      TypeError, `expected 10 to satisfy test isFun`)
  t.throws(() => f.arrOf([], 10),        TypeError, `expected 10 to satisfy test isFun`)
  t.throws(() => f.arrOf({}, f.True),    TypeError, `unable to convert {} to array`)
  t.throws(() => f.arrOf([10], f.False), TypeError, `expected 10 to satisfy test False`)

  t.eq(f.arrOf(undefined, f.True), [])
  t.eq(f.arrOf(null, f.True), [])
  t.eq(f.arrOf([10, 20, 30], f.True), [10, 20, 30])
})

t.test(function test_prim() {
  t.throws(() => f.prim([]),     TypeError, `satisfy test isPrim`)
  t.throws(() => f.prim({}),     TypeError, `satisfy test isPrim`)
  t.throws(() => f.prim(f.prim), TypeError, `satisfy test isPrim`)

  t.is(f.prim(), undefined)
  t.is(f.prim(undefined), undefined)
  t.is(f.prim(null), null)
  t.is(f.prim(`one`), `one`)
  t.is(f.prim(10), 10)
  t.is(f.prim(true), true)
  t.is(f.prim(false), false)
  t.is(f.prim(NaN), NaN)
  t.is(f.prim(Infinity), Infinity)
  t.is(f.prim(Symbol.for()), Symbol.for())
})

t.test(function test_bool() {
  t.throws(() => f.bool([]),            TypeError, `satisfy test isBool`)
  t.throws(() => f.bool({}),            TypeError, `satisfy test isBool`)
  t.throws(() => f.bool(0),             TypeError, `satisfy test isBool`)
  t.throws(() => f.bool(1),             TypeError, `satisfy test isBool`)
  t.throws(() => f.bool(`true`),        TypeError, `satisfy test isBool`)
  t.throws(() => f.bool(`false`),       TypeError, `satisfy test isBool`)
  t.throws(() => f.bool(new Boolean()), TypeError, `satisfy test isBool`)

  t.is(f.bool(), false)
  t.is(f.bool(null), false)
  t.is(f.bool(false), false)
  t.is(f.bool(true), true)
})

t.test(function test_num() {
  t.throws(() => f.num([]),           TypeError, `satisfy test isNum`)
  t.throws(() => f.num({}),           TypeError, `satisfy test isNum`)
  t.throws(() => f.num(`str`),        TypeError, `satisfy test isNum`)
  t.throws(() => f.num(true),         TypeError, `satisfy test isNum`)
  t.throws(() => f.num(new Number()), TypeError, `satisfy test isNum`)

  t.is(f.num(), 0)
  t.is(f.num(null), 0)
  t.is(f.num(10), 10)
  t.is(f.num(-10), -10)
  t.is(f.num(NaN), NaN)
  t.is(f.num(Infinity), Infinity)
  t.is(f.num(-Infinity), -Infinity)
})

t.test(function test_fin() {
  t.throws(() => f.fin([]),           TypeError, `satisfy test isFin`)
  t.throws(() => f.fin({}),           TypeError, `satisfy test isFin`)
  t.throws(() => f.fin(`str`),        TypeError, `satisfy test isFin`)
  t.throws(() => f.fin(true),         TypeError, `satisfy test isFin`)
  t.throws(() => f.fin(new Number()), TypeError, `satisfy test isFin`)
  t.throws(() => f.fin(NaN),          TypeError, `satisfy test isFin`)
  t.throws(() => f.fin(Infinity),     TypeError, `satisfy test isFin`)
  t.throws(() => f.fin(-Infinity),    TypeError, `satisfy test isFin`)

  t.is(f.fin(), 0)
  t.is(f.fin(null), 0)
  t.is(f.fin(10), 10)
  t.is(f.fin(-10), -10)
})

t.test(function test_int() {
  t.throws(() => f.int([]),           TypeError, `satisfy test isInt`)
  t.throws(() => f.int({}),           TypeError, `satisfy test isInt`)
  t.throws(() => f.int(`str`),        TypeError, `satisfy test isInt`)
  t.throws(() => f.int(true),         TypeError, `satisfy test isInt`)
  t.throws(() => f.int(new Number()), TypeError, `satisfy test isInt`)
  t.throws(() => f.int(NaN),          TypeError, `satisfy test isInt`)
  t.throws(() => f.int(Infinity),     TypeError, `satisfy test isInt`)
  t.throws(() => f.int(-Infinity),    TypeError, `satisfy test isInt`)
  t.throws(() => f.int(0.1),          TypeError, `satisfy test isInt`)
  t.throws(() => f.int(-0.1),         TypeError, `satisfy test isInt`)

  t.is(f.int(), 0)
  t.is(f.int(null), 0)
  t.is(f.int(-10), -10)
  t.is(f.int(0), 0)
  t.is(f.int(10), 10)
})

t.test(function test_nat() {
  t.throws(() => f.nat([]),           TypeError, `satisfy test isNat`)
  t.throws(() => f.nat({}),           TypeError, `satisfy test isNat`)
  t.throws(() => f.nat(`str`),        TypeError, `satisfy test isNat`)
  t.throws(() => f.nat(true),         TypeError, `satisfy test isNat`)
  t.throws(() => f.nat(new Number()), TypeError, `satisfy test isNat`)
  t.throws(() => f.nat(NaN),          TypeError, `satisfy test isNat`)
  t.throws(() => f.nat(Infinity),     TypeError, `satisfy test isNat`)
  t.throws(() => f.nat(-Infinity),    TypeError, `satisfy test isNat`)
  t.throws(() => f.nat(0.1),          TypeError, `satisfy test isNat`)
  t.throws(() => f.nat(-0.1),         TypeError, `satisfy test isNat`)
  t.throws(() => f.nat(-10),          TypeError, `satisfy test isNat`)

  t.is(f.nat(), 0)
  t.is(f.nat(null), 0)
  t.is(f.nat(0), 0)
  t.is(f.nat(1), 1)
  t.is(f.nat(10), 10)
})

t.test(function test_intPos() {
  t.throws(() => f.intPos([]),           TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos({}),           TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos(`str`),        TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos(true),         TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos(new Number()), TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos(NaN),          TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos(Infinity),     TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos(-Infinity),    TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos(0.1),          TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos(-0.1),         TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos(-10),          TypeError, `satisfy test isIntPos`)
  t.throws(() => f.intPos(0),            TypeError, `satisfy test isIntPos`)

  t.is(f.intPos(), 0)
  t.is(f.intPos(null), 0)
  t.is(f.intPos(1), 1)
  t.is(f.intPos(10), 10)
})

t.test(function test_str() {
  t.throws(() => f.str([]),           TypeError, `satisfy test isStr`)
  t.throws(() => f.str({}),           TypeError, `satisfy test isStr`)
  t.throws(() => f.str(true),         TypeError, `satisfy test isStr`)
  t.throws(() => f.str(new String()), TypeError, `satisfy test isStr`)
  t.throws(() => f.str(10),           TypeError, `satisfy test isStr`)

  t.is(f.str(), ``)
  t.is(f.str(null), ``)
  t.is(f.str(``), ``)
  t.is(f.str(`str`), `str`)
})

t.test(function test_dict() {
  t.throws(() => f.dict([]),                              TypeError, `satisfy test isDict`)
  t.throws(() => f.dict(inherit(inherit(inherit(null)))), TypeError, `satisfy test isDict`)
  t.throws(() => f.dict(true),                            TypeError, `satisfy test isDict`)
  t.throws(() => f.dict(10),                              TypeError, `satisfy test isDict`)
  t.throws(() => f.dict(`str`),                           TypeError, `satisfy test isDict`)
  t.throws(() => f.dict(new String()),                    TypeError, `satisfy test isDict`)

  t.is(Object.getPrototypeOf(f.dict()), null)
  t.eq(f.dict(), {})
  t.eq(f.dict(null), {})
  t.eq(f.dict(inherit(null)), {})
  t.eq(f.dict({one: 10}), {one: 10})

  const ref = {one: 10}
  t.is(f.dict(ref), ref)
})

t.test(function test_struct() {
  t.throws(() => f.struct([]),           TypeError, `satisfy test isStruct`)
  t.throws(() => f.struct(true),         TypeError, `satisfy test isStruct`)
  t.throws(() => f.struct(10),           TypeError, `satisfy test isStruct`)
  t.throws(() => f.struct(`str`),        TypeError, `satisfy test isStruct`)
  t.throws(() => f.struct(new String()), TypeError, `satisfy test isStruct`)

  t.is(Object.getPrototypeOf(f.struct()), null)
  t.eq(f.struct(), {})
  t.eq(f.struct(null), {})
  t.eq(f.struct(inherit(null)), {})
  t.eq(f.struct({one: 10}), {one: 10})

  const ref = inherit(inherit({one: 10}))
  t.is(f.struct(ref), ref)
})

t.test(function test_scalar() {
  t.throws(() => f.scalar({}), TypeError, `expected {} to satisfy test isScalar`)
  t.throws(() => f.scalar([]), TypeError, `expected [] to satisfy test isScalar`)

  function test(val) {t.is(f.scalar(val), val)}

  test(10)
  test(true)
  test(`str`)
  test({toString: unreachable})
})

// Adapted from `github.com/mitranim/jol`.
t.test(function test_inst() {
  // These rejections originate in `f.mut`.
  // We're testing the fact of calling the constructor.
  t.test(function test_indirectly_reject_invalid_inputs() {
    class Mock {constructor(val) {f.mut(this, val)}}

    t.throws(() => f.inst(),                TypeError, `expected undefined to satisfy test isCls`)
    t.throws(() => f.inst(`str`,     Mock), TypeError, `expected "str" to satisfy test isStruct`)
    t.throws(() => f.inst(10,        Mock), TypeError, `expected 10 to satisfy test isStruct`)
    t.throws(() => f.inst(f.nop,     Mock), TypeError, `expected [function nop] to satisfy test isStruct`)
    t.throws(() => f.inst([],        Mock), TypeError, `expected [] to satisfy test isStruct`)
    t.throws(() => f.inst(new Set(), Mock), TypeError, `expected [object Set] to satisfy test isStruct`)
  })

  t.test(function test_instantiate_from_dict() {
    class Mock {}
    t.ok(f.inst({}, Mock) instanceof Mock)
  })

  t.test(function test_preserve_pre_instantiated() {
    class Mock {}
    const val = new Mock()
    t.is(f.inst(val, Mock), val)
    t.is(f.inst(f.inst(val, Mock), Mock), val)
  })

  t.test(function test_upgrade_to_subclass() {
    class Sup {}
    class Sub extends Sup {}
    t.is(f.inst(new Sup(), Sub).constructor, Sub)
  })
})

t.test(function test_add() {
  t.is(f.add(), undefined + undefined)
  t.is(f.add(`7`, 3), `7${3}`)
  t.is(f.add(7, 3), 7 + 3)
})

t.test(function test_sub() {
  t.is(f.sub(), undefined - undefined)
  t.is(f.sub(`7`, 3), `7` - 3)
  t.is(f.sub(7, 3), 7 - 3)
})

t.test(function test_mul() {
  t.is(f.mul(), undefined * undefined)
  t.is(f.mul(`7`, 3), `7` * 3)
  t.is(f.mul(7, 3), 7 * 3)
})

t.test(function test_div() {
  t.is(f.div(), undefined / undefined)
  t.is(f.div(`7`, 3), `7` / 3)
  t.is(f.div(7, 3), 7 / 3)
})

t.test(function test_rem() {
  t.is(f.rem(), undefined % undefined)
  t.is(f.rem(`1.1`, 1), `1.1` % 1)
  t.is(f.rem(1.1, 1), 1.1 % 1)
  t.is(f.rem(2.3, 1), 2.3 % 1)
  t.is(f.rem(33, 2), 33 % 2)
})

t.test(function test_lt() {
  t.is(f.lt(), undefined < undefined)
  t.is(f.lt(`10`, 20), `10` < 20)
  t.is(f.lt(10, 10), 10 < 10)
  t.is(f.lt(10, -10), 10 < -10)
  t.is(f.lt(10, 10.1), 10 < 10.1)
  t.is(f.lt(10.1, 10), 10.1 < 10)
  t.is(f.lt(10, 20), 10 < 20)
  t.is(f.lt(20, 10), 20 < 10)
})

t.test(function test_gt() {
  t.is(f.gt(), undefined > undefined)
  t.is(f.gt(`10`, 20), `10` > 20)
  t.is(f.gt(10, 10), 10 > 10)
  t.is(f.gt(10, -10), 10 > -10)
  t.is(f.gt(10, 10.1), 10 > 10.1)
  t.is(f.gt(10.1, 10), 10.1 > 10)
  t.is(f.gt(10, 20), 10 > 20)
  t.is(f.gt(20, 10), 20 > 10)
})

t.test(function test_lte() {
  t.is(f.lte(), undefined <= undefined)
  t.is(f.lte(`10`, 20), `10` <= 20)
  t.is(f.lte(10, 10), 10 <= 10)
  t.is(f.lte(10, -10), 10 <= -10)
  t.is(f.lte(10, 10.1), 10 <= 10.1)
  t.is(f.lte(10.1, 10), 10.1 <= 10)
  t.is(f.lte(10, 20), 10 <= 20)
  t.is(f.lte(20, 10), 20 <= 10)
})

t.test(function test_gte() {
  t.is(f.gte(), undefined >= undefined)
  t.is(f.gte(`10`, 20), `10` >= 20)
  t.is(f.gte(10, 10), 10 >= 10)
  t.is(f.gte(10, -10), 10 >= -10)
  t.is(f.gte(10, 10.1), 10 >= 10.1)
  t.is(f.gte(10.1, 10), 10.1 >= 10)
  t.is(f.gte(10, 20), 10 >= 20)
  t.is(f.gte(20, 10), 20 >= 10)
})

t.test(function test_neg() {
  t.is(f.neg(), NaN)
  t.is(f.neg(-1), 1)
  t.is(f.neg(0), -0) // WTF
  t.is(f.neg(1), -1)
  t.is(f.neg(-10), 10)
  t.is(f.neg(0), -0) // WTF
  t.is(f.neg(10), -10)
  t.is(f.neg(`str`), NaN)
  t.is(f.neg(`10`), -10)
})

t.test(function test_inc() {
  t.is(f.inc(), undefined + 1)
  t.is(f.inc(`one`), `one${1}`)
  t.is(f.inc(NaN), NaN + 1)
  t.is(f.inc(-2), -2 + 1)
  t.is(f.inc(1), 1 + 1)
})

t.test(function test_dec() {
  t.is(f.dec(), undefined - 1)
  t.is(f.dec(`one`), `one` - 1)
  t.is(f.dec(NaN), NaN - 1)
  t.is(f.dec(-2), -2 - 1)
  t.is(f.dec(2), 2 - 1)
})

t.test(function test_nop() {
  t.is(f.nop(), undefined)
  t.is(f.nop(10), undefined)
  t.is(f.nop(f.nop), undefined)
})

t.test(function test_True() {
  t.ok(f.True())
  t.ok(f.True(true))
  t.ok(f.True(false))
  t.ok(f.True(0))
  t.ok(f.True(10))
})

t.test(function test_False() {
  t.no(f.False())
  t.no(f.False(true))
  t.no(f.False(false))
  t.no(f.False(0))
  t.no(f.False(10))
})

t.test(function test_id() {
  t.is(f.id(), undefined)
  t.is(f.id(null), null)
  t.is(f.id(10), 10)
  t.is(f.id(f.nop), f.nop)
})

t.test(function test_di() {
  t.is(f.di(), undefined)
  t.is(f.di(10), undefined)
  t.is(f.di(10, 20), 20)
  t.is(f.di(10, 20, 30), 20)
})

t.test(function test_val() {
  function test(val) {
    const fun = f.val(val)
    t.is(fun(), val)
    t.is(fun(), val)
  }

  test()
  test(null)
  test([])
  test({})
  test(Symbol())
})

t.test(function test_panic() {
  /*
  This doesn't use `t.throws` because it would enforce throwing instances of
  `Error`, while `f.panic` has no such restrictions.
  */
  function test(val) {
    try {
      f.panic(val)
      throw Error(`failed to panic`)
    }
    catch (err) {
      t.is(err, val)
      return
    }
  }

  test()
  test(10)
  test(`str`)
  test(Error(`err`))
})

t.test(function test_jsonDecode() {
  t.throws(() => f.jsonDecode(10), TypeError, `expected 10 to satisfy test isStr`)
  t.throws(() => f.jsonDecode(`blah`), SyntaxError, `Unexpected token`)

  t.is(f.jsonDecode(), null)
  t.is(f.jsonDecode(undefined), null)
  t.is(f.jsonDecode(null), null)
  t.is(f.jsonDecode(``), null)
  t.is(f.jsonDecode(`null`), null)
  t.is(f.jsonDecode(`10`), 10)
  t.is(f.jsonDecode(`true`), true)
  t.is(f.jsonDecode(`"str"`), `str`)
  t.eq(f.jsonDecode(`[10, 20]`), [10, 20])
})

t.test(function test_jsonEncode() {
  // Insanity.
  t.is(JSON.stringify(), undefined)
  t.is(JSON.stringify(null), `null`)
  t.is(JSON.stringify({}), `{}`)
  t.is(JSON.stringify(``), `""`)

  // Sanity.
  t.is(f.jsonEncode(), `null`)
  t.is(f.jsonEncode(null), `null`)
  t.is(f.jsonEncode({}), `{}`)
  t.is(f.jsonEncode(``), `""`)
})

t.test(function test_npo() {
  t.eq(f.npo(), Object.create(null))
  t.is(Object.getPrototypeOf(f.npo()), null)
  t.isnt(f.npo(), f.npo())
})

t.test(function test_hasOwn() {
  t.no(f.hasOwn(undefined,               `toString`))
  t.no(f.hasOwn(10,                      `toString`))
  t.no(f.hasOwn(`str`,                   `toString`))
  t.no(f.hasOwn({},                      `toString`))
  t.ok(f.hasOwn({toString: 10},          `toString`))
  t.no(f.hasOwn(inherit({toString: 10}), `toString`))

  t.ok(f.hasOwn(inherit(null, {toString: {value: 10, enumerable: true}}), `toString`))
  t.ok(f.hasOwn(inherit(null, {toString: {value: 10, enumerable: false}}), `toString`))
  t.no(f.hasOwn(inherit(inherit(null, {toString: {value: 10, enumerable: true}})), `toString`))
  t.no(f.hasOwn(inherit(inherit(null, {toString: {value: 10, enumerable: false}})), `toString`))
})

t.test(function test_hasOwnEnum() {
  t.no(f.hasOwnEnum(undefined,               `toString`))
  t.no(f.hasOwnEnum(10,                      `toString`))
  t.no(f.hasOwnEnum(`str`,                   `toString`))
  t.no(f.hasOwnEnum({},                      `toString`))
  t.ok(f.hasOwnEnum({toString: 10},          `toString`))
  t.no(f.hasOwnEnum(inherit({toString: 10}), `toString`))

  t.ok(f.hasOwnEnum(inherit(null, {toString: {value: 10, enumerable: true}}), `toString`))
  t.no(f.hasOwnEnum(inherit(null, {toString: {value: 10, enumerable: false}}), `toString`))
  t.no(f.hasOwnEnum(inherit(inherit(null, {toString: {value: 10, enumerable: true}})), `toString`))
  t.no(f.hasOwnEnum(inherit(inherit(null, {toString: {value: 10, enumerable: false}})), `toString`))
})

// Adapted from `github.com/mitranim/jol`.
t.test(function test_mut() {
  t.test(function test_invalid() {
    t.throws(() => f.mut(),             TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut(null, {}),     TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut(10, {}),       TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut(`one`, {}),    TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut(`one`, `one`), TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut([], {}),       TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut([], []),       TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut(f.nop, {}),    TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut(f.nop, f.nop), TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut({}, 10),       TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut({}, `one`),    TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut({}, []),       TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut({}, f.nop),    TypeError, `satisfy test isStruct`)
    t.throws(() => f.mut({}, []),       TypeError, `satisfy test isStruct`)
  })

  t.test(function test_returns_target() {
    class Mock {}
    const tar = new Mock()
    t.is(f.mut(tar, {}), tar)
  })

  t.test(function test_allow_nil() {
    class Mock {}

    function test(val) {
      const tar = new Mock()
      t.is(f.mut(tar, val), tar)
      t.eq({}, {...tar})
    }

    test(null)
    test(undefined)
  })

  t.test(function test_allow_plainest_dict() {
    class Mock {}
    const tar = new Mock()
    t.is(f.mut(tar, inherit(null, {one: {value: 10, enumerable: true}})), tar)
    t.eq({one: 10}, {...tar})
  })

  t.test(function test_allow_plain_dict() {
    class Mock {}
    const tar = new Mock()
    t.is(f.mut(tar, {one: 10}), tar)
    t.eq({one: 10}, {...tar})
  })

  t.test(function test_allow_subclass() {
    class Sup {}
    const tar = new Sup()

    class Sub extends Sup {}
    const src = Object.assign(new Sub(), {one: 10})

    t.is(f.mut(tar, src), tar)
    t.eq({one: 10}, {...tar})
  })

  t.test(function test_no_shadowing() {
    t.test(function test_plain_object() {
      const ref = {one: 10, two: 20}

      t.is(f.mut(ref, {constructor: 30, toString: 40, two: 50, three: 60}), ref)

      t.eq(Object.getOwnPropertyNames(ref), [`one`, `two`, `three`])
      t.eq(ref, {one: 10, two: 50, three: 60})

      t.is(ref.constructor, Object)
      t.is(ref.toString, Object.prototype.toString)
    })

    t.test(function test_custom_class() {
      class Mock {
        constructor() {
          this.one = 10
          this.two = 20
          Object.defineProperty(this, `three`, {
            value: 30,
            writable: true,
            enumerable: false,
            configurable: true,
          })
        }

        method() {return 40}
        get getter() {return 50}
        get getterSetter() {return 60}
        set getterSetter(_) {unreachable()}
      }

      const ref = new Mock()

      t.is(
        f.mut(ref, {
          constructor:  70,
          toString:     80,
          method:       90,
          getter:       100,
          getterSetter: 110,
          two:          120,
          three:        130,
          four:         140,
        }),
        ref,
      )

      t.eq(Object.getOwnPropertyNames(ref), [`one`, `two`, `three`, `four`])
      t.eq({...ref}, {one: 10, two: 120, four: 140})

      t.is(ref.constructor, Mock)
      t.is(ref.toString, Object.prototype.toString)
      t.is(ref.three, 30)
      t.is(ref.method(), 40)
      t.is(ref.getter, 50)
      t.is(ref.getterSetter, 60)
    })
  })
})

t.test(function test_mapDict() {
  testDictFunBasics(f.mapDict)

  t.eq(f.mapDict(undefined, f.id), {})
  t.eq(f.mapDict({}, f.id), {})
  t.eq(f.mapDict({one: 10, two: 20}, f.inc), {one: 11, two: 21})
})

function testDictFunBasics(fun) {
  t.throws(() => fun({}),          TypeError, `expected undefined to satisfy test isFun`)
  t.throws(() => fun([], f.id),    TypeError, `expected [] to satisfy test isStruct`)
  t.throws(() => fun(`str`, f.id), TypeError, `expected "str" to satisfy test isStruct`)
  t.is(Object.getPrototypeOf(fun(undefined, f.id)), null)
}

t.test(function test_pick() {
  testDictFunBasics(f.pick)

  t.eq(f.pick(undefined,            f.True), {})
  t.eq(f.pick({},                   f.True), {})
  t.eq(f.pick({one: 10, two: 20},   f.True), {one: 10, two: 20})
  t.eq(f.pick({one: 10, two: 20},   f.False), {})
  t.eq(f.pick({one: 10, two: `20`}, f.isFin), {one: 10})
})

t.test(function test_omit() {
  testDictFunBasics(f.omit)

  t.eq(f.omit(undefined,            f.True), {})
  t.eq(f.omit({},                   f.True), {})
  t.eq(f.omit({one: 10, two: 20},   f.True), {})
  t.eq(f.omit({one: 10, two: 20},   f.False), {one: 10, two: 20})
  t.eq(f.omit({one: 10, two: `20`}, f.isFin), {two: `20`})
})

t.test(function test_pickKeys() {
  t.throws(() => f.pickKeys([]),    TypeError, `expected [] to satisfy test isStruct`)
  t.throws(() => f.pickKeys(`str`), TypeError, `expected "str" to satisfy test isStruct`)

  t.is(Object.getPrototypeOf(f.pickKeys()), null)

  t.eq(f.pickKeys(), {})
  t.eq(f.pickKeys(undefined, []), {})
  t.eq(f.pickKeys({}, undefined), {})
  t.eq(f.pickKeys({}, []), {})

  t.eq(f.pickKeys({one: 10, two: 20, three: 30}, []), {})
  t.eq(f.pickKeys({one: 10, two: 20, three: 30}, [`one`]), {one: 10})
  t.eq(f.pickKeys({one: 10, two: 20, three: 30}, [`two`]), {two: 20})
  t.eq(f.pickKeys({one: 10, two: 20, three: 30}, [`three`]), {three: 30})
  t.eq(f.pickKeys({one: 10, two: 20, three: 30}, [`one`, `two`]), {one: 10, two: 20})
})

t.test(function test_omitKeys() {
  t.throws(() => f.omitKeys([]),    TypeError, `expected [] to satisfy test isStruct`)
  t.throws(() => f.omitKeys(`str`), TypeError, `expected "str" to satisfy test isStruct`)

  t.is(Object.getPrototypeOf(f.omitKeys()), null)

  t.eq(f.omitKeys(), {})
  t.eq(f.omitKeys(undefined, []), {})
  t.eq(f.omitKeys({}, undefined), {})
  t.eq(f.omitKeys({}, []), {})

  t.eq(f.omitKeys({one: 10, two: 20, three: 30}, []), {one: 10, two: 20, three: 30})
  t.eq(f.omitKeys({one: 10, two: 20, three: 30}, [`one`]), {two: 20, three: 30})
  t.eq(f.omitKeys({one: 10, two: 20, three: 30}, [`two`]), {one: 10, three: 30})
  t.eq(f.omitKeys({one: 10, two: 20, three: 30}, [`three`]), {one: 10, two: 20})
  t.eq(f.omitKeys({one: 10, two: 20, three: 30}, [`one`, `two`]), {three: 30})
})

t.test(function test_more() {
  const iter = copygen([10, 20, 30])
  t.ok(f.more(iter))
  t.ok(f.more(iter))
  t.ok(f.more(iter))
  t.no(f.more(iter))
  t.no(f.more(iter))
  t.eq([...iter], [])
})

t.test(function test_alloc() {
  t.throws(() => f.alloc(`10`), TypeError, `expected "10" to satisfy test isNat`)

  t.eq(f.alloc(), [])
  t.eq(f.alloc(0), Array(0))
  t.eq(f.alloc(1), Array(1))
  t.eq(f.alloc(2), Array(2))
})

t.test(function test_arr() {
  t.test(function test_invalid() {
    testNoAsyncIter(f.arr)
    t.throws(() => f.arr(10),        TypeError, `unable to convert 10 to array`)
    t.throws(() => f.arr(`str`),     TypeError, `unable to convert "str" to array`)
    t.throws(() => f.arr(f.nop),     TypeError, `unable to convert [function nop] to array`)
    t.throws(() => f.arr({}),        TypeError, `unable to convert {} to array`)
    t.throws(() => f.arr(new Map()), TypeError, `unable to convert [object Map] to array`)
  })

  t.test(function test_nil() {
    function test(val) {t.eq(f.arr(val), [])}
    test(undefined)
    test(null)
  })

  t.test(function test_same_reference() {
    function test(ref) {t.is(f.arr(ref), ref)}
    test([])
    test([10, 20, 30])
  })

  testSeqs(
    [10, 20, 30],
    function testSeq(make) {t.eq(f.arr(make()), [10, 20, 30])},
  )

  // This is considered a list.
  t.eq(f.arr(new String(`str`)), [`s`, `t`, `r`])
})

// Delegates to `slice`. We only need to check the basics.
t.test(function test_arrCopy() {
  function test(val, exp) {
    const out = f.arrCopy(val)
    t.isnt(out, val)
    t.eq(out, exp)
  }

  test(undefined, [])
  test(null, [])

  testSeqs([],           function testSeq(make) {test(make(), [])})
  testSeqs([10, 20, 30], function testSeq(make) {test(make(), [10, 20, 30])})
})

t.test(function test_slice() {
  t.throws(() => f.slice([], `str`), TypeError, `expected "str" to satisfy test isInt`)
  t.throws(() => f.slice([], 0, `str`), TypeError, `expected "str" to satisfy test isInt`)
  t.throws(() => f.slice({}), TypeError, `unable to convert {} to array`)
  t.throws(() => f.slice(10), TypeError, `unable to convert 10 to array`)
  t.throws(() => f.slice(`str`), TypeError, `unable to convert "str" to array`)
  t.throws(() => f.slice(new Map()), TypeError, `unable to convert [object Map] to array`)

  t.eq(f.slice(undefined), [])
  t.eq(f.slice(null), [])

  testSeqs([], function testSeq(make) {
    t.eq(f.slice(make(), 1, 2), [])
  })

  testSeqs([10, 20, 30], function testSeq(make) {
    t.eq(f.slice(make()), [10, 20, 30])
  })

  testSeqs([10, 20, 30], function testSeq(make) {
    t.eq(f.slice(make(), 1, 2), [20])
  })

  testSeqs([10, 20, 30, 40, 50], function testSeq(make) {
    t.eq(f.slice(make(), 1, 3), [20, 30])
  })
})

/*
This test doesn't use `testColls` or `testSeqs` because unlike most other
functions, this one doesn't treat sets equivalently to arrays.
*/
t.test(function test_keys() {
  testFunEmptyList(f.keys)
  testNoAsyncIter(f.keys)

  function test(src, exp) {t.eq(f.keys(src), exp)}

  test([10, 20],                      [0, 1])
  test(args(10, 20),                  [0, 1])
  test(copygen([10, 20]),             [0, 1])
  test(new Set([10, 20]),             [10, 20])
  test({one: 10, two: 20},            [`one`, `two`])
  test(new Map([[10, 20], [30, 40]]), [10, 30])

  function keys() {return [10, 20]}

  test({keys}, [`keys`])
  test({keys, [Symbol.iterator]: f.nop}, [10, 20])
})

/*
This test doesn't use `testColls` or `testSeqs` because unlike most other
functions, this one doesn't treat sets equivalently to arrays.
*/
t.test(function test_values() {
  testFunEmptyList(f.values)
  testNoAsyncIter(f.values)

  function test(src, exp) {t.eq(f.values(src), exp)}

  test([10, 20],                      [10, 20])
  test(args(10, 20),                  [10, 20])
  test(copygen([10, 20]),             [10, 20])
  test(new Set([10, 20]),             [10, 20])
  test({one: 10, two: 20},            [10, 20])
  test(new Map([[10, 20], [30, 40]]), [20, 40])

  function values() {return [10, 20]}

  test({values}, [values])
  test({values, [Symbol.iterator]: f.nop}, [10, 20])
})

// Delegates to `values`. We only need to check copying.
t.test(function test_valuesCopy() {
  testFunEmptyList(f.valuesCopy)

  function test(val, exp) {
    const out = f.valuesCopy(val)
    t.isnt(out, val)
    t.eq(out, exp)
  }

  testColls([], {}, function testEmpty(make) {test(make(), [])})

  testColls(
    [10, 20, 30],
    {one: 10, two: 20, three: 30},
    function testColl(make) {test(make(), [10, 20, 30])},
  )
})

/*
This test doesn't use `testColls` or `testSeqs` because unlike most other
functions, this one doesn't treat sets equivalently to arrays.
*/
t.test(function test_entries() {
  testFunEmptyList(f.entries)
  testNoAsyncIter(f.entries)

  function test(src, exp) {t.eq(f.entries(src), exp)}

  test([10, 20],                      [[0, 10], [1, 20]])
  test(args(10, 20),                  [[0, 10], [1, 20]])
  test(copygen([10, 20]),             [[0, 10], [1, 20]])
  test(new Set([10, 20]),             [[10, 10], [20, 20]])
  test({one: 10, two: 20},            [[`one`, 10], [`two`, 20]])
  test(new Map([[10, 20], [30, 40]]), [[10, 20], [30, 40]])

  function entries() {return [[10, 20], [30, 40]]}

  test({entries}, [[`entries`, entries]])
  test({entries, [Symbol.iterator]: f.nop}, [[10, 20], [30, 40]])
})

t.test(function test_reify() {
  t.is(f.reify(), undefined)
  t.is(f.reify(null), null)
  t.is(f.reify(0), 0)
  t.is(f.reify(false), false)
  t.is(f.reify(NaN), NaN)
  t.is(f.reify(``), ``)
  t.eq(f.reify([]), [])
  t.eq(f.reify([10, 20, 30]), [10, 20, 30])
  t.eq(f.reify([10, 20, 30].values()), [10, 20, 30])
  t.eq(f.reify(copygen([10, 20, 30])), [10, 20, 30])
  t.eq(f.reify([[10], [20], [30]]), [[10], [20], [30]])
  t.eq(f.reify([[10, 20].keys(), [30, 40].values(), [40, 50].entries()]), [[0, 1], [30, 40], [[0, 40], [1, 50]]])
  t.eq(f.reify([[10, 20].keys(), [30, 40].values(), [40, 50].entries()].values()), [[0, 1], [30, 40], [[0, 40], [1, 50]]])

  const ref = [10, [20], [[30]]]
  t.eq(f.reify(ref), [10, [20], [[30]]])
  t.is(f.reify(ref), ref)
  t.is(ref[0], f.reify(ref)[0])
  t.is(ref[1], f.reify(ref)[1])
  t.is(ref[1], f.reify(ref)[1])
  t.is(ref[2], f.reify(ref)[2])
  t.is(ref[2][0], f.reify(ref)[2][0])
})

t.test(function test_vac() {
  function test(val, exp) {t.is(f.vac(val), exp)}
  function empty(val) {test(val, undefined)}
  function full(val) {test(val, val)}
  testVac(empty, full)
})

t.test(function test_indexOf() {
  t.test(function test_invalid() {
    t.throws(() => f.indexOf(`str`), TypeError, `expected "str" to satisfy test isList`)
  })

  function test(src, val, exp) {
    t.is(f.indexOf(src, val), exp)
    t.is(f.indexOf(toArgs(src), val), exp)
  }

  test(undefined,              undefined, -1)
  test([],                     undefined, -1)
  test([10, NaN, 20, NaN, 30], undefined, -1)
  test([10, NaN, 20, NaN, 30], 0,         -1)
  test([10, NaN, 20, NaN, 30], 10,        +0)
  test([10, NaN, 20, NaN, 30], NaN,       +1)
  test([10, NaN, 20, NaN, 30], 20,        +2)
  test([10, NaN, 20, NaN, 30], 30,        +4)
  test([10, NaN, 20, NaN, 30], 40,        -1)
})

t.test(function test_includes() {
  function test(src, val, exp) {
    t.is(f.includes(src, val), exp)
    t.is(f.includes(args(...(src ?? [])), val), exp)
  }

  t.no(f.includes(`str`, `s`))

  test(undefined,              undefined, false)
  test([],                     undefined, false)
  test([10, NaN, 20, NaN, 30], undefined, false)
  test([10, NaN, 20, NaN, 30], 0,         false)
  test([10, NaN, 20, NaN, 30], 10,        true)
  test([10, NaN, 20, NaN, 30], NaN,       true)
  test([10, NaN, 20, NaN, 30], 20,        true)
  test([10, NaN, 20, NaN, 30], 30,        true)
  test([10, NaN, 20, NaN, 30], 40,        false)
})

t.test(function test_concat() {
  testFunEmptyList(f.concat)

  testColls(
    [10, 20],
    {one: 10, two: 20},
    function prev(prev) {
      testColls(
        [20, [30]],
        {two: 20, three: [30]},
        function next(next) {
          t.eq(f.concat(prev(), next()), [10, 20, 20, [30]])
        }
      )
    }
  )
})

t.test(function test_append() {
  testFunEmpty(
    function test(val) {return f.append(val, 10)},
    [10],
  )

  testColls(
    [10, 20, 30],
    {one: 10, two: 20, three: 30},
    function testColl(make) {
      t.eq(f.append(make(), 40), [10, 20, 30, 40])
    },
  )
})

t.test(function test_prepend() {
  testFunEmpty(
    function test(val) {return f.prepend(val, 10)},
    [10],
  )

  testColls(
    [10, 20, 30],
    {one: 10, two: 20, three: 30},
    function testColl(make) {
      t.eq(f.prepend(make(), 40), [40, 10, 20, 30])
    },
  )
})

function testFunEmptyList(fun) {testFunEmpty(fun, [])}
function testFunEmptyDict(fun) {testFunEmpty(fun, {})}
function testFunEmptySet(fun) {testFunEmpty(fun, new Set())}

function testFunEmpty(fun, zero) {
  t.eq(fun(), zero)
  t.eq(fun(null), zero)
  t.eq(fun(false), zero)
  t.eq(fun(10), zero)
  t.eq(fun(`str`), zero)
  t.eq(fun(fun), zero)
  t.eq(fun([]), zero)
  t.eq(fun(new Set()), zero)
  t.eq(fun(new Map()), zero)
}

function testNoAsyncIter(fun) {
  t.throws(() => fun(agen()), TypeError, `unable to convert [object AsyncGenerator]`)
}

t.test(function test_len() {
  testLen(function test(val, len) {t.is(f.len(val), len)})
})

t.test(function test_hasLen() {
  testLen(function test(val, len) {t.is(f.hasLen(val), len > 0)})
})

function testLen(test) {
  test(undefined, 0)
  test(null, 0)
  test(10, 0)
  test(true, 0)
  test(``, 0)
  test(`str`, 0)
  test(new String(``), 0)
  test(new String(`str`), 3)
  test(f.len, 0)
  test([], 0)
  test([10], 1)
  test([10, 20], 2)
  test({}, 0)
  test({one: 10}, 1)
  test({one: 10, two: 20}, 2)
  test(new Set(), 0)
  test(new Set([10, 20]), 2)
  test(new Map(), 0)
  test(new Map([[10, 20], [20, 30]]), 2)
  test(args(), 0)
  test(args(10), 1)
  test(args(10, 20), 2)
  test(copygen([]), 0)
  test(copygen([10]), 1)
  test(copygen([10, 20]), 2)
}

t.test(function test_each() {
  function test(src, exp) {
    const out = []
    f.each(src, val => out.push(val))
    t.eq(out, exp)
  }

  test(undefined, [])
  test(null, [])
  test(10, [])
  test(`str`, [])

  testColls([], {}, function testEmpty(make) {
    test(make(), [])
  })

  testColls([10, 20], {one: 10, two: 20}, function testFull(make) {
    test(make(), [10, 20])
  })
})

t.test(function test_map() {
  testFunIterInit(f.map)

  function test(src, fun, exp) {
    const out = f.map(src, fun)
    t.isnt(out, src) // Precaution due to internal use of `mapMut`.
    t.eq(out, exp)
  }

  testColls([], {}, function testEmpty(make) {
    test(make(), f.inc, [])
  })

  testColls(
    [0, false, NaN],
    {one: 0, two: false, three: NaN},
    function testInc(make) {
      test(make(), f.inc, [1, 1, NaN])
    },
  )

  testColls(
    [10, 20, 30],
    {one: 10, two: 20, three: 30},
    function testLong(make) {
      test(make(), f.inc, [11, 21, 31])
      test(make(), f.dec, [9, 19, 29])
    },
  )
})

// We only need to check the basics.
// `map` uses `mapMut` and has a more thorough test.
t.test(function test_mapMut() {
  t.throws(() => f.mapMut(undefined, f.id), TypeError, `expected undefined to satisfy test isArr`)

  function test(src, fun, exp) {
    t.is(f.mapMut(src, fun), src)
    t.eq(src, exp)
  }

  test([10, 20, 30], f.inc, [11, 21, 31])
})

function testFunIterInit(fun) {
  t.req(fun, t.isFun)
  t.throws(() => fun([], `str`), TypeError, `expected "str" to satisfy test isFun`)
}

t.test(function test_mapCompact() {
  testFunIterInit(f.mapCompact)
  testFunEmptyList(function test(val) {return f.mapCompact(val, f.id)})

  testColls(
    [-11, -2, -1, 0, 1, 2, 11],
    {one: -11, two: -2, three: -1, four: 0, five: 1, six: 2, seven: 11},
    function testColl(make) {
      t.eq(f.mapCompact(make(), f.dec), [-12, -3, -2, -1, 1, 10])
    },
  )
})

t.test(function test_filter() {
  testFunIterInit(f.filter)
  testFunEmptyList(function test(val) {return f.filter(val, f.id)})

  testColls(
    [10, 0, NaN, 20, false, 30],
    {one: 10, two: 0, three: NaN, four: 20, five: false, six: 30},
    function testColl(make) {
      t.eq(f.filter(make(), f.False), [])
      t.eq(f.filter(make(), f.True), [10, 0, NaN, 20, false, 30])
      t.eq(f.filter(make(), f.id), [10, 20, 30])
      t.eq(f.filter(make(), f.isFin), [10, 0, 20, 30])
    },
  )
})

t.test(function test_reject() {
  testFunIterInit(f.reject)
  testFunEmptyList(function test(val) {return f.reject(val, f.id)})

  testColls(
    [10, 0, NaN, 20, false, 30],
    {one: 10, two: 0, three: NaN, four: 20, five: false, six: 30},
    function testColl(make) {
      t.eq(f.reject(make(), f.False), [10, 0, NaN, 20, false, 30])
      t.eq(f.reject(make(), f.True), [])
      t.eq(f.reject(make(), f.id), [0, NaN, false])
      t.eq(f.reject(make(), f.isFin), [NaN, false])
    },
  )
})

t.test(function test_compact() {
  testFunEmptyList(f.compact)

  testColls(
    [10, 0, NaN, 20, false, 30, ``, [`str`]],
    {one: 10, two: 0, three: NaN, four: 20, five: false, six: 30, seven: ``, eight: [`str`]},
    function testColl(make) {
      t.eq(f.compact(make()), [10, 20, 30, [`str`]])
    },
  )
})

t.test(function test_remove() {
  testFunEmptyList(f.remove)

  t.eq(f.remove([10, NaN, 10, NaN, 20], 10), [NaN, NaN, 20])
  t.eq(f.remove([10, NaN, 10, NaN, 20], NaN), [10, 10, 20])

  testColls(
    [10, NaN, 20, false, 30, `str`],
    {one: 10, two: NaN, three: 20, four: false, five: 30, six: `str`},
    function testColl(make) {
      t.eq(f.remove(make(), NaN), [10, 20, false, 30, `str`])
      t.eq(f.remove(make(), 10), [NaN, 20, false, 30, `str`])
      t.eq(f.remove(make(), 20), [10, NaN, false, 30, `str`])
    },
  )
})

t.test(function test_fold() {
  t.throws(() => f.fold([], 0, `str`), TypeError, `expected "str" to satisfy test isFun`)
  testFunEmpty(src => f.fold(src, `acc`, fail), `acc`)

  testColls(
    [10, 20, 30],
    {one: 10, two: 20, three: 30},
    function testColl(make) {
      t.is(f.fold(make(), `acc`, f.id), `acc`)
      t.is(f.fold(make(), `acc`, f.add), `acc102030`)
      t.eq(f.fold(make(), 3,     arrgs), [[[3, 10], 20], 30])
      t.is(f.fold(make(), 3,     f.add), (3 + 10 + 20 + 30))
    },
  )
})

t.test(function test_find() {
  testFunIterInit(f.find)
  testFunEmpty(src => f.find(src, fail), undefined)

  testColls(
    [`10`, NaN, 20, 30],
    {one: `10`, two: NaN, three: 20, four: 30},
    function testColl(make) {
      t.is(f.find(make(), f.False), undefined)
      t.is(f.find(make(), f.True), `10`)
      t.is(f.find(make(), f.isFin), 20)
    },
  )
})

t.test(function test_procure() {
  testFunIterInit(f.procure)

  t.is(f.procure(undefined,         f.id), undefined)
  t.is(f.procure(undefined,         f.nop), undefined)
  t.is(f.procure([NaN, 10, 20, 30], f.id), 10)
  t.is(f.procure([NaN, 10, 20, 30], f.nop), undefined)

  testColls(
    [false, NaN, 10, 20, 30],
    {one: false, two: NaN, three: 10, four: 20, five: 30},
    function testColl(make) {
      t.is(f.procure(make(), f.neg), -10)
    },
  )
})

t.test(function test_every() {
  testFunIterInit(f.every)

  t.ok(f.every(undefined, f.True))
  t.ok(f.every(undefined, f.False))

  testColls(
    [10, 0],
    {one: 10, two: 0},
    function testOk(make) {t.ok(f.every(make(), f.isFin))},
  )

  testColls(
    [10, NaN],
    {one: 10, two: NaN},
    function testNo(make) {t.no(f.every(make(), f.isFin))},
  )
})

t.test(function test_some() {
  testFunIterInit(f.some)

  t.no(f.some(undefined, f.True))
  t.no(f.some(undefined, f.False))

  testColls(
    [NaN, 0],
    {one: NaN, two: 0},
    function testOk(make) {t.ok(f.some(make(), f.isFin))},
  )

  testColls(
    [NaN, `10`],
    {one: NaN, two: `10`},
    function testNo(make) {t.no(f.some(make(), f.isFin))},
  )
})

t.test(function test_head() {
  testFunEmpty(f.head)

  testColls(
    [10, 20, 30],
    {one: 10, two: 20},
    function testColl(make) {t.is(f.head(make()), 10)},
  )
})

t.test(function test_last() {
  testFunEmpty(f.last)

  testColls(
    [10, 20, 30],
    {one: 10, two: 20, three: 30},
    function testColl(make) {t.is(f.last(make()), 30)},
  )
})

t.test(function test_init() {
  testFunEmptyList(f.init)

  testColls(
    [10, 20, 30],
    {one: 10, two: 20, three: 30},
    function testColl(make) {t.eq(f.init(make()), [10, 20])}
  )
})

t.test(function test_tail() {
  testFunEmptyList(f.tail)

  testColls(
    [10, 20, 30],
    {one: 10, two: 20, three: 30},
    function testColl(make) {t.eq(f.tail(make()), [20, 30])},
  )
})

t.test(function test_take() {
  t.throws(() => f.take([], `str`), TypeError, `expected "str" to satisfy test isNat`)

  testFunEmptyList(f.take)
  testFunEmptyList(function test(val) {return f.take(val, 0)})

  function done(val) {
    t.eq(f.take(val, undefined), [])
    t.eq(f.take(val, 0), [])
  }

  done([10, 20, 30])
  done(args(10, 20, 30))
  done(new Set([10, 20, 30]))
  done(new Map([[10, 20], [30, 40]]))
  done({one: 10, two: 20})

  function test(src, len, exp) {t.eq(f.take(src, len), exp)}

  testColls(
    [10, 20, 30],
    {one: 10, two: 20, three: 30},
    function testColl(make) {
      test(make(), 0, [])
      test(make(), 1, [10])
      test(make(), 2, [10, 20])
      test(make(), 3, [10, 20, 30])
      test(make(), 4, [10, 20, 30])
    },
  )
})

t.test(function test_count() {
  testFunIterInit(f.count)

  testColls(
    [NaN, 0, false, 10, `20`],
    {one: NaN, two: 0, three: false, four: 10, five: `20`},
    function testColl(make) {
      t.is(f.count(make(), f.True), 5)
      t.is(f.count(make(), f.False), 0)
      t.is(f.count(make(), f.isFin), 2)
    },
  )
})

// Semi-placeholder, TODO check if spec authors provide test cases.
t.test(function test_compare() {
  t.is(f.compare(), +0)
  t.is(f.compare(10, undefined), -1)
  t.is(f.compare(undefined, 20), +1)
  t.is(f.compare(10, 20), -1)
  t.is(f.compare(20, 10), +1)
  t.is(f.compare(`one`, `two`), -1)
  t.is(f.compare(`two`, `one`), +1)
})

t.test(function test_compareFin() {
  t.throws(() => f.compareFin(`str`, 10), TypeError, `expected "str" to satisfy test isFin`)
  t.throws(() => f.compareFin(10, `str`), TypeError, `expected "str" to satisfy test isFin`)

  t.is(f.compareFin(), +0)
  t.is(f.compareFin(10, undefined), +1)
  t.is(f.compareFin(-10, undefined), -1)
  t.is(f.compareFin(undefined, -20), +1)
  t.is(f.compareFin(10, 20), -1)
  t.is(f.compareFin(20, 10), +1)
})

t.test(function test_sort() {
  testFunEmptyList(f.sort)

  t.test(function test_sort_default() {
    function test(src, exp) {
      const out = f.sort(src)
      t.isnt(out, src)
      t.eq(out, exp)
    }

    testColls(
      [NaN, 0, false, 10, `20`],
      {one: NaN, two: 0, three: false, four: 10, five: `20`},
      function testColl(make) {
        test(make(), [0, 10, `20`, NaN, false])
      },
    )
  })

  t.test(function test_sort_compareFin() {
    function test(src, exp) {t.eq(f.sort(src, f.compareFin), exp)}

    /*
    We delegate to `Array.prototype.sort`, which automatically sorts `undefined`
    to the end of the resulting array without invoking our comparator.
    */
    testSeqs([null, 0, -20, 30, -10, undefined, 40], function testSeq(make) {
      test(make(), [-20, -10, null, 0, 30, 40, undefined])
    })
  })
})

t.test(function test_reverse() {
  testFunEmptyList(f.reverse)

  function test(src, exp) {
    const out = f.reverse(src)
    t.isnt(out, src)
    t.eq(out, exp)
  }

  testColls(
    [NaN, 0, false, 10, `20`],
    {one: NaN, two: 0, three: false, four: 10, five: `20`},
    function testColl(make) {
      test(make(), [`20`, 10, false, 0, NaN])
    },
  )
})

t.test(function test_index() {
  testFunIterInit(f.index)
  testFunEmptyDict(function init(val) {return f.index(val, f.id)})

  t.eq(f.index(undefined, f.val(`key`)), {})
  t.eq(f.index(null, f.val(`key`)), {})

  t.test(function test_with_invalid_key() {

    testColls(
      [false, NaN, 10, 20, 30],
      {one: false, two: NaN, three: 30, four: 40},
      function testColl(make) {
        t.eq(f.index(make(), f.nop), {})
        t.eq(f.index(make(), f.val({})), {})
        t.eq(f.index(make(), f.val(f.nop)), {})
      },
    )
  })

  t.test(function test_with_constant_key() {
    const key = () => `key`

    testColls(
      [false, NaN, 10, 20, 30],
      {one: false, two: NaN, three: 10, four: 20, five: 30},
      function testColl(make) {
        t.eq(f.index(make(), key), {key: 30})
      },
    )
  })

  t.test(function test_with_usable_key() {
    testColls(
      [false, NaN, 10, 20, 30],
      {one: false, two: NaN, three: 10, four: 20, five: 30},
      function testColl(make) {
        t.eq(f.index(make(), f.id), {false: false, 10: 10, 20: 20, 30: 30})
        t.eq(f.index(make(), f.neg), {0: false, [-10]: 10, [-20]: 20, [-30]: 30})
        t.eq(f.index(make(), f.inc), {1: false, 11: 10, 21: 20, 31: 30})
      },
    )
  })
})

t.test(function test_group() {
  testFunIterInit(f.group)

  t.test(function test_with_invalid_key() {
    testColls(
      [3, 5, 7, 11],
      {one: 3, two: 5, three: 7, four: 11},
      function testColl(make) {
        t.eq(f.group(make(), f.nop), {})
        t.eq(f.group(make(), f.val(NaN)), {})
        t.eq(f.group(make(), f.val({})), {})
      },
    )
  })

  testColls(
    [3, 6, 7, 14],
    {one: 3, two: 6, three: 7, four: 14},
    function testAny(make) {
      t.eq(f.group(make(), f.id), {3: [3], 6: [6], 7: [7], 14: [14]})
      t.eq(f.group(make(), f.inc), {4: [3], 7: [6], 8: [7], 15: [14]})
      t.eq(f.group(make(), val => val % 2), {1: [3, 7], 0: [6, 14]})
    },
  )
})

t.test(function test_partition() {
  testFunIterInit(f.group)

  t.eq(f.partition(undefined, f.id), [[], []])

  testColls(
    [NaN, 0, false, 10, `20`],
    {one: NaN, two: 0, three: false, four: 10, five: `20`},
    function testColl(make) {
      t.eq(f.partition(make(), f.False), [[], [NaN, 0, false, 10, `20`]])
      t.eq(f.partition(make(), f.True), [[NaN, 0, false, 10, `20`], []])
      t.eq(f.partition(make(), f.isFin), [[0, 10], [NaN, false, `20`]])
      t.eq(f.partition(make(), f.isNum), [[NaN, 0, 10], [false, `20`]])
    },
  )
})

t.test(function test_sum() {
  testFunEmpty(f.sum, 0)
  testNoAsyncIter(f.sum)

  testColls(
    [NaN, 0, false, 10, `20`, undefined, {}, -21],
    {one: NaN, two: 0, three: false, four: 10, five: `20`, six: undefined, seven: {}, eight: -21},
    function testColl(make) {t.is(f.sum(make()), -11)},
  )
})

t.test(function test_zip() {
  testNoAsyncIter(f.zip)

  testSeqs(
    [[10, 20], [NaN, 30], [undefined, 40], [{}, 50], [60, 70]],
    function testSeq(make) {
      t.eq(f.zip(make()), {10: 20, 60: 70})
    },
  )

  const src = {one: NaN, two: 0, three: false, four: 10, five: `20`, six: undefined, seven: {}, eight: -21}

  testMaps(src, function testMap(make) {
    t.eq(f.zip(f.entries(make())), src)
  })
})

t.test(function test_mapFrom() {
  t.eq(f.mapFrom(), new Map())
  t.eq(f.mapFrom(10, 20), new Map().set(10, 20))
  t.eq(f.mapFrom(10, 20, 30), new Map().set(10, 20).set(30))
  t.eq(f.mapFrom(10, 20, 30, 40), new Map().set(10, 20).set(30, 40))
})

t.test(function test_range() {
  t.eq(f.range(), [])
  t.eq(f.range(0, undefined), [])
  t.eq(f.range(undefined, 0), [])
  t.eq(f.range(0, 0), [])
  t.eq(f.range(-1, 0), [-1])
  t.eq(f.range(-2, -1), [-2])
  t.eq(f.range(-2, 0), [-2, -1])
  t.eq(f.range(0, 1), [0])
  t.eq(f.range(1, 2), [1])
  t.eq(f.range(-7, 0), [-7, -6, -5, -4, -3, -2, -1])
  t.eq(f.range(0, 8), [0, 1, 2, 3, 4, 5, 6, 7])
  t.eq(f.range(-3, 7), [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6])
})

t.test(function test_span() {
  t.throws(() => f.span(`10`), TypeError, `expected "10" to satisfy test isNat`)
  t.throws(() => f.span(-1), TypeError, `expected -1 to satisfy test isNat`)

  t.eq(f.span(), [])
  t.eq(f.span(0), [])
  t.eq(f.span(1), [0])
  t.eq(f.span(2), [0, 1])
  t.eq(f.span(3), [0, 1, 2])
})

t.test(function test_times() {
  t.throws(() => f.times(`10`, f.nop), TypeError, `expected "10" to satisfy test isNat`)
  t.throws(() => f.times(-1, f.nop), TypeError, `expected -1 to satisfy test isNat`)
  t.throws(() => f.times(0, `str`), TypeError, `expected "str" to satisfy test isFun`)

  t.eq(f.times(undefined, f.nop), [])
  t.eq(f.times(0, f.nop), [])

  t.eq(f.times(0, f.id), [])
  t.eq(f.times(1, f.id), [0])
  t.eq(f.times(2, f.id), [0, 1])

  t.eq(f.times(0, f.inc), [])
  t.eq(f.times(1, f.inc), [1])
  t.eq(f.times(2, f.inc), [1, 2])

  t.eq(f.times(0, f.dec), [])
  t.eq(f.times(1, f.dec), [-1])
  t.eq(f.times(2, f.dec), [-1, 0])
})

t.test(function test_repeat() {
  t.throws(() => f.repeat(`str`), TypeError, `expected "str" to satisfy test isNat`)
  t.throws(() => f.repeat(-1), TypeError, `expected -1 to satisfy test isNat`)

  t.eq(f.repeat(), [])
  t.eq(f.repeat(0), [])
  t.eq(f.repeat(0, `val`), [])
  t.eq(f.repeat(1, `val`), [`val`])
  t.eq(f.repeat(2, `val`), [`val`, `val`])
  t.eq(f.repeat(3, `val`), [`val`, `val`, `val`])
})

t.test(function test_set() {
  testFunEmptySet(f.set)

  t.test(function test_same_reference() {
    function test(ref) {t.is(f.set(ref), ref)}

    test(new Set())
    test(new Set([10, 20, 30]))
    test(new class SubSet extends Set {}())
    test(new class SubSet extends Set {}([10, 20, 30]))
  })

  t.test(function test_convert() {
    function test(src, exp) {t.eq(f.set(src), exp)}

    testColls(
      [10, 20, 10, 30],
      {one: 10, two: 20, three: 10, four: 30},
      function testColl(make) {test(make(), new Set([10, 20, 30]))},
    )
  })
})

// Delegates to `f.set`. We only need to test the copying.
t.test(function test_setCopy() {
  testFunEmptySet(f.setCopy)

  function test(src, exp) {
    const out = f.setCopy(src)
    t.isnt(src, out)
    t.eq(out, exp)
  }

  testColls(
    [10, 20, 10, 30],
    {one: 10, two: 20, three: 10, four: 30},
    function testColl(make) {test(make(), new Set([10, 20, 30]))},
  )
})

console.log(`[test] ok!`)
