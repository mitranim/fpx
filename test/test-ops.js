'use strict'

const {runWith, fnTest} = require('./utils')
const fpx = require('../dist/fpx')

module.exports = [
  runWith(fpx.add,
    fnTest([],       undefined + undefined),
    fnTest(['7', 3], '7' + 3),
    fnTest([7, 3],   7 + 3)
  ),

  runWith(fpx.sub,
    fnTest([],       undefined - undefined),
    fnTest(['7', 3], '7' - 3),
    fnTest([7, 3],   7 - 3)
  ),

  runWith(fpx.mul,
    fnTest([],       undefined * undefined),
    fnTest(['7', 3], '7' * 3),
    fnTest([7, 3],   7 * 3)
  ),

  runWith(fpx.div,
    fnTest([],       undefined / undefined),
    fnTest(['7', 3], '7' / 3),
    fnTest([7, 3],   7 / 3)
  ),

  runWith(fpx.inc,
    fnTest([],      undefined + 1),
    fnTest(['one'], 'one' + 1),
    fnTest([NaN],   NaN + 1),
    fnTest([-2],    -2 + 1),
    fnTest([1],     1 + 1)
  ),

  runWith(fpx.dec,
    fnTest([],      undefined - 1),
    fnTest(['one'], 'one' - 1),
    fnTest([NaN],   NaN - 1),
    fnTest([-2],    -2 - 1),
    fnTest([2],     2 - 1)
  )
]
