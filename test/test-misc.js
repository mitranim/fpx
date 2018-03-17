'use strict'

const {eq} = require('./utils')
const f = require('../dist/fpx')

function double (a) {return a * 2}
function args   ()  {return arguments}

eq(f.id(),       undefined)
eq(f.id(10),     10)
eq(f.id(10, 20), 10)

eq(f.di(),           undefined)
eq(f.di(10, 20),     20)
eq(f.di(10, 20, 30), 20)

eq(f.val()(2),  undefined)
eq(f.val(1)(2), 1)

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
