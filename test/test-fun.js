'use strict'

const {test} = require('./utils')
const fpx = require('../lib/fpx')

function self ()    {return this}
function args ()    {return arguments}
function add (a, b) {return a + b}
function sub (a, b) {return a - b}
function double (a) {return a * 2}
function id (a)     {return a}
function pos (a)    {return a > 0}
function neg (a)    {return a < 0}

call: {
  test(fpx.call,
    {in: [self],      out: undefined},
    {in: [add, 1, 2], out: add(1, 2)}
  )
}

apply: {
  test(fpx.apply,
    {in: [self],        out: undefined},
    {in: [add, [1, 2]], out: add(1, 2)}
  )
}

bind: {
  test(fpx.bind,
    {in: [self],      test: [{in: [],  out: self()}]},
    {in: [add, 1],    test: [{in: [2], out: add(1, 2)}]},
    {in: [add, 1, 2], test: [{in: [],  out: add(1, 2)}]}
  )
}

flip: {
  test(id,
    {in: [sub], test: [{in: [2, 1], out: sub(2, 1)}]}
  )

  test(fpx.flip,
    {in: [sub], test: [{in: [2, 1], out: sub(1, 2)}]}
  )
}

pipe: {
  test(fpx.pipe,
    {in: [], test: [
      {in: [],  out: undefined},
      {in: [1], out: 1}
    ]},
    {in: [add],         test: [{in: [1, 2], out: add(1, 2)}]},
    {in: [add, double], test: [{in: [1, 2], out: double(add(1, 2))}]}
  )
}

seq: {
  test(fpx.seq,
    {in: [],            test: [{in: [1],    out: undefined}]},
    {in: [add],         test: [{in: [1, 2], out: add(1, 2)}]},
    {in: [add, double], test: [{in: [2, 3], out: double(2)}]}
  )
}

and: {
  test(fpx.and,
    {in: [], test: [{in: [1], out: 1}]},

    {in: [add, double], test: [
      // both
      {in: [2, 3],  out: add(2, 3) && double(2, 3)},
      // not add
      {in: [-1, 1], out: add(-1, 1) && double(-1, 1)},
      // not double
      {in: [0, 1],  out: add(0, 1) && double(0, 1)}
    ]}
  )
}

or: {
  test(fpx.or,
    {in: [], test: [{in: [1], out: 1}]},

    {in: [add, double], test: [
      // neither
      {in: [0, 0],  out: add(0, 0) || double(0, 0)},
      // add
      {in: [0, 1],  out: add(0, 1) || double(0, 1)},
      // double
      {in: [-1, 1], out: add(-1, 1) || double(-1, 1)}
    ]}
  )
}

not: {
  test(id,
    {in: [add], test: [
      {in: [0, 1],  out: 1},
      {in: [-1, 1], out: 0}
    ]}
  )

  test(fpx.not,
    {in: [add], test: [
      {in: [0, 1],  out: false},
      {in: [-1, 1], out: true}
    ]}
  )
}

ifelse: {
  test(fpx.ifelse,
    {in: [id, double, add], test: [
      {in: [2, 3], out: double(2)},
      {in: [0, 1], out: add(0, 1)}
    ]}
  )
}

ifthen: {
  test(fpx.ifthen,
    {in: [id, double], test: [
      {in: [2, 3], out: double(2)},
      {in: [0, 1], out: undefined}
    ]}
  )
}

ifonly: {
  test(fpx.ifonly,
    {in: [id, add], test: [
      {in: [0, 1], out: 0},
      {in: [1, 0], out: add(1, 0)}
    ]}
  )
}

cond: {
  test(fpx.cond,
    {in: [], test: [{in: [1], out: undefined}]},

    {in: [add], test: [{in: [1, 2], out: add(1, 2)}]},

    {in: [id, add], test: [
      {in: [],     out: undefined},
      {in: [1, 2], out: add(1, 2)}
    ]},

    {in: [id, add, sub], test: [
      {in: [0, 1], out: sub(0, 1)},
      {in: [1, 2], out: add(1, 2)}
    ]},

    {in: [pos, add, neg, sub], test: [
      {in: [],      out: undefined},
      {in: [1, 2],  out: add(1, 2)},
      {in: [-1, 1], out: sub(-1, 1)},
      {in: [0],     out: undefined}
    ]},

    {in: [pos, add, neg, sub, args], test: [
      {in: [],      out: args()},
      {in: [1, 2],  out: add(1, 2)},
      {in: [-1, 1], out: sub(-1, 1)},
      {in: [0, 1],  out: args(0, 1)}
    ]}
  )
}

defer: {
  test(fpx.defer,
    {in: [add], test: [
      {in: [],     test: [{in: [1, 2], out: add(1, 2)}]},
      {in: [1],    test: [{in: [2],    out: add(1, 2)}]},
      {in: [1, 2], test: [{in: [],     out: add(1, 2)}]}
    ]},
    {in: [add, 1], test: [
      {in: [],  test: [{in: [2], out: add(1, 2)}]},
      {in: [2], test: [{in: [],  out: add(1, 2)}]}
    ]}
  )
}

rest: {
  test(fpx.rest,
    {in: [id], test: [{in: [1, 2, 3], out: id([1, 2, 3])}]}
  )
}

spread: {
  test(fpx.spread,
    {in: [add], test: [{in: [[1, 2]], out: add(1, 2)}]}
  )
}
