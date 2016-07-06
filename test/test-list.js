'use strict'

const {runWith, fnTest} = require('./utils')
const fpx = require('../lib/fpx')

function join (a, b)           {return a.concat([b])}
function add (a, b)            {return a + b}
function id (a)                {return a}
function args ()               {return arguments}
function pairs (acc, val, key) {return join(acc, [val, key])}

module.exports = [
  runWith(fpx.list,
    fnTest([],           []),
    fnTest([1, ['one']], [1, ['one']]),
    fnTest(['one'],      ['one'])
  ),

  runWith(fpx.foldl,
    fnTest([join, 1, undefined],  1),
    fnTest([join, , []],          undefined),
    fnTest([join, [], [1, 2, 3]], join(join(join([], 1), 2), 3)),
    fnTest([pairs, [], [10, 20]], pairs(pairs([], 10, 0), 20, 1)),
    fnTest([id, [], 'one'],       [])
  ),

  runWith(fpx.foldr,
    fnTest([join, 1, undefined],  1),
    fnTest([join, , []],          undefined),
    fnTest([join, [], [1, 2, 3]], join(join(join([], 3), 2), 1)),
    fnTest([pairs, [], [10, 20]], pairs(pairs([], 20, 1), 10, 0)),
    fnTest([id, [], 'one'],       [])
  ),

  runWith(fpx.map,
    fnTest([id],             []),
    fnTest([id, []],         []),
    fnTest([id],             []),
    fnTest([add, [10, 20]],  [add(10, 0), add(20, 1)]),
    fnTest([id, 'one'],      [])
  ),

  runWith(fpx.filter,
    fnTest([id],                []),
    fnTest([id, []],            []),
    fnTest([id, [1, 0, 2, '']], [1, 2]),
    fnTest([id, 'one'],         [])
  ),

  runWith(fpx.find,
    fnTest([id],                 undefined),
    fnTest([id, []],             undefined),
    fnTest([isNaN, [1, NaN, 2]], NaN),
    fnTest([Boolean, 'one'],     undefined)
  ),

  runWith(fpx.includes,
    fnTest([],                   false),
    fnTest([[]],                 false),
    fnTest([[10, NaN, 20], NaN], true),
    fnTest(['one', 'o'],         false)
  ),

  runWith(fpx.indexOf,
    fnTest([],                   -1),
    fnTest([[]],                 -1),
    fnTest([[10, NaN, 20], NaN], 1),
    fnTest(['one', 'o'],         -1)
  ),

  runWith(fpx.slice,
    fnTest([[]],                     [].slice()),
    fnTest([[10, 20], 1],            [10, 20].slice(1)),
    fnTest([[10, 20, 30, 40], 1, 3], [10, 20, 30, 40].slice(1, 3)),
    fnTest(['one'],                  ['o', 'n', 'e'])
  ),

  runWith(fpx.append,
    fnTest([, 1],        [1]),
    fnTest([[1], 2],     [1, 2]),
    fnTest([[1], [2]],   [1, [2]]),
    fnTest([args(1), 2], [1, 2]),
    fnTest(['one', '!'], ['!'])
  ),

  runWith(fpx.prepend,
    fnTest([, 1],        [1]),
    fnTest([[1], 2],     [2, 1]),
    fnTest([[1], [2]],   [[2], 1]),
    fnTest([args(1), 2], [2, 1]),
    fnTest(['one', '!'], ['!'])
  ),

  runWith(fpx.remove,
    fnTest([],               []),
    fnTest([[10, NaN]],      [10, NaN]),
    fnTest([[10, NaN], NaN], [10]),
    fnTest(['one', '!'],     [])
  ),

  runWith(fpx.flat,
    fnTest([],                                 []),
    fnTest([[[1], [['one']]]],                 [1, 'one']),
    fnTest([args(args(1), args(args('one')))], [1, 'one']),
    fnTest(['one'],                            []),
    fnTest([['one']],                          ['one'])
  ),

  runWith(fpx.head,
    fnTest([],             undefined),
    fnTest([[10, 20]],     10),
    fnTest([args(10, 20)], 10),
    fnTest(['one'],        undefined)
  ),

  runWith(fpx.tail,
    fnTest([],             []),
    fnTest([[10, 20]],     [20]),
    fnTest([args(10, 20)], [20]),
    fnTest(['one'],        [])
  ),

  runWith(fpx.init,
    fnTest([],             []),
    fnTest([[10, 20]],     [10]),
    fnTest([args(10, 20)], [10]),
    fnTest(['one'],        [])
  ),

  runWith(fpx.last,
    fnTest([],             undefined),
    fnTest([[10, 20]],     20),
    fnTest([args(10, 20)], 20),
    fnTest(['one'],        undefined)
  )
]
