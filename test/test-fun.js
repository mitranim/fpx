'use strict'

const {runWith, fnTest, tests} = require('./utils')
const fpx = require('../lib/fpx')

function self ()    {return this}
function args ()    {return arguments}
function add (a, b) {return a + b}
function sub (a, b) {return a - b}
function double (a) {return a * 2}
function id (a)     {return a}
function pos (a)    {return a > 0}
function neg (a)    {return a < 0}
function no ()      {return false}

module.exports = [
  runWith(fpx.call,
    fnTest([self],      undefined),
    fnTest([add, 1, 2], add(1, 2))
  ),

  runWith(fpx.apply,
    fnTest([self],        undefined),
    fnTest([add, [1, 2]], add(1, 2))
  ),

  runWith(fpx.bind,
    fnTest([self],      fnTest([],  self())),
    fnTest([add, 1],    fnTest([2], add(1, 2))),
    fnTest([add, 1, 2], fnTest([],  add(1, 2)))
  ),

  runWith(fpx.id,
    fnTest([sub], fnTest([2, 1], sub(2, 1)))
  ),

  runWith(fpx.flip,
    fnTest([sub], fnTest([2, 1], sub(1, 2)))
  ),

  runWith(fpx.and,
    fnTest([], fnTest([1], 1)),

    fnTest([add, double], tests(
      // both
      fnTest([2, 3],  add(2, 3) && double(2, 3)),
      // not add
      fnTest([-1, 1], add(-1, 1) && double(-1, 1)),
      // not double
      fnTest([0, 1],  add(0, 1) && double(0, 1))
    ))
  ),

  runWith(fpx.or,
    fnTest([], fnTest([1], 1)),

    fnTest([add, double], tests(
      // neither
      fnTest([0, 0],  add(0, 0) || double(0, 0)),
      // add
      fnTest([0, 1],  add(0, 1) || double(0, 1)),
      // double
      fnTest([-1, 1], add(-1, 1) || double(-1, 1))
    ))
  ),

  runWith(fpx.id,
    fnTest([add], tests(
      fnTest([0, 1],  1),
      fnTest([-1, 1], 0)
    ))
  ),

  runWith(fpx.not,
    fnTest([add], tests(
      fnTest([0, 1],  false),
      fnTest([-1, 1], true)
    ))
  ),

  runWith(fpx.ifelse,
    fnTest([id, double, add], tests(
      fnTest([2, 3], double(2)),
      fnTest([0, 1], add(0, 1))
    ))
  ),

  runWith(fpx.ifthen,
    fnTest([id, double], tests(
      fnTest([2, 3], double(2)),
      fnTest([0, 1], undefined)
    ))
  ),

  runWith(fpx.ifonly,
    fnTest([id, add], tests(
      fnTest([0, 1], 0),
      fnTest([1, 0], add(1, 0))
    ))
  ),

  runWith(fpx.cond,
    fnTest([], fnTest([1], undefined)),

    fnTest([add], fnTest([1, 2], add(1, 2))),

    fnTest([id, add], tests(
      fnTest([],     undefined),
      fnTest([1, 2], add(1, 2))
    )),

    fnTest([id, add, sub], tests(
      fnTest([0, 1], sub(0, 1)),
      fnTest([1, 2], add(1, 2))
    )),

    fnTest([pos, add, neg, sub], tests(
      fnTest([],      undefined),
      fnTest([1, 2],  add(1, 2)),
      fnTest([-1, 1], sub(-1, 1)),
      fnTest([0],     undefined)
    )),

    fnTest([pos, add, neg, sub, args], tests(
      fnTest([],      args()),
      fnTest([1, 2],  add(1, 2)),
      fnTest([-1, 1], sub(-1, 1)),
      fnTest([0, 1],  args(0, 1))
    ))
  ),

  runWith(fpx.pipe,
    fnTest([], tests(
      fnTest([],  undefined),
      fnTest([1], 1)
    )),
    fnTest([add],         fnTest([1, 2], add(1, 2))),
    fnTest([add, double], fnTest([1, 2], double(add(1, 2))))
  ),

  runWith(fpx.seq,
    fnTest([],            fnTest([1],    undefined)),
    fnTest([add],         fnTest([1, 2], add(1, 2))),
    fnTest([add, double], fnTest([2, 3], double(2)))
  ),

  runWith(fpx.pipeAnd,
    fnTest([], tests(
      fnTest([],  undefined),
      fnTest([1], 1)
    )),

    fnTest([add],         fnTest([1, 2], add(1, 2))),

    fnTest([add, double], fnTest([1, 2], double(add(1, 2)))),

    fnTest([add, no, double], tests(
      fnTest([],     add(undefined, undefined)),
      fnTest([1, 2], no())
    ))
  ),

  runWith(fpx.juxt,
    fnTest([], fnTest([], [])),

    fnTest([add, sub], tests(
      fnTest([],     [NaN, NaN]),
      fnTest([1, 2], [3, -1])
    ))
  ),

  runWith(fpx.defer,
    fnTest([add], tests(
      fnTest([],     fnTest([1, 2], add(1, 2))),
      fnTest([1],    fnTest([2],    add(1, 2))),
      fnTest([1, 2], fnTest([],     add(1, 2)))
    )),
    fnTest([add, 1], tests(
      fnTest([],  fnTest([2], add(1, 2))),
      fnTest([2], fnTest([],  add(1, 2)))
    ))
  ),

  runWith(fpx.rest,
    fnTest([id], fnTest([1, 2, 3], id([1, 2, 3])))
  ),

  runWith(fpx.spread,
    fnTest([add], fnTest([[1, 2]], add(1, 2)))
  )
]
