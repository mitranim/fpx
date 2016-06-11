'use strict'

const {test} = require('./utils')
const fpx = require('../lib/fpx')

yes: {
  test(fpx.yes,
    {in: [],   out: !!undefined},
    {in: [],   out: false},
    {in: [0],  out: !!0},
    {in: [0],  out: false},
    {in: [''], out: !!''},
    {in: [''], out: false},
    {in: [1],  out: !!1},
    {in: [1],  out: true}
  )
}

no: {
  test(fpx.no,
    {in: [],   out: !undefined},
    {in: [],   out: true},
    {in: [0],  out: !0},
    {in: [0],  out: true},
    {in: [''], out: !''},
    {in: [''], out: true},
    {in: [1],  out: !1},
    {in: [1],  out: false}
  )
}

add: {
  test(fpx.add,
    {in: [],       out: undefined + undefined},
    {in: ['7', 3], out: '7' + 3},
    {in: [7, 3],   out: 7 + 3}
  )
}

sub: {
  test(fpx.sub,
    {in: [],       out: undefined - undefined},
    {in: ['7', 3], out: '7' - 3},
    {in: [7, 3],   out: 7 - 3}
  )
}

inc: {
  test(fpx.inc,
    {in: [],      out: undefined + 1},
    {in: ['one'], out: 'one' + 1},
    {in: [NaN],   out: NaN + 1},
    {in: [-2],    out: -2 + 1},
    {in: [1],     out: 1 + 1}
  )
}

dec: {
  test(fpx.dec,
    {in: [],      out: undefined - 1},
    {in: ['one'], out: 'one' - 1},
    {in: [NaN],   out: NaN - 1},
    {in: [-2],    out: -2 - 1},
    {in: [2],     out: 2 - 1}
  )
}
