/* eslint-disable no-implicit-coercion, no-new-wrappers */

import {
  // assertStrictEquals as is,
  assertEquals as eq,
  assertThrows as throws,
} from 'assert'

import * as f from '../fpx.mjs'

const {create} = Object

function id(a) {return a}
function args() {return arguments}
function* gen() {}

eq(f.truthy(),   !!(undefined))
eq(f.truthy(0),  !!(0))
eq(f.truthy(''), !!(''))
eq(f.truthy(10), !!(10))

eq(f.falsy(),   !undefined)
eq(f.falsy(0),  !0)
eq(f.falsy(''), !'')
eq(f.falsy(10), !10)

eq(f.is(),             true)
eq(f.is(NaN, NaN),     true)
eq(f.is(-0, +0),       true)
eq(f.is('one', 'one'), true)
eq(f.is('one', 'two'), false)
eq(f.is({}, {}),       false)

eq(f.isNum(),         false)
eq(f.isNum(10),       true)
eq(f.isNum(NaN),      true)
eq(f.isNum(Infinity), true)
eq(f.isNum(null),     false)
eq(f.isNum('10'),     false)
eq(f.isNum([]),       false)

eq(f.isFin(),          false)
eq(f.isFin(10),        true)
eq(f.isFin(10.20),     true)
eq(f.isFin(-10.20),    true)
eq(f.isFin(NaN),       false)
eq(f.isFin(Infinity),  false)
eq(f.isFin(-Infinity), false)
eq(f.isFin(null),      false)
eq(f.isFin('10'),      false)
eq(f.isFin([]),        false)

eq(f.isInt(),          false)
eq(f.isInt(0),         true)
eq(f.isInt(10),        true)
eq(f.isInt(10),        true)
eq(f.isInt(-10),       true)
eq(f.isInt(-10),       true)
eq(f.isInt(10.20),     false)
eq(f.isInt(-10.20),    false)
eq(f.isInt(NaN),       false)
eq(f.isInt(Infinity),  false)
eq(f.isInt(-Infinity), false)
eq(f.isInt(null),      false)
eq(f.isInt('10'),      false)
eq(f.isInt([]),        false)

eq(f.isNat(),          false)
eq(f.isNat(0),         true)
eq(f.isNat(10),        true)
eq(f.isNat(-10),       false)
eq(f.isNat(10.20),     false)
eq(f.isNat(-10.20),    false)
eq(f.isNat(NaN),       false)
eq(f.isNat(Infinity),  false)
eq(f.isNat(-Infinity), false)
eq(f.isNat(null),      false)
eq(f.isNat('10'),      false)
eq(f.isNat([]),        false)

eq(f.isNaN(),          false)
eq(f.isNaN(NaN),       true)
eq(f.isNaN(Infinity),  false)
eq(f.isNaN(undefined), false)

eq(f.isInf(),            false)
eq(f.isInf(Infinity),    true)
eq(f.isInf(-Infinity),   true)
eq(f.isInf(NaN),         false)
eq(f.isInf(undefined),   false)
eq(f.isInf(10),          false)
eq(f.isInf(-10),         false)
eq(f.isInf('Infinity'),  false)
eq(f.isInf('-Infinity'), false)

eq(f.isStr(),   false)
eq(f.isStr(''), true)

eq(f.isBool(),        false)
eq(f.isBool(true),    true)
eq(f.isBool(false),   true)
eq(f.isBool(null),    false)
eq(f.isBool(Boolean), false)

eq(f.isSym(),               false)
eq(f.isSym(Symbol('blah')), true)
eq(f.isSym('Symbol(blah)'), false)

eq(f.isKey(''),             true)
eq(f.isKey(0),              true)
eq(f.isKey(-10),            true)
eq(f.isKey(10),             true)
eq(f.isKey(10.20),          true)
eq(f.isKey(Symbol('blah')), true)
eq(f.isKey(true),           true)
eq(f.isKey(null),           false)
eq(f.isKey(undefined),      false)
eq(f.isKey(NaN),            false)
eq(f.isKey(Infinity),       false)
eq(f.isKey(-Infinity),      false)
eq(f.isKey({}),             false)
eq(f.isKey([]),             false)

eq(f.isPrim(),         true)
eq(f.isPrim(null),     true)
eq(f.isPrim(10),       true)
eq(f.isPrim(''),       true)
eq(f.isPrim(Symbol()), true)
eq(f.isPrim(true),     true)
eq(f.isPrim({}),       false)
eq(f.isPrim([]),       false)
eq(f.isPrim(id),       false)
eq(f.isPrim(/_/),      false)

eq(f.isComp(),         false)
eq(f.isComp(null),     false)
eq(f.isComp(10),       false)
eq(f.isComp(''),       false)
eq(f.isComp(Symbol()), false)
eq(f.isComp(true),     false)
eq(f.isComp({}),       true)
eq(f.isComp([]),       true)
eq(f.isComp(id),       true)
eq(f.isComp(/_/),      true)

eq(f.isInst(null,   Object), false)
eq(f.isInst([],     Object), true)
eq(f.isInst(Object, Object), true)

eq(f.isFun(),           false)
eq(f.isFun(id),         true)
eq(f.isFun(create(id)), false)

eq(f.isObj(),              false)
eq(f.isObj(null),          false)
eq(f.isObj(''),            false)
eq(f.isObj(id),            false)
eq(f.isObj({}),            true)
eq(f.isObj([]),            true)
eq(f.isObj(/_/),           true)
eq(f.isObj(create(null)),  true)
eq(f.isObj(create({})),    true)
eq(f.isObj(new String()),  true)
eq(f.isObj(new Number()),  true)
eq(f.isObj(new Boolean()), true)

eq(f.isDict(),             false)
eq(f.isDict(null),         false)
eq(f.isDict(''),           false)
eq(f.isDict(id),           false)
eq(f.isDict([]),           false)
eq(f.isDict(/_/),          false)
eq(f.isDict(create({})),   false)
eq(f.isDict({}),           true)
eq(f.isDict(create(null)), true)

eq(f.isStruct(),              false)
eq(f.isStruct(null),          false)
eq(f.isStruct(''),            false)
eq(f.isStruct(id),            false)
eq(f.isStruct([]),            false)
eq(f.isStruct(new String()),  false) // Unfortunate special case.
eq(f.isStruct({}),            true)
eq(f.isStruct(/_/),           true)
eq(f.isStruct(create({})),    true)
eq(f.isStruct(new Number()),  true) // TODO: make `false` without a special case.
eq(f.isStruct(new Boolean()), true) // TODO: make `false` without a special case.

eq(f.isArr(),             false)
eq(f.isArr(''),           false)
eq(f.isArr([]),           true)
eq(f.isArr(create([])),   true)
eq(f.isArr(args(10, 20)), false)

eq(f.isList(),                  false)
eq(f.isList(''),                false)
eq(f.isList([]),                true)
eq(f.isList(create([])),        true)
eq(f.isList(args(10, 20)),      true)
eq(f.isList({length: 0}),       false)
eq(f.isList(new String('str')), false)

eq(f.isReg(),            false)
eq(f.isReg(/_/),         true)
eq(f.isReg(create(/_/)), true)
eq(f.isReg({}),          false)

eq(f.isDate(),                      false)
eq(f.isDate(new Date()),            true)
eq(f.isDate(Date.now()),            false)
eq(f.isDate(new Date().toString()), false)

eq(f.isValidDate(),              false)
eq(f.isValidDate(new Date()),    true)
eq(f.isValidDate(new Date(NaN)), false)

eq(f.isInvalidDate(),              false)
eq(f.isInvalidDate(new Date()),    false)
eq(f.isInvalidDate(new Date(NaN)), true)

eq(f.isPromise(),                          false)
eq(f.isPromise({}),                        false)
eq(f.isPromise({then () {}}),              false)
eq(f.isPromise(Promise.resolve()),         true)
eq(f.isPromise({then () {}, catch () {}}), true)

eq(f.isNil(),          true)
eq(f.isNil(null),      true)
eq(f.isNil(undefined), true)
eq(f.isNil(false),     false)

eq(f.isSome(),          false)
eq(f.isSome(null),      false)
eq(f.isSome(undefined), false)
eq(f.isSome(false),     true)

eq(f.isIter(),      false)
eq(f.isIter(gen),   false)
eq(f.isIter(gen()), true)

eq(f.isOpt(null,      f.isStr), true)
eq(f.isOpt(undefined, f.isStr), true)
eq(f.isOpt('str',     f.isStr), true)
eq(f.isOpt(10,        f.isStr), false)
throws(f.isOpt)
throws(() => f.isOpt(null))
throws(() => f.isOpt(undefined))
throws(() => f.isOpt('str'))

/** testBy **/

// Function: call with operand, convert result to boolean
eq(f.testBy(10,    id),                                true)
eq(f.testBy(0,     id),                                false)
eq(f.testBy('one', id),                                true)
eq(f.testBy('',    id),                                false)

// null and undefined: strict equality
eq(f.testBy(),                                         true)
eq(f.testBy(undefined, null),                          false)
eq(f.testBy(null, undefined),                          false)

// String: strict equality
eq(f.testBy('one',                    'one'),          true)
eq(f.testBy('one',                    'two'),          false)
eq(f.testBy(new String('not string'), 'one'),          false)
eq(f.testBy(10,                       '10'),           false)

// Number: SameValueZero
eq(f.testBy(10,             10),                       true)
eq(f.testBy('10',           10),                       false)
eq(f.testBy(10,             '10'),                     false)
eq(f.testBy(NaN,            NaN),                      true)
eq(f.testBy(10,             NaN),                      false)
eq(f.testBy(NaN,            10),                       false)
eq(f.testBy(Infinity,       Infinity),                 true)
eq(f.testBy(Infinity,       -Infinity),                false)
eq(f.testBy(new Number(10), 10),                       false)

// Regexp: operand must be string; use `.test()`
eq(f.testBy('one',                    /one/),          true)
eq(f.testBy('two',                    /one/),          false)
eq(f.testBy({},                       /object/),       false)
eq(f.testBy(new String('not string'), /str/),          false)

// List: operand must be list; apply patterns recursively
eq(f.testBy(undefined,   []),                          false)
eq(f.testBy({length: 0}, []),                          false)
eq(f.testBy('',          []),                          false)
eq(f.testBy([],          []),                          true)
eq(f.testBy(args(),      []),                          true)
eq(f.testBy([10, 20],    [10]),                        true)
eq(f.testBy([10],        [10, 20]),                    false)
eq(f.testBy(['one'],     [/one/]),                     true)

// Struct: operand must be non-list object; apply patterns recursively
eq(f.testBy(undefined, {}),                            false)
eq(f.testBy([],        {}),                            false)
eq(f.testBy(args(),    {}),                            false)
eq(f.testBy({},        {}),                            true)
eq(f.testBy(id,        {}),                            false)
eq(f.testBy({nan: NaN, one: 10}, {nan: Number.isNaN}), true)
eq(f.testBy({nan: NaN}, {nan: Number.isNaN, one: 10}), false)
