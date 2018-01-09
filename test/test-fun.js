'use strict'

const {eq} = require('./utils')
const fpx = require('../dist/fpx')

function args    ()        {return arguments}
function arglist (...args) {return args}
function add     (a, b)    {return a + b}
function sub     (a, b)    {return a - b}
function double  (a)       {return a * 2}
function id      (a)       {return a}
function pos     (a)       {return a > 0}
function neg     (a)       {return a < 0}
function no      ()        {return false}

eq(fpx.call(add), add())
eq(fpx.call(add, 1, 2), add(1, 2))

eq(fpx.apply(add, []), add())
eq(fpx.apply(add, [1, 2]), add(1, 2))

eq(fpx.bind(add)(1, 2), add(1, 2))
eq(fpx.bind(add, 1)(2), add(1, 2))
eq(fpx.bind(add, 1, 2)(), add(1, 2))

// eq(fpx.applyBind(add, [])(1, 2),   add(1, 2))
// eq(fpx.applyBind(add, [1])(2),   add(1, 2))
// eq(fpx.applyBind(add, [1, 2])(), add(1, 2))

// eq(fpx.curry1 (add)    ()     (1, 2), add(1, 2))
// eq(fpx.curry1 (add)    (1)    (2),    add(1, 2))
// eq(fpx.curry1 (add)    (1, 2) (),     add(1, 2))
// eq(fpx.curry1 (add, 1) ()     (2),    add(1, 2))
// eq(fpx.curry1 (add, 1) (2)    (),     add(1, 2))

// eq(fpx.flip(sub)(2, 1), sub(1, 2))

eq(fpx.and()(1), 1)
// Must always call first fun
eq(fpx.and(Boolean)(null), false)
// both
eq(fpx.and(add, double)(2, 3), add(2, 3) && double(2, 3))
// not add
eq(fpx.and(add, double)(-1, 1), add(-1, 1) && double(-1, 1))
// not double
eq(fpx.and(add, double)(0, 1), add(0, 1) && double(0, 1))

eq(fpx.or()(1), 1)
// Must always call first fun
eq(fpx.or(double)(1), 2)
// neither
eq(fpx.or(add, double)(0, 0), add(0, 0) || double(0, 0))
// add
eq(fpx.or(add, double)(0, 1), add(0, 1) || double(0, 1))
// double
eq(fpx.or(add, double)(-1, 1), add(-1, 1) || double(-1, 1))

eq(fpx.not(add)(0, 1), false)
eq(fpx.not(add)(-1, 1), true)

eq(fpx.ifelse(id, double, add)(2, 3), double(2))
eq(fpx.ifelse(id, double, add)(0, 1), add(0, 1))

eq(fpx.ifthen(id, double)(2, 3), double(2))
eq(fpx.ifthen(id, double)(0, 1), undefined)

eq(fpx.ifonly(id, add)(0, 1), 0)
eq(fpx.ifonly(id, add)(1, 0), add(1, 0))

eq(fpx.ifexists(double)(2, 3), double(2))
eq(fpx.ifexists(double)(0, 1), undefined)

eq(fpx.cond()(1),                             undefined)
eq(fpx.cond(add)(1, 2),                       add(1, 2))
eq(fpx.cond(id, add)(),                       undefined)
eq(fpx.cond(id, add)(1, 2),                   add(1, 2))
eq(fpx.cond(id, add, sub)(0, 1),              sub(0, 1))
eq(fpx.cond(id, add, sub)(1, 2),              add(1, 2))
eq(fpx.cond(pos, add, neg, sub)(),            undefined)
eq(fpx.cond(pos, add, neg, sub)(1, 2),        add(1, 2))
eq(fpx.cond(pos, add, neg, sub)(-1, 1),       sub(-1, 1))
eq(fpx.cond(pos, add, neg, sub)(0),           undefined)
eq(fpx.cond(pos, add, neg, sub, args)(),      args())
eq(fpx.cond(pos, add, neg, sub, args)(1, 2),  add(1, 2))
eq(fpx.cond(pos, add, neg, sub, args)(-1, 1), sub(-1, 1))
eq(fpx.cond(pos, add, neg, sub, args)(0, 1),  args(0, 1))

eq(fpx.pipe()(), undefined)
eq(fpx.pipe()(1), 1)
eq(fpx.pipe(add)(1, 2), add(1, 2))
eq(fpx.pipe(add, double)(1, 2), double(add(1, 2)))

eq(fpx.seq()(), undefined)
eq(fpx.seq()(1), 1)
eq(fpx.seq(add)(1, 2), add(1, 2))
eq(fpx.seq(add, double)(2, 3), double(2))

eq(fpx.pipeAnd()(), undefined)
eq(fpx.pipeAnd()(1), 1)
eq(fpx.pipeAnd(add)(1, 2), add(1, 2))
eq(fpx.pipeAnd(add, double)(1, 2), double(add(1, 2)))
eq(fpx.pipeAnd(add, no, double)(), add(undefined, undefined))
eq(fpx.pipeAnd(add, no, double)(1, 2), no())

eq(fpx.juxt()(), [])
eq(fpx.juxt(add, sub)(), [NaN, NaN])
eq(fpx.juxt(add, sub)(1, 2), [3, -1])

eq(fpx.rest(id)(1, 2, 3), [1, 2, 3])

eq(fpx.spread(add)([1, 2]), add(1, 2))

eq(fpx.alter(arglist)(),           [undefined])
eq(fpx.alter(arglist)(20),         [20])
eq(fpx.alter(arglist, 10, 20)(),   [undefined, 10, 20])
eq(fpx.alter(arglist, 10, 20)(30), [30, 10, 20])
