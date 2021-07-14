/* eslint-disable no-new-wrappers */

import {
  assertStrictEquals as is,
  assertEquals as eq,
  assertThrows as throws,
} from 'assert'

import * as f from '../fpx.mjs'

function args() {return arguments}

eq(f.str(null),       '')
eq(f.str(undefined),  '')
eq(f.str('string'),   'string')
throws(() => f.str(10))
throws(() => f.str(['not string']))
throws(() => f.str(new String('not string'))) // eslint-disable-line no-new-wrappers

eq(f.list(null),         [])
eq(f.list(undefined),    [])
eq(f.list(['list']),     ['list'])
{
  const input = []
  is(f.list(input), input)
}
{
  const input = args()
  is(f.list(input), input)
}
throws(() => f.list('not list'))
throws(() => f.list({length: 0}))

eq(f.dict(null),                  {})
eq(f.dict(undefined),             {})
eq(f.dict({dict: true}),          {dict: true})
eq(f.dict(Object.create(null)),   {})
{
  const input = {}
  is(f.dict(input), input)
}
throws(() => f.dict('not dict'))
throws(() => f.dict(['not dict']))
throws(() => f.dict(Object.create({})))

eq(f.struct(null),                {})
eq(f.struct(undefined),           {})
eq(f.struct({struct: true}),      {struct: true})
{
  const input = {}
  is(f.struct(input), input)
}
{
  const input = Object.create({})
  is(f.struct(input), input)
}
throws(() => f.struct('not struct'))
throws(() => f.struct(['not struct']))

eq(f.arr(), [])
eq(f.arr([10, 20, 30]), [10, 20, 30])
{
  const input = []
  is(f.arr(input), input)
}
throws(() => f.arr('not list'))
throws(() => f.arr({length: 0}))
throws(() => f.arr(args()))

eq(f.toStr(null),      '')
eq(f.toStr(undefined), '')
eq(f.toStr(10),        '10')
eq(f.toStr(true),      'true')
eq(f.toStr(false),     'false')
throws(() => f.toStr(['str in list']))
throws(() => f.toStr({key: 'val'}))

eq(f.toArr(null),      [])
eq(f.toArr(undefined), [])
eq(f.toArr([]),        [])
eq(f.toArr([10]),      [10])
eq(f.toArr(args(10)),  [10])
throws(() => f.toArr('not list'))
throws(() => f.toArr(new String('not list')))
throws(() => f.toArr({key: 'val'}))
