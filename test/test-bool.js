'use strict'

/* global Symbol, Promise */

const {runWith, fnTest, tests} = require('./utils')
const fpx = require('../lib/fpx')

/**
 * TODO
 *   testAnd
 *   testOr
 *   testArgsAnd
 *   testArgsOr
 */

function id (a)  {return a}
function args () {return arguments}

const {create} = Object

module.exports = [
  runWith(fpx.truthy,
    fnTest([],   Boolean(undefined)),
    fnTest([],   false),
    fnTest([0],  Boolean(0)),
    fnTest([0],  false),
    fnTest([''], Boolean('')),
    fnTest([''], false),
    fnTest([1],  Boolean(1)),
    fnTest([1],  true)
  ),

  runWith(fpx.falsy,
    fnTest([],   !undefined),
    fnTest([],   true),
    fnTest([0],  !0),
    fnTest([0],  true),
    fnTest([''], !''),
    fnTest([''], true),
    fnTest([1],  !1),
    fnTest([1],  false)
  ),

  runWith(fpx.is,
    fnTest([],             true),
    fnTest([NaN, NaN],     true),
    fnTest(['one', 'one'], true),
    fnTest(['one', 'two'], false),
    fnTest([{}, {}],       false)
  ),

  runWith(fpx.isNumber,
    fnTest([],         false),
    fnTest([1],        true),
    fnTest([NaN],      true),
    fnTest([Infinity], true),
    fnTest([null],     false),
    fnTest(['1'],      false),
    fnTest([[]],       false)
  ),

  runWith(fpx.isFinite,
    fnTest([],          false),
    fnTest([1],         true),
    fnTest([1.1],       true),
    fnTest([-1.1],      true),
    fnTest([NaN],       false),
    fnTest([Infinity],  false),
    fnTest([-Infinity], false),
    fnTest([null],      false),
    fnTest(['1'],       false),
    fnTest([[]],        false)
  ),

  runWith(fpx.isInteger,
    fnTest([],          false),
    fnTest([0],         true),
    fnTest([1],         true),
    fnTest([10],        true),
    fnTest([-1],        true),
    fnTest([-10],       true),
    fnTest([1.1],       false),
    fnTest([-1.1],      false),
    fnTest([NaN],       false),
    fnTest([Infinity],  false),
    fnTest([-Infinity], false),
    fnTest([null],      false),
    fnTest(['1'],       false),
    fnTest([[]],        false)
  ),

  runWith(fpx.isNatural,
    fnTest([],          false),
    fnTest([0],         true),
    fnTest([1],         true),
    fnTest([10],        true),
    fnTest([-1],        false),
    fnTest([-10],       false),
    fnTest([1.1],       false),
    fnTest([-1.1],      false),
    fnTest([NaN],       false),
    fnTest([Infinity],  false),
    fnTest([-Infinity], false),
    fnTest([null],      false),
    fnTest(['1'],       false),
    fnTest([[]],        false)
  ),

  runWith(fpx.isNaN,
    fnTest([],          false),
    fnTest([NaN],       true),
    fnTest([Infinity],  false),
    fnTest([undefined], false)
  ),

  runWith(fpx.isString,
    fnTest([],   false),
    fnTest([''], true)
  ),

  runWith(fpx.isBoolean,
    fnTest([],        false),
    fnTest([true],    true),
    fnTest([false],   true),
    fnTest([null],    false),
    fnTest([Boolean], false)
  ),

  runWith(fpx.isSymbol,
    fnTest([],               false),
    fnTest([Symbol('blah')], true),
    fnTest(['Symbol(blah)'], false)
  ),

  runWith(fpx.isPrimitive,
    fnTest([],         true),
    fnTest([null],     true),
    fnTest([1],        true),
    fnTest([''],       true),
    fnTest([Symbol()], true),
    fnTest([true],     true),
    fnTest([{}],       false),
    fnTest([[]],       false),
    fnTest([id],       false),
    fnTest([/!/],      false)
  ),

  runWith(fpx.isComplex,
    fnTest([],         false),
    fnTest([null],     false),
    fnTest([1],        false),
    fnTest([''],       false),
    fnTest([Symbol()], false),
    fnTest([true],     false),
    fnTest([{}],       true),
    fnTest([[]],       true),
    fnTest([id],       true),
    fnTest([/!/],      true)
  ),

  runWith(fpx.isInstance,
    fnTest([null, Object],   false),
    fnTest([[],   Object],   true),
    fnTest([Object, Object], true)
  ),

  runWith(fpx.isFunction,
    fnTest([],                  false),
    fnTest([id],                true),
    fnTest([create(id)], false)
  ),

  runWith(fpx.isObject,
    fnTest([],             false),
    fnTest([null],         false),
    fnTest([id],           false),
    fnTest([{}],           true),
    fnTest([[]],           true),
    fnTest([/!/],          true),
    fnTest([create(null)], true),
    fnTest([create({})],   true)
  ),

  runWith(fpx.isDict,
    fnTest([],             false),
    fnTest([null],         false),
    fnTest([id],           false),
    fnTest([{}],           true),
    fnTest([[]],           false),
    fnTest([/!/],          false),
    fnTest([create(null)], true),
    fnTest([create({})],   false)
  ),

  runWith(fpx.isArray,
    fnTest([],           false),
    fnTest([[]],         true),
    fnTest([create([])], true),
    fnTest([args(1, 2)], false)
  ),

  runWith(fpx.isList,
    fnTest([],              false),
    fnTest([[]],            true),
    fnTest([create([])],    true),
    fnTest([args(1, 2)],    true),
    fnTest([{length: NaN}], false)
  ),

  runWith(fpx.isRegExp,
    fnTest([],            false),
    fnTest([/!/],         true),
    fnTest([create(/!/)], true),
    fnTest([{}],          false)
  ),

  runWith(fpx.isPromise,
    fnTest([],                          false),
    fnTest([{}],                        false),
    fnTest([{then () {}}],              false),
    fnTest([Promise.resolve()],         true),
    fnTest([{then () {}, catch () {}}], true)
  ),

  runWith(fpx.isDate,
    fnTest([], false),
    fnTest([new Date()], true),
    fnTest([Date.now()], false),
    fnTest([new Date().toString()], false)
  ),

  runWith(fpx.isValidDate,
    fnTest([], false),
    fnTest([new Date()], true),
    fnTest([new Date(NaN)], false)
  ),

  runWith(fpx.isInvalidDate,
    fnTest([], false),
    fnTest([new Date()], false),
    fnTest([new Date(NaN)], true)
  ),

  runWith(fpx.isNil,
    fnTest([],      true),
    fnTest([null],  true),
    fnTest([false], false)
  ),

  runWith(fpx.testBy,
    fnTest([id, 1], 1),

    fnTest([],     true),
    fnTest([null], false),

    fnTest(['one', 'one'], true),
    fnTest(['one', 'two'], false),

    fnTest([/one/, 'one'], true),
    fnTest([/one/, 'two'], false),

    fnTest([NaN, NaN], true),
    fnTest([NaN],      false),

    fnTest([[], []],      true),
    fnTest([[], [1]],     true),
    fnTest([[], args(1)], true),
    fnTest([[], {}],      false),

    fnTest([[1], []],      false),
    fnTest([[1], [1]],     true),
    fnTest([[1], args(1)], true),
    fnTest([[1], {0: 1}],  false),

    fnTest([{}, {}],        true),
    fnTest([{}, [1]],       true),
    fnTest([{}, undefined], false),

    fnTest([{nan: Number.isNaN}, {nan: NaN, one: 1}], true),
    fnTest([{nan: Number.isNaN}, {nan: 1}],           false),

    fnTest([{length: 1}, id], true)
  ),

  // This array of tests is now redundant, should probably remove.
  runWith(fpx.test,
    fnTest([id], fnTest([1], 1)),

    fnTest([], tests(
      fnTest([],     true),
      fnTest([null], false)
    )),

    fnTest(['one'], tests(
      fnTest(['one'], true),
      fnTest(['two'], false)
    )),

    fnTest([/one/], tests(
      fnTest(['one'], true),
      fnTest(['two'], false)
    )),

    fnTest([NaN], tests(
      fnTest([NaN], true),
      fnTest([],    false)
    )),

    fnTest([[]], tests(
      fnTest([[]],      true),
      fnTest([[1]],     true),
      fnTest([args(1)], true),
      fnTest([{}],      false)
    )),

    fnTest([[1]], tests(
      fnTest([[]],      false),
      fnTest([[1]],     true),
      fnTest([args(1)], true),
      fnTest([{0: 1}],  false)
    )),

    fnTest([{}], tests(
      fnTest([{}],  true),
      fnTest([[1]], true),
      fnTest([],    false)
    )),

    fnTest([{nan: Number.isNaN}], tests(
      fnTest([{nan: NaN, one: 1}], true),
      fnTest([{nan: 1}],           false)
    )),

    fnTest([{length: 1}], tests(
      fnTest([id], true)
    )),

    // Must not accidentally use second argument.

    fnTest([id, 1], tests(
      fnTest([],  undefined),
      fnTest([1], 1)
    )),

    fnTest([1, 1], tests(
      fnTest([],  false),
      fnTest([1], true)
    )),

    fnTest([/one/, 'one'], tests(
      fnTest([],      false),
      fnTest(['one'], true)
    ))
  ),
]
