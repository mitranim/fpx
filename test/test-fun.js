'use strict'

const {eq} = require('./utils')
const f = require('../dist/fpx')

function args    ()        {return arguments}
function arglist (...args) {return args}
function add     (a, b)    {return a + b}
function sub     (a, b)    {return a - b}
function double  (a)       {return a * 2}
function id      (a)       {return a}
function pos     (a)       {return a > 0}
function neg     (a)       {return a < 0}
function no      ()        {return false}

eq(f.call(add), add())
eq(f.call(add, 1, 2), add(1, 2))

eq(f.apply(add, []), add())
eq(f.apply(add, [1, 2]), add(1, 2))

eq(f.bind(add)(1, 2), add(1, 2))
eq(f.bind(add, 1)(2), add(1, 2))
eq(f.bind(add, 1, 2)(), add(1, 2))

// eq(f.applyBind(add, [])(1, 2),   add(1, 2))
// eq(f.applyBind(add, [1])(2),   add(1, 2))
// eq(f.applyBind(add, [1, 2])(), add(1, 2))

// eq(f.curry1 (add)    ()     (1, 2), add(1, 2))
// eq(f.curry1 (add)    (1)    (2),    add(1, 2))
// eq(f.curry1 (add)    (1, 2) (),     add(1, 2))
// eq(f.curry1 (add, 1) ()     (2),    add(1, 2))
// eq(f.curry1 (add, 1) (2)    (),     add(1, 2))

// eq(f.flip(sub)(2, 1), sub(1, 2))

eq(f.and()(1), 1)
// Must always call first fun
eq(f.and(Boolean)(null), false)
// both
eq(f.and(add, double)(2, 3), add(2, 3) && double(2, 3))
// not add
eq(f.and(add, double)(-1, 1), add(-1, 1) && double(-1, 1))
// not double
eq(f.and(add, double)(0, 1), add(0, 1) && double(0, 1))

eq(f.or()(1), 1)
// Must always call first fun
eq(f.or(double)(1), 2)
// neither
eq(f.or(add, double)(0, 0), add(0, 0) || double(0, 0))
// add
eq(f.or(add, double)(0, 1), add(0, 1) || double(0, 1))
// double
eq(f.or(add, double)(-1, 1), add(-1, 1) || double(-1, 1))

eq(f.not(add)(0, 1), false)
eq(f.not(add)(-1, 1), true)

eq(f.ifelse(id, double, add)(2, 3), double(2))
eq(f.ifelse(id, double, add)(0, 1), add(0, 1))

eq(f.ifthen(id, double)(2, 3), double(2))
eq(f.ifthen(id, double)(0, 1), undefined)

eq(f.ifonly(id, add)(0, 1), 0)
eq(f.ifonly(id, add)(1, 0), add(1, 0))

eq(f.ifexists(double)(2, 3), double(2))
eq(f.ifexists(double)(0, 1), undefined)

eq(f.cond()(1),                             undefined)
eq(f.cond(add)(1, 2),                       add(1, 2))
eq(f.cond(id, add)(),                       undefined)
eq(f.cond(id, add)(1, 2),                   add(1, 2))
eq(f.cond(id, add, sub)(0, 1),              sub(0, 1))
eq(f.cond(id, add, sub)(1, 2),              add(1, 2))
eq(f.cond(pos, add, neg, sub)(),            undefined)
eq(f.cond(pos, add, neg, sub)(1, 2),        add(1, 2))
eq(f.cond(pos, add, neg, sub)(-1, 1),       sub(-1, 1))
eq(f.cond(pos, add, neg, sub)(0),           undefined)
eq(f.cond(pos, add, neg, sub, args)(),      args())
eq(f.cond(pos, add, neg, sub, args)(1, 2),  add(1, 2))
eq(f.cond(pos, add, neg, sub, args)(-1, 1), sub(-1, 1))
eq(f.cond(pos, add, neg, sub, args)(0, 1),  args(0, 1))

eq(f.pipe()(), undefined)
eq(f.pipe()(1), 1)
eq(f.pipe(add)(1, 2), add(1, 2))
eq(f.pipe(add, double)(1, 2), double(add(1, 2)))

eq(f.seq()(), undefined)
eq(f.seq()(1), 1)
eq(f.seq(add)(1, 2), add(1, 2))
eq(f.seq(add, double)(2, 3), double(2))

eq(f.pipeAnd()(), undefined)
eq(f.pipeAnd()(1), 1)
eq(f.pipeAnd(add)(1, 2), add(1, 2))
eq(f.pipeAnd(add, double)(1, 2), double(add(1, 2)))
eq(f.pipeAnd(add, no, double)(), add(undefined, undefined))
eq(f.pipeAnd(add, no, double)(1, 2), no())

eq(f.juxt()(), [])
eq(f.juxt(add, sub)(), [NaN, NaN])
eq(f.juxt(add, sub)(1, 2), [3, -1])

eq(f.rest(id)(1, 2, 3), [1, 2, 3])

eq(f.spread(add)([1, 2]), add(1, 2))

eq(f.alter(arglist)(),           [undefined])
eq(f.alter(arglist)(20),         [20])
eq(f.alter(arglist, 10, 20)(),   [undefined, 10, 20])
eq(f.alter(arglist, 10, 20)(30), [30, 10, 20])
