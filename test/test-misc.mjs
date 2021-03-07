import {eq, is, throws} from './utils.mjs'
import * as f from '../fpx.mjs'

function dupe (a) {return a + a}
function args ()  {return arguments}

is(f.global, global)

eq(f.id(),           undefined)
eq(f.id(10),         10)
eq(f.id(10, 20),     10)

eq(f.di(),           undefined)
eq(f.di(10, 20),     20)
eq(f.di(10, 20, 30), 20)

eq(f.val()(2),       undefined)
eq(f.val(1)(2),      1)

{
  const target = {}
  is(f.assign(target, undefined, {one: 10}, null, {two: 20}), undefined)
  eq(target, {one: 10, two: 20})
}
throws(f.assign)
throws(f.assign, 'not object')

/** maskBy **/


// Function: call with operand
eq(f.maskBy(10,    dupe),               20)
eq(f.maskBy('one', dupe),               'oneone')

// Primitive: replace
eq(f.maskBy(),                          undefined)
eq(f.maskBy(undefined, null),           null)
eq(f.maskBy(10,        NaN),            NaN)
eq(f.maskBy({},        'one'),          'one')

// Regexp: only nil or string, use `String.prototype.match`
eq(f.maskBy('one',             /./),    ['o'])
eq(f.maskBy('one',             /./g),   ['o', 'n', 'e'])
eq(f.maskBy(undefined,         /./),    null)
throws(f.maskBy, new String('not string'), /./) // eslint-disable-line no-new-wrappers

// List: only nil or list, apply masks recursively, drop remainder
eq(f.maskBy(undefined,       []),           [])
eq(f.maskBy([10, 'one'],     [dupe, dupe]), [20, 'oneone'])
eq(f.maskBy(args(10, 'one'), [dupe, dupe]), [20, 'oneone'])
eq(f.maskBy([10],            [dupe, 30]),   [20, 30])
eq(f.maskBy([10, 30],        [dupe]),       [20])
throws(f.maskBy, f.maskBy, [])
throws(f.maskBy, {}, [])
throws(f.maskBy, 'not list', [])

// Struct: only nil or non-list object, apply masks recursively, drop other properties
eq(f.maskBy(undefined,             {}),                     {})
eq(f.maskBy({one: 10, two: 'one'}, {one: dupe, two: dupe}), {one: 20, two: 'oneone'})
eq(f.maskBy({one: 10},             {one: dupe, two: 30}),   {one: 20, two: 30})
eq(f.maskBy({one: 10, two: 'one'}, {one: dupe}),            {one: 20})
throws(f.maskBy, f.maskBy, {})
throws(f.maskBy, [], {})
throws(f.maskBy, 'not dict', {})
