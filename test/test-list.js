'use strict'

const {test} = require('./utils')
const fpx = require('../lib/fpx')

function join (a, b)           {return a.concat([b])}
function plus (a, b)           {return a + b}
function id (a)                {return a}
function args ()               {return arguments}
function pairs (acc, val, key) {return join(acc, [val, key])}

list: {
  test(fpx.list,
    {in: [],           out: []},
    {in: [1, ['one']], out: [1, ['one']]},
    {in: ['one'],      out: ['one']}
  )
}

foldl: {
  test(fpx.foldl,
    {in: [, 1, ],               out: 1},
    {in: [, , []],              out: undefined},
    {in: [join, [], [1, 2, 3]], out: join(join(join([], 1), 2), 3)},
    {in: [pairs, [], [10, 20]], out: pairs(pairs([], 10, 0), 20, 1)},
    {in: [id, [], 'one'],       out: []}
  )
}

foldr: {
  test(fpx.foldr,
    {in: [, 1, ],               out: 1},
    {in: [, , []],              out: undefined},
    {in: [join, [], [1, 2, 3]], out: join(join(join([], 3), 2), 1)},
    {in: [pairs, [], [10, 20]], out: pairs(pairs([], 20, 1), 10, 0)},
    {in: [id, [], 'one'],       out: []}
  )
}

map: {
  test(fpx.map,
    {in: [],               out: []},
    {in: [, []],           out: []},
    {in: [id],             out: []},
    {in: [plus, [10, 20]], out: [plus(10, 0), plus(20, 1)]},
    {in: [id, 'one'],      out: []}
  )
}

filter: {
  test(fpx.filter,
    {in: [],                  out: []},
    {in: [, []],              out: []},
    {in: [id, [1, 0, 2, '']], out: [1, 2]},
    {in: [id, 'one'],         out: []}
  )
}

find: {
  test(fpx.find,
    {in: [],                   out: undefined},
    {in: [, []],               out: undefined},
    {in: [isNaN, [1, NaN, 2]], out: NaN},
    {in: [Boolean, 'one'],     out: undefined}
  )
}

includes: {
  test(fpx.includes,
    {in: [],                   out: false},
    {in: [[]],                 out: false},
    {in: [[10, NaN, 20], NaN], out: true},
    {in: ['one', 'o'],         out: false}
  )
}

indexOf: {
  test(fpx.indexOf,
    {in: [],                   out: -1},
    {in: [[]],                 out: -1},
    {in: [[10, NaN, 20], NaN], out: 1},
    {in: ['one', 'o'],         out: -1}
  )
}

slice: {
  test(fpx.slice,
    {in: [[]],                     out: [].slice()},
    {in: [[10, 20], 1],            out: [10, 20].slice(1)},
    {in: [[10, 20, 30, 40], 1, 3], out: [10, 20, 30, 40].slice(1, 3)},
    {in: ['one'],                  out: ['o', 'n', 'e']}
  )
}

append: {
  test(fpx.append,
    {in: [, 1],        out: [1]},
    {in: [[1], 2],     out: [1, 2]},
    {in: [[1], [2]],   out: [1, [2]]},
    {in: [args(1), 2], out: [1, 2]},
    {in: ['one', '!'], out: ['!']}
  )
}

prepend: {
  test(fpx.prepend,
    {in: [, 1],        out: [1]},
    {in: [[1], 2],     out: [2, 1]},
    {in: [[1], [2]],   out: [[2], 1]},
    {in: [args(1), 2], out: [2, 1]},
    {in: ['one', '!'], out: ['!']}
  )
}

remove: {
  test(fpx.remove,
    {in: [],               out: []},
    {in: [[10, NaN]],      out: [10, NaN]},
    {in: [[10, NaN], NaN], out: [10]},
    {in: ['one', '!'],     out: []}
  )
}

flat: {
  test(fpx.flat,
    {in: [],                                 out: []},
    {in: [[[1], [['one']]]],                 out: [1, 'one']},
    {in: [args(args(1), args(args('one')))], out: [1, 'one']},
    {in: ['one'],                            out: []},
    {in: [['one']],                          out: ['one']}
  )
}

head: {
  test(fpx.head,
    {in: [],             out: undefined},
    {in: [[10, 20]],     out: 10},
    {in: [args(10, 20)], out: 10},
    {in: ['one'],        out: undefined}
  )
}

tail: {
  test(fpx.tail,
    {in: [],             out: []},
    {in: [[10, 20]],     out: [20]},
    {in: [args(10, 20)], out: [20]},
    {in: ['one'],        out: []}
  )
}

init: {
  test(fpx.init,
    {in: [],             out: []},
    {in: [[10, 20]],     out: [10]},
    {in: [args(10, 20)], out: [10]},
    {in: ['one'],        out: []}
  )
}

last: {
  test(fpx.last,
    {in: [],             out: undefined},
    {in: [[10, 20]],     out: 20},
    {in: [args(10, 20)], out: 20},
    {in: ['one'],        out: undefined}
  )
}
