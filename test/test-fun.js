'use strict'

const {runWith, fnTest, tests} = require('./utils')
const fpx = require('../lib/fpx')

function args    ()        {return arguments}
function arglist (...args) {return args}
function add     (a, b)    {return a + b}
function sub     (a, b)    {return a - b}
function double  (a)       {return a * 2}
function id      (a)       {return a}
function pos     (a)       {return a > 0}
function neg     (a)       {return a < 0}
function no      ()        {return false}
function inc     (a)       {return a + 1}

module.exports = [
  runWith(fpx.call,
    fnTest([add],       add()),
    fnTest([add, 1, 2], add(1, 2))
  ),

  runWith(fpx.apply,
    fnTest([add, []],     add()),
    fnTest([add, [1, 2]], add(1, 2))
  ),

  runWith(fpx.bind,
    fnTest([add],       fnTest([1, 2], add(1, 2))),
    fnTest([add, 1],    fnTest([2],    add(1, 2))),
    fnTest([add, 1, 2], fnTest([],     add(1, 2)))
  ),

  runWith(fpx.applyBind,
    fnTest([add, []],     fnTest([1, 2], add(1, 2))),
    fnTest([add, [1]],    fnTest([2],    add(1, 2))),
    fnTest([add, [1, 2]], fnTest([],     add(1, 2)))
  ),

  runWith(fpx.curry1,
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

  runWith(fpx.flip,
    fnTest([sub], fnTest([2, 1], sub(1, 2)))
  ),

  runWith(fpx.and,
    fnTest([], fnTest([1], 1)),

    // Must always call first fun
    fnTest([Boolean], fnTest([null], false)),

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

    // Must always call first fun
    fnTest([double], fnTest([1], 2)),

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

  runWith(fpx.ifexists,
    fnTest([double], tests(
      fnTest([2, 3], double(2)),
      fnTest([0, 1], undefined)
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
    fnTest([], tests(
      fnTest([],  undefined),
      fnTest([1], 1)
    )),
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

  runWith(fpx.rest,
    fnTest([id], fnTest([1, 2, 3], id([1, 2, 3])))
  ),

  runWith(fpx.spread,
    fnTest([add], fnTest([[1, 2]], add(1, 2)))
  ),

  runWith(fpx.alter,
    fnTest([arglist], tests(
      fnTest([], [undefined]),
      fnTest([20], [20])
    )),
    fnTest([arglist, 10, 20], tests(
      fnTest([], [undefined, 10, 20]),
      fnTest([30], [30, 10, 20])
    ))
  ),

  runWith(fpx.revise,
    fnTest([[], arglist], tests(
      fnTest([], []),
      fnTest([1, 2, 3], [])
    )),

    fnTest([[double], arglist], tests(
      fnTest([], [NaN]),
      fnTest([10, 100], [20])
    )),

    fnTest([[inc, double], arglist], tests(
      fnTest([2, 10, 100], [3, 20])
    ))
  ),

  runWith(fpx.fanout,
    fnTest([[], arglist], tests(
      fnTest([], []),
      fnTest([1, 2, 3], [])
    )),

    fnTest([[double], arglist], tests(
      fnTest([], [NaN]),
      fnTest([10, 100], [20])
    )),

    fnTest([[add, sub], arglist], tests(
      fnTest([], [NaN, NaN]),
      fnTest([10, 100, 1000], [110, -90])
    ))
  ),

  runWith(fpx.funnel,
    fnTest([10, []],                10),
    fnTest([10, [id]],              10),
    fnTest([10, [id, double]],      20),
    fnTest([10, [id, double, neg]], false)
  )
]
