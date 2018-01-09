'use strict'

const {eq} = require('./utils')
const fpx = require('../dist/fpx')

eq(fpx.add(),       undefined + undefined)
eq(fpx.add('7', 3), '7' + 3)
eq(fpx.add(7, 3),   7 + 3)

eq(fpx.sub(),       undefined - undefined)
eq(fpx.sub('7', 3), '7' - 3)
eq(fpx.sub(7, 3),   7 - 3)

eq(fpx.mul(),       undefined * undefined)
eq(fpx.mul('7', 3), '7' * 3)
eq(fpx.mul(7, 3),   7 * 3)

eq(fpx.div(),       undefined / undefined)
eq(fpx.div('7', 3), '7' / 3)
eq(fpx.div(7, 3),   7 / 3)

eq(fpx.inc(),      undefined + 1)
eq(fpx.inc('one'), 'one' + 1)
eq(fpx.inc(NaN),   NaN + 1)
eq(fpx.inc(-2),    -2 + 1)
eq(fpx.inc(1),     1 + 1)

eq(fpx.dec(),      undefined - 1)
eq(fpx.dec('one'), 'one' - 1)
eq(fpx.dec(NaN),   NaN - 1)
eq(fpx.dec(-2),    -2 - 1)
eq(fpx.dec(2),     2 - 1)
