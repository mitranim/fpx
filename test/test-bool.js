'use strict'

/* global Symbol, Promise */

const {runWith, fnTest, tests} = require('./utils')
const fpx = require('../lib/fpx')

function id (a)  {return a}
function args () {return arguments}

const {create} = Object

module.exports = [
  runWith(fpx.is,
    fnTest([],             true),
    fnTest([NaN, NaN],     true),
    fnTest(['one', 'one'], true),
    fnTest(['one', 'two'], false),
    fnTest([[], []],       false)
  ),

  runWith(fpx.isNumber,
    fnTest([],         false),
    fnTest([1],        true),
    fnTest([NaN],      true),
    fnTest([Infinity], true),
    fnTest([null],     false),
    fnTest(['1'],      false)
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

  runWith(fpx.isPlainObject,
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

  runWith(fpx.isNil,
    fnTest([],      true),
    fnTest([null],  true),
    fnTest([false], false)
  ),

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

    fnTest([{nan: isNaN}], tests(
      fnTest([{}],                 true),
      fnTest([{nan: NaN, one: 1}], true),
      fnTest([{nan: 1}],           false)
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
  )
]
