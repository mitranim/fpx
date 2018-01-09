'use strict'

const {eq} = require('./utils')
const fpx = require('../dist/fpx')

eq(fpx.keys(),     [])
eq(fpx.keys(null), [])

eq(fpx.keys(),                 [])
eq(fpx.keys(null),             [])
eq(fpx.keys(10),               [])
eq(fpx.keys('blah'),           [])
eq(fpx.keys(fpx.keys),         [])
eq(fpx.keys([10, 20]),         ['0', '1'])
eq(fpx.keys({one: 1, two: 2}), ['one', 'two'])

eq(fpx.values(),                 [])
eq(fpx.values(null),             [])
eq(fpx.values(10),               [])
eq(fpx.values('blah'),           [])
eq(fpx.values(fpx.values),       [])
eq(fpx.values([10, 20]),         [10, 20])
eq(fpx.values({one: 1, two: 2}), [1, 2])

eq(fpx.size(),                 0)
eq(fpx.size(null),             0)
eq(fpx.size(10),               0)
eq(fpx.size('blah'),           0)
eq(fpx.size([10, 20]),         2)
eq(fpx.size({one: 1, two: 2}), 2)
