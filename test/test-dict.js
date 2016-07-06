'use strict'

const {runWith, fnTest} = require('./utils')
const fpx = require('../lib/fpx')

function args ()     {return arguments}
function join (a, b) {return a.concat([b])}
function add (a, b)  {return a + b}

module.exports = [
  runWith(fpx.get,
    fnTest([],                undefined),
    fnTest([, 'one'],         undefined),
    fnTest([[], 'length'],    [].length),
    fnTest([join, 'length'],  join.length),
    fnTest([{one: 1}, 'one'], 1)
  ),

  runWith(fpx.scan,
    fnTest([, 'one'],                       undefined),
    fnTest([1],                             1),
    fnTest([{one: 1}, 'one'],               1),
    fnTest([{one: {two: 2}}, 'one', 'two'], 2)
  ),

  runWith(fpx.getIn,
    fnTest([],                                    undefined),
    fnTest([, []],                                undefined),
    fnTest([, ['one']],                           undefined),
    fnTest([{one: 1}],                            {one: 1}),
    fnTest([{one: 1}, ['one']],                   1),
    fnTest([{one: {two: 2}}, ['one', 'two']],     2),
    fnTest([{one: {two: 2}}, args('one', 'two')], 2)
  ),

  runWith(fpx.getAt,
    fnTest([],                                    undefined),
    fnTest([[]],                                  undefined),
    fnTest([['one']],                             undefined),
    fnTest([, {one: 1}],                          {one: 1}),
    fnTest([['one'], {one: 1}],                   1),
    fnTest([['one', 'two'], {one: {two: 2}}],     2),
    fnTest([args('one', 'two'), {one: {two: 2}}], 2)
  ),

  runWith(fpx.mapVals,
    fnTest([],                      {}),
    fnTest([, {}],                  {}),
    fnTest([add, {one: 1, two: 2}], {one: '1one', two: '2two'})
  ),

  runWith(fpx.mapKeys,
    fnTest([],                      {}),
    fnTest([, {}],                  {}),
    fnTest([add, {one: 1, two: 2}], {'1one': 1, '2two': 2})
  )
]
