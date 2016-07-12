'use strict'

const {runWith, fnTest, tests} = require('./utils')
const fpx = require('../lib/fpx')

function double (a) {return a * 2}
function args () {return arguments}

module.exports = [
  runWith(fpx.id,
    fnTest([],  undefined),
    fnTest([1], 1)
  ),

  runWith(fpx.val,
    fnTest([],  fnTest([2], undefined)),
    fnTest([1], fnTest([2], 1))
  ),

  runWith(fpx.mask,
    fnTest([],  fnTest([1], undefined)),

    fnTest([1], tests(
      fnTest([],   1),
      fnTest([{}], 1)
    )),

    fnTest([double], tests(
      fnTest([1],  2),
      fnTest([{}], NaN)
    )),

    fnTest([[/text/, 1]], tests(
      fnTest([],                [false, 1]),
      fnTest([['text', 2]],     [true, 1]),
      fnTest([args('text', 2)], [true, 1])
    )),

    fnTest([{text: /text/, one: 1}], tests(
      fnTest([],                       {text: false, one: 1}),
      fnTest([{text: 'text', one: 2}], {text: true, one: 1})
    ))
  )
]
