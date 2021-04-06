import {eq, is, throws} from './utils.mjs'
import * as f from '../fpx.mjs'

function args ()     {return arguments}
function join (a, b) {return a.concat([b])}

is(f.global, global)

eq(f.id(),           undefined)
eq(f.id(10),         10)
eq(f.id(10, 20),     10)

eq(f.di(),           undefined)
eq(f.di(10, 20),     20)
eq(f.di(10, 20, 30), 20)

eq(f.val()(2),       undefined)
eq(f.val(1)(2),      1)

eq(f.get(undefined, 'one'), undefined)
eq(f.get([], 'length'),     0)
eq(f.get([10], 0),          10)
eq(f.get(join, 'length'),   join.length)
eq(f.get({one: 10}, 'one'), 10)
throws(f.get)

eq(f.scan(undefined, 'one'),               undefined)
eq(f.scan(10),                             10)
eq(f.scan({one: 10}, 'one'),               10)
eq(f.scan({one: {two: 20}}, 'one', 'two'), 20)
throws(f.scan, {}, undefined)

eq(f.getIn(undefined, []),                        undefined)
eq(f.getIn(undefined, ['one']),                   undefined)
eq(f.getIn({one: 10}, undefined),                 {one: 10})
eq(f.getIn({one: 10}, []),                        {one: 10})
eq(f.getIn({one: 10}, ['one']),                   10)
eq(f.getIn({one: {two: 20}}, ['one', 'two']),     20)
eq(f.getIn({one: {two: 20}}, args('one', 'two')), 20)
throws(f.getIn, {}, [undefined])

eq(f.getter('one')({one: 10}), 10)
eq(f.getter('one')(),          undefined)
eq(f.getter(1)(),              undefined)
eq(f.getter(1)([10, 20]),      20)

{
  const tar = {}
  is(f.assign(tar, undefined, {one: 10}, null, {two: 20}), tar)
  eq(tar, {one: 10, two: 20})
}
// Difference from `Object.assign`: include non-own enumerable properties.
{
  const tar = {}
  is(f.assign(tar, undefined, Object.create({one: 10}), null, {two: 20}), tar)
  eq(tar, {one: 10, two: 20})
}
throws(f.assign)
throws(f.assign, 'not object')
