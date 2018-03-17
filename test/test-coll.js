'use strict'

const {eq} = require('./utils')
const f = require('../dist/fpx')

eq(f.keys(),     [])
eq(f.keys(null), [])

eq(f.keys(),                 [])
eq(f.keys(null),             [])
eq(f.keys(10),               [])
eq(f.keys('blah'),           [])
eq(f.keys(f.keys),           [])
eq(f.keys([10, 20]),         ['0', '1'])
eq(f.keys({one: 1, two: 2}), ['one', 'two'])

eq(f.values(),                 [])
eq(f.values(null),             [])
eq(f.values(10),               [])
eq(f.values('blah'),           [])
eq(f.values(f.values),         [])
eq(f.values([10, 20]),         [10, 20])
eq(f.values({one: 1, two: 2}), [1, 2])

eq(f.size(),                 0)
eq(f.size(null),             0)
eq(f.size(10),               0)
eq(f.size('blah'),           0)
eq(f.size([10, 20]),         2)
eq(f.size({one: 1, two: 2}), 2)
