'use strict'

const {runWith, fnTest} = require('./utils')
const fpx = require('../lib/fpx')

module.exports = [
  runWith(fpx.yes,
    fnTest([],   !!undefined),
    fnTest([],   false),
    fnTest([0],  !!0),
    fnTest([0],  false),
    fnTest([''], !!''),
    fnTest([''], false),
    fnTest([1],  !!1),
    fnTest([1],  true)
  ),

  runWith(fpx.no,
    fnTest([],   !undefined),
    fnTest([],   true),
    fnTest([0],  !0),
    fnTest([0],  true),
    fnTest([''], !''),
    fnTest([''], true),
    fnTest([1],  !1),
    fnTest([1],  false)
  ),

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
