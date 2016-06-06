'use strict'

const {test} = require('./utils')
const fpx = require('../lib/fpx')

function join (a, b)           {return a.concat([b])}
function plus (a, b)           {return a + b}
function id (a)                {return a}
function args ()               {return arguments}
function pairs (acc, val, key) {return join(acc, [val, key])}

get: {
  test(fpx.get,
    {in: [],                out: undefined},
    {in: [, 'one'],         out: undefined},
    {in: [[], 'length'],    out: [].length},
    {in: [join, 'length'],  out: join.length},
    {in: [{one: 1}, 'one'], out: 1}
  )
}

scan: {
  test(fpx.scan,
    {in: [, 'one'],                       out: undefined},
    {in: [1],                             out: 1},
    {in: [{one: 1}, 'one'],               out: 1},
    {in: [{one: {two: 2}}, 'one', 'two'], out: 2}
  )
}

getAt: {
  test(fpx.getAt,
    {in: [],                                out: undefined},
    {in: [, []],                            out: undefined},
    {in: [, ['one']],                       out: undefined},
    {in: [{one: 1}],                        out: {one: 1}},
    {in: [{one: 1}, ['one']],               out: 1},
    {in: [{one: {two: 2}}, ['one', 'two']], out: 2}
  )
}

mapVals: {
  test(fpx.mapVals,
    {in: [],                       out: {}},
    {in: [, {}],                   out: {}},
    {in: [plus, {one: 1, two: 2}], out: {one: '1one', two: '2two'}}
  )
}

mapKeys: {
  test(fpx.mapKeys,
    {in: [],                       out: {}},
    {in: [, {}],                   out: {}},
    {in: [plus, {one: 1, two: 2}], out: {'1one': 1, '2two': 2}}
  )
}
