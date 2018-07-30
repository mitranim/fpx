'use strict'

/* global Symbol, Promise */
/* eslint-disable no-implicit-coercion */

const {eq} = require('./utils')
const f = require('../dist/fpx')
const {create} = Object

function id(a) {return a}
function args() {return arguments}
function* gen() {}

eq(f.truthy(),                                         !!(undefined))
eq(f.truthy(0),                                        !!(0))
eq(f.truthy(''),                                       !!(''))
eq(f.truthy(10),                                       !!(10))

eq(f.falsy(),                                          !undefined)
eq(f.falsy(0),                                         !0)
eq(f.falsy(''),                                        !'')
eq(f.falsy(10),                                        !10)

eq(f.is(),                                             true)
eq(f.is(NaN, NaN),                                     true)
eq(f.is(-0, +0),                                       true)
eq(f.is('one', 'one'),                                 true)
eq(f.is('one', 'two'),                                 false)
eq(f.is({}, {}),                                       false)

eq(f.isNumber(),                                       false)
eq(f.isNumber(10),                                     true)
eq(f.isNumber(NaN),                                    true)
eq(f.isNumber(Infinity),                               true)
eq(f.isNumber(null),                                   false)
eq(f.isNumber('10'),                                   false)
eq(f.isNumber([]),                                     false)

eq(f.isFinite(),                                       false)
eq(f.isFinite(10),                                     true)
eq(f.isFinite(10.20),                                  true)
eq(f.isFinite(-10.20),                                 true)
eq(f.isFinite(NaN),                                    false)
eq(f.isFinite(Infinity),                               false)
eq(f.isFinite(-Infinity),                              false)
eq(f.isFinite(null),                                   false)
eq(f.isFinite('10'),                                   false)
eq(f.isFinite([]),                                     false)

eq(f.isInteger(),                                      false)
eq(f.isInteger(0),                                     true)
eq(f.isInteger(10),                                    true)
eq(f.isInteger(10),                                    true)
eq(f.isInteger(-10),                                   true)
eq(f.isInteger(-10),                                   true)
eq(f.isInteger(10.20),                                 false)
eq(f.isInteger(-10.20),                                false)
eq(f.isInteger(NaN),                                   false)
eq(f.isInteger(Infinity),                              false)
eq(f.isInteger(-Infinity),                             false)
eq(f.isInteger(null),                                  false)
eq(f.isInteger('10'),                                  false)
eq(f.isInteger([]),                                    false)

eq(f.isNatural(),                                      false)
eq(f.isNatural(0),                                     true)
eq(f.isNatural(10),                                    true)
eq(f.isNatural(-10),                                   false)
eq(f.isNatural(10.20),                                 false)
eq(f.isNatural(-10.20),                                false)
eq(f.isNatural(NaN),                                   false)
eq(f.isNatural(Infinity),                              false)
eq(f.isNatural(-Infinity),                             false)
eq(f.isNatural(null),                                  false)
eq(f.isNatural('10'),                                  false)
eq(f.isNatural([]),                                    false)

eq(f.isNaN(),                                          false)
eq(f.isNaN(NaN),                                       true)
eq(f.isNaN(Infinity),                                  false)
eq(f.isNaN(undefined),                                 false)

eq(f.isInfinity(),                                     false)
eq(f.isInfinity(Infinity),                             true)
eq(f.isInfinity(-Infinity),                            true)
eq(f.isInfinity(NaN),                                  false)
eq(f.isInfinity(undefined),                            false)
eq(f.isInfinity(10),                                   false)
eq(f.isInfinity(-10),                                  false)
eq(f.isInfinity('Infinity'),                           false)
eq(f.isInfinity('-Infinity'),                          false)

eq(f.isString(),                                       false)
eq(f.isString(''),                                     true)

eq(f.isBoolean(),                                      false)
eq(f.isBoolean(true),                                  true)
eq(f.isBoolean(false),                                 true)
eq(f.isBoolean(null),                                  false)
eq(f.isBoolean(Boolean),                               false)

eq(f.isSymbol(),                                       false)
eq(f.isSymbol(Symbol('blah')),                         true)
eq(f.isSymbol('Symbol(blah)'),                         false)

eq(f.isKey(''),                                        true)
eq(f.isKey(0),                                         true)
eq(f.isKey(-10),                                       true)
eq(f.isKey(10),                                        true)
eq(f.isKey(10.20),                                     true)
eq(f.isKey(Symbol('blah')),                            true)
eq(f.isKey(true),                                      true)
eq(f.isKey(null),                                      false)
eq(f.isKey(undefined),                                 false)
eq(f.isKey(NaN),                                       false)
eq(f.isKey(Infinity),                                  false)
eq(f.isKey(-Infinity),                                 false)
eq(f.isKey({}),                                        false)
eq(f.isKey([]),                                        false)

eq(f.isPrimitive(),                                    true)
eq(f.isPrimitive(null),                                true)
eq(f.isPrimitive(10),                                  true)
eq(f.isPrimitive(''),                                  true)
eq(f.isPrimitive(Symbol()),                            true)
eq(f.isPrimitive(true),                                true)
eq(f.isPrimitive({}),                                  false)
eq(f.isPrimitive([]),                                  false)
eq(f.isPrimitive(id),                                  false)
eq(f.isPrimitive(/_/),                                 false)

eq(f.isComplex(),                                      false)
eq(f.isComplex(null),                                  false)
eq(f.isComplex(10),                                    false)
eq(f.isComplex(''),                                    false)
eq(f.isComplex(Symbol()),                              false)
eq(f.isComplex(true),                                  false)
eq(f.isComplex({}),                                    true)
eq(f.isComplex([]),                                    true)
eq(f.isComplex(id),                                    true)
eq(f.isComplex(/_/),                                   true)

eq(f.isInstance(null, Object),                         false)
eq(f.isInstance([],   Object),                         true)
eq(f.isInstance(Object, Object),                       true)

eq(f.isFunction(),                                     false)
eq(f.isFunction(id),                                   true)
eq(f.isFunction(create(id)),                           false)

eq(f.isObject(),                                       false)
eq(f.isObject(null),                                   false)
eq(f.isObject(''),                                     false)
eq(f.isObject(id),                                     false)
eq(f.isObject({}),                                     true)
eq(f.isObject([]),                                     true)
eq(f.isObject(/_/),                                    true)
eq(f.isObject(create(null)),                           true)
eq(f.isObject(create({})),                             true)

eq(f.isDict(),                                         false)
eq(f.isDict(null),                                     false)
eq(f.isDict(''),                                       false)
eq(f.isDict(id),                                       false)
eq(f.isDict([]),                                       false)
eq(f.isDict(/_/),                                      false)
eq(f.isDict(create({})),                               false)
eq(f.isDict({}),                                       true)
eq(f.isDict(create(null)),                             true)

eq(f.isStruct(),                                       false)
eq(f.isStruct(null),                                   false)
eq(f.isStruct(''),                                     false)
eq(f.isStruct(id),                                     false)
eq(f.isStruct([]),                                     false)
eq(f.isStruct({}),                                     true)
eq(f.isStruct(/_/),                                    true)
eq(f.isStruct(create({})),                             true)

eq(f.isArray(),                                        false)
eq(f.isArray(''),                                      false)
eq(f.isArray([]),                                      true)
eq(f.isArray(create([])),                              true)
eq(f.isArray(args(10, 20)),                            false)

eq(f.isList(),                                         false)
eq(f.isList(''),                                       false)
eq(f.isList([]),                                       true)
eq(f.isList(create([])),                               true)
eq(f.isList(args(10, 20)),                             true)
eq(f.isList({length: 0}),                              false)

eq(f.isRegExp(),                                       false)
eq(f.isRegExp(/_/),                                    true)
eq(f.isRegExp(create(/_/)),                            true)
eq(f.isRegExp({}),                                     false)

eq(f.isDate(),                                         false)
eq(f.isDate(new Date()),                               true)
eq(f.isDate(Date.now()),                               false)
eq(f.isDate(new Date().toString()),                    false)

eq(f.isValidDate(),                                    false)
eq(f.isValidDate(new Date()),                          true)
eq(f.isValidDate(new Date(NaN)),                       false)

eq(f.isInvalidDate(),                                  false)
eq(f.isInvalidDate(new Date()),                        false)
eq(f.isInvalidDate(new Date(NaN)),                     true)

eq(f.isPromise(),                                      false)
eq(f.isPromise({}),                                    false)
eq(f.isPromise({then () {}}),                          false)
eq(f.isPromise(Promise.resolve()),                     true)
eq(f.isPromise({then () {}, catch () {}}),             true)

eq(f.isIterator(),                                     false)
eq(f.isIterator(gen),                                  false)
eq(f.isIterator(gen()),                                true)

eq(f.isNil(),                                          true)
eq(f.isNil(null),                                      true)
eq(f.isNil(undefined),                                 true)
eq(f.isNil(false),                                     false)

eq(f.isSomething(),                                    false)
eq(f.isSomething(null),                                false)
eq(f.isSomething(undefined),                           false)
eq(f.isSomething(false),                               true)

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
