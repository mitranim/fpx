'use strict'

const {test} = require('./utils')
const fpx = require('../lib/fpx')

function double (a) {return a * 2}

id: {
  test(fpx.id,
    {in: [],  out: undefined},
    {in: [1], out: 1}
  )
}

val: {
  test(fpx.val,
    {in: [],  test: [{in: [2], out: undefined}]},
    {in: [1], test: [{in: [2], out: 1}]}
  )
}

mask: {
  test(fpx.mask,
    {in: [],  test: [{in: [1], out: undefined}]},

    {in: [1], test: [
      {in: [],   out: 1},
      {in: [{}], out: 1}
    ]},

    {in: [double], test: [
      {in: [1],  out: 2},
      {in: [{}], out: NaN}
    ]},

    {in: [{text: /text/, one: 1}], test: [
      {in: [],                       out: {text: false, one: 1}},
      {in: [{text: 'text', one: 2}], out: {text: true, one: 1}}
    ]}
  )
}
