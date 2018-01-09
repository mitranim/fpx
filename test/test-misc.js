'use strict'

const {eq} = require('./utils')
const fpx = require('../dist/fpx')

function double (a) {return a * 2}
function args   ()  {return arguments}

eq(fpx.id(),       undefined)
eq(fpx.id(10),     10)
eq(fpx.id(10, 20), 10)

eq(fpx.di(),           undefined)
eq(fpx.di(10, 20),     20)
eq(fpx.di(10, 20, 30), 20)

eq(fpx.val()(2),  undefined)
eq(fpx.val(1)(2), 1)

eq(fpx.maskBy(1, undefined),           undefined)
eq(fpx.maskBy(undefined, 1),           1)
eq(fpx.maskBy({}, 1),                  1)
eq(fpx.maskBy(1, double),              2)
eq(fpx.maskBy({}, double),             NaN)

eq(fpx.maskBy(undefined, [/text/, 1]),       [false, 1])
eq(fpx.maskBy(['text', 2], [/text/, 1]),     [true, 1])
eq(fpx.maskBy(args('text', 2), [/text/, 1]), [true, 1])

eq(fpx.maskBy(undefined, {text: /text/, one: 1}),              {text: false, one: 1})
eq(fpx.maskBy({text: 'text', one: 2}, {text: /text/, one: 1}), {text: true,  one: 1})
