'use strict'

const {eq, throws} = require('./utils')
const f = require('../dist/fpx')

function add(a, b) {return a + b}

eq(f.call(add), add())
eq(f.call(add, 1, 2), add(1, 2))

eq(f.apply(add, []), add())
eq(f.apply(add, [1, 2]), add(1, 2))

eq(f.bind(add)(1, 2), add(1, 2))
eq(f.bind(add, 1)(2), add(1, 2))
eq(f.bind(add, 1, 2)(), add(1, 2))
throws(f.bind)

eq(f.not(add)(0, 1), !add(0, 1))
eq(f.not(add)(0, 1), false)
eq(f.not(add)(-1, 1), !add(-1, 1))
eq(f.not(add)(-1, 1), true)
throws(f.not)
