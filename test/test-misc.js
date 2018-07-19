'use strict'

const {eq, is, throws} = require('./utils')
const f = require('../dist/fpx')

function double (a) {return a * 2}
function args   ()  {return arguments}

is(f.global, global)

eq(f.id(),       undefined)
eq(f.id(10),     10)
eq(f.id(10, 20), 10)

eq(f.di(),           undefined)
eq(f.di(10, 20),     20)
eq(f.di(10, 20, 30), 20)

eq(f.val()(2),  undefined)
eq(f.val(1)(2), 1)

{
  const target = {}
  is(f.assign(target, undefined, {one: 10}, null, {two: 20}), undefined)
  eq(target, {one: 10, two: 20})
}
throws(f.assign)
throws(f.assign, 'not object')

eq(f.maskBy(1, undefined),           undefined)
eq(f.maskBy(undefined, 1),           1)
eq(f.maskBy({}, 1),                  1)
eq(f.maskBy(1, double),              2)
eq(f.maskBy({}, double),             NaN)

eq(f.maskBy(undefined, [/text/, 1]),       [false, 1])
eq(f.maskBy(['text', 2], [/text/, 1]),     [true, 1])
eq(f.maskBy(args('text', 2), [/text/, 1]), [true, 1])

eq(f.maskBy(undefined, {text: /text/, one: 1}),              {text: false, one: 1})
eq(f.maskBy({text: 'text', one: 2}, {text: /text/, one: 1}), {text: true,  one: 1})
