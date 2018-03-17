'use strict'

const {eq} = require('./utils')
const f = require('../dist/fpx')

eq(f.add(),       undefined + undefined)
eq(f.add('7', 3), '7' + 3)
eq(f.add(7, 3),   7 + 3)

eq(f.sub(),       undefined - undefined)
eq(f.sub('7', 3), '7' - 3)
eq(f.sub(7, 3),   7 - 3)

eq(f.mul(),       undefined * undefined)
eq(f.mul('7', 3), '7' * 3)
eq(f.mul(7, 3),   7 * 3)

eq(f.div(),       undefined / undefined)
eq(f.div('7', 3), '7' / 3)
eq(f.div(7, 3),   7 / 3)

eq(f.inc(),      undefined + 1)
eq(f.inc('one'), 'one' + 1)
eq(f.inc(NaN),   NaN + 1)
eq(f.inc(-2),    -2 + 1)
eq(f.inc(1),     1 + 1)

eq(f.dec(),      undefined - 1)
eq(f.dec('one'), 'one' - 1)
eq(f.dec(NaN),   NaN - 1)
eq(f.dec(-2),    -2 - 1)
eq(f.dec(2),     2 - 1)
