'use strict'

const {runWith, fnTest} = require('./utils')
const fpx = require('../lib/fpx')

function join    (a, b)          {return a.concat([b])}
function add     (a, b)          {return a + b}
function mul     (a, b)          {return a * b}
function id      (a)             {return a}
function args    ()              {return arguments}
function pairs   (acc, val, key) {return join(acc, [val, key])}
function arglist (...args)       {return args}
function double  (a)             {return a * 2}

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
    fnTest([id],                        undefined),
    fnTest([id, []],                    undefined),
    fnTest([Number.isNaN, [1, NaN, 2]], NaN),
    fnTest([Boolean, 'one'],            undefined)
  ),

  runWith(fpx.every,
    fnTest([id], true),
    fnTest([id, []], true),
    fnTest([id, [10, NaN]], false),
    fnTest([id, [10, 20]], true),
    fnTest([id, 'blah'], true)
  ),

  runWith(fpx.some,
    fnTest([id], false),
    fnTest([id, []], false),
    fnTest([id, [0, NaN]], false),
    fnTest([id, [10, NaN]], true),
    fnTest([id, 'blah'], false)
  ),

  runWith(fpx.procure,
    fnTest([id], undefined),
    fnTest([id, [0, 10, 20]], 10),
    fnTest([arglist, [10, 20]], [10, 0]),
    fnTest([double, [0, 0, 10, 100]], 20),
    fnTest([mul, [0, 0, 10, 100]], 20)
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
    fnTest([, 1],             [1]),
    fnTest([[1], 2],          [2, 1]),
    fnTest([[1], [2]],        [[2], 1]),
    fnTest([args(1), 2],      [2, 1]),
    fnTest(['not list', '!'], ['!'])
  ),

  runWith(fpx.remove,
    fnTest([],                    []),
    fnTest([[10, NaN]],           [10, NaN]),
    fnTest([[10, NaN], NaN],      [10]),
    fnTest([[NaN, 10, NaN], NaN], [10, NaN]),
    fnTest(['not list', '!'],     [])
  ),

  runWith(fpx.removeAtIndex,
    fnTest([],                    []),
    fnTest([[NaN, 10, NaN]],      [NaN, 10, NaN]),
    fnTest([[NaN, 10, NaN], 0],   [10, NaN]),
    fnTest([[NaN, 10, NaN], 1],   [NaN, NaN]),
    fnTest([[NaN, 10, NaN], 10],  [NaN, 10, NaN]),
    fnTest([[NaN, 10, NaN], -1],  [NaN, 10, NaN]),
    fnTest([[NaN, 10, NaN], '1'], [NaN, 10, NaN]),
    fnTest(['not list', '1'],     [])
  ),

  runWith(fpx.adjoin,
    fnTest([, 10],           [10]),
    fnTest([[10], NaN],      [10, NaN]),
    fnTest([[10, NaN], NaN], [10, NaN]),
    fnTest(['not list', 10], [10])
  ),

  runWith(fpx.toggle,
    fnTest([],               [undefined]),
    fnTest([[10], NaN],      [10, NaN]),
    fnTest([[10, NaN], NaN], [10]),
    fnTest(['not list', 10], [10])
  ),

  runWith(fpx.concat,
    fnTest([],                  []),
    fnTest([[]],                []),
    fnTest([[], []],            []),
    fnTest([[], [], []],        []),
    fnTest([[10], '20'],        [10]),
    fnTest([10, 20],            []),
    fnTest([[10], 20],          [10]),
    fnTest([[10], [20]],        [10, 20]),
    fnTest([[10], [20], 30],    [10, 20]),
    fnTest([[10], [20], [30]],  [10, 20, 30]),
    fnTest([[10], [[20]]],      [10, [20]]),
    fnTest([[10], args(20)],    [10, 20])
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
  ),

  runWith(fpx.take,
    fnTest([0],                  []),
    fnTest([0,        []],       []),
    fnTest([0,        [10, 20]], []),
    fnTest([1,        [10, 20]], [10]),
    fnTest([2,        [10, 20]], [10, 20]),
    fnTest([3,        [10, 20]], [10, 20]),
    fnTest([Infinity, [10, 20]], [10, 20])
  ),

  runWith(fpx.drop,
    fnTest([0],                  []),
    fnTest([Infinity],           []),
    fnTest([1, []],              []),
    fnTest([0, [10, 20]],        [10, 20]),
    fnTest([1, [10, 20]],        [20]),
    fnTest([2, [10, 20]],        []),
    fnTest([Infinity, [10, 20]], [])
  ),

  runWith(fpx.reverse,
    fnTest([],                     []),
    fnTest([[10, 20]],             [20, 10]),
    fnTest([[[10, 20], [30, 40]]], [[30, 40], [10, 20]]),
    fnTest(['one'],                [])
  ),
]
