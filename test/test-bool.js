'use strict'

const {test} = require('./utils')
const fpx = require('../lib/fpx')

function join (a, b)  {return a.concat([b])}
function plus (a, b)  {return a + b}
function id (a)       {return a}
function args ()      {return arguments}

const {create} = Object

is: {
  test(fpx.is,
    {in: [],             out: true},
    {in: [NaN, NaN],     out: true},
    {in: ['one', 'one'], out: true},
    {in: ['one', 'two'], out: false},
    {in: [[], []],       out: false}
  )
}

isNumber: {
  test(fpx.isNumber,
    {in: [],         out: false},
    {in: [1],        out: true},
    {in: [NaN],      out: true},
    {in: [Infinity], out: true},
    {in: [null],     out: false},
    {in: ['1'],      out: false}
  )
}

isString: {
  test(fpx.isString,
    {in: [],   out: false},
    {in: [''], out: true}
  )
}

isBoolean: {
  test(fpx.isBoolean,
    {in: [],        out: false},
    {in: [true],    out: true},
    {in: [false],   out: true},
    {in: [null],    out: false},
    {in: [Boolean], out: false}
  )
}

isSymbol: {
  test(fpx.isSymbol,
    {in: [],               out: false},
    {in: [Symbol('blah')], out: true},
    {in: ['Symbol(blah)'], out: false}
  )
}

isFunction: {
  test(fpx.isFunction,
    {in: [],                  out: false},
    {in: [id],                out: true},
    {in: [Object.create(id)], out: false}
  )
}

isObject: {
  test(fpx.isObject,
    {in: [],             out: false},
    {in: [null],         out: false},
    {in: [id],           out: false},
    {in: [{}],           out: true},
    {in: [[]],           out: true},
    {in: [/!/],          out: true},
    {in: [create(null)], out: true},
    {in: [create({})],   out: true}
  )
}

isPlainObject: {
  test(fpx.isPlainObject,
    {in: [],             out: false},
    {in: [null],         out: false},
    {in: [id],           out: false},
    {in: [{}],           out: true},
    {in: [[]],           out: false},
    {in: [/!/],          out: false},
    {in: [create(null)], out: true},
    {in: [create({})],   out: false}
  )
}

isArray: {
  test(fpx.isArray,
    {in: [],           out: false},
    {in: [[]],         out: true},
    {in: [create([])], out: true},
    {in: [args(1, 2)], out: false}
  )
}

isList: {
  test(fpx.isList,
    {in: [],           out: false},
    {in: [[]],         out: true},
    {in: [create([])], out: true},
    {in: [args(1, 2)], out: true}
  )
}

isRegExp: {
  test(fpx.isRegExp,
    {in: [],            out: false},
    {in: [/!/],         out: true},
    {in: [create(/!/)], out: true},
    {in: [{}],          out: false}
  )
}

isPromise: {
  test(fpx.isPromise,
    {in: [],                          out: false},
    {in: [{}],                        out: false},
    {in: [{then () {}}],              out: false},
    {in: [Promise.resolve()],         out: true},
    {in: [{then () {}, catch () {}}], out: true}
  )
}

isPrimitive: {
  test(fpx.isPrimitive,
    {in: [],         out: true},
    {in: [null],     out: true},
    {in: [1],        out: true},
    {in: [''],       out: true},
    {in: [Symbol()], out: true},
    {in: [true],     out: true},
    {in: [{}],       out: false},
    {in: [[]],       out: false},
    {in: [id],       out: false},
    {in: [/!/],      out: false}
  )
}

isNil: {
  test(fpx.isNil,
    {in: [],      out: true},
    {in: [null],  out: true},
    {in: [false], out: false}
  )
}

test: {
  test(fpx.test,
    {in: [id], test: [
      {in: [1], out: 1}
    ]},

    {in: [], test: [
      {in: [],     out: true},
      {in: [null], out: false}
    ]},

    {in: ['one'], test: [
      {in: ['one'], out: true},
      {in: ['two'], out: false}
    ]},

    {in: [/one/], test: [
      {in: ['one'], out: true},
      {in: ['two'], out: false}
    ]},

    {in: [NaN], test: [
      {in: [NaN], out: true},
      {in: [],    out: false}
    ]},

    {in: [{}], test: [
      {in: [{}],  out: true},
      {in: [[1]], out: true},
      {in: [],    out: false}
    ]},

    {in: [{nan: isNaN}], test: [
      {in: [{}],                 out: true},
      {in: [{nan: NaN, one: 1}], out: true},
      {in: [{nan: 1}],           out: false}
    ]},

    // Must not accidentally use second argument.

    {in: [id, 1], test: [
      {in: [],  out: undefined},
      {in: [1], out: 1}
    ]},

    {in: [1, 1], test: [
      {in: [],  out: false},
      {in: [1], out: true}
    ]},

    {in: [/one/, 'one'], test: [
      {in: [],      out: false},
      {in: ['one'], out: true}
    ]}
  )
}
