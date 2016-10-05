'use strict'

const {runWith, fnTest} = require('./utils')
const fpx = require('../lib/fpx')

module.exports = [
  runWith(fpx.keys,
    fnTest([],                 []),
    fnTest([null],             []),
    fnTest([10],               []),
    fnTest(['blah'],           []),
    fnTest([[10, 20]],         ['0', '1']),
    fnTest([{one: 1, two: 2}], ['one', 'two'])
  ),

  runWith(fpx.size,
    fnTest([],                 0),
    fnTest([null],             0),
    fnTest([10],               0),
    fnTest(['blah'],           0),
    fnTest([[10, 20]],         2),
    fnTest([{one: 1, two: 2}], 2)
  ),
]
