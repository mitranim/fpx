'use strict'

const {eq} = require('./utils')
const f = require('../dist/fpx')

eq(f.size(),                 0)
eq(f.size(null),             0)
eq(f.size(10),               0)
eq(f.size('blah'),           0)
eq(f.size([10, 20]),         2)
eq(f.size({one: 1, two: 2}), 2)

eq(f.vacate(), undefined)
eq(f.vacate('one'), undefined)
eq(f.vacate(10), undefined)
eq(f.vacate([]), undefined)
eq(f.vacate({}), undefined)
eq(f.vacate([10]), [10])
eq(f.vacate({one: 10}), {one: 10})
