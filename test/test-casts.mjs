import {eq, is, throws} from './utils.mjs'
import * as f from '../fpx.mjs'

function args() {return arguments}

eq(f.onlyString(null),       '')
eq(f.onlyString(undefined),  '')
eq(f.onlyString('string'),   'string')
throws(f.onlyString, 10)
throws(f.onlyString, ['not string'])
throws(f.onlyString, new String('not string')) // eslint-disable-line no-new-wrappers

eq(f.onlyList(null),         [])
eq(f.onlyList(undefined),    [])
eq(f.onlyList(['list']),     ['list'])
{
  const input = []
  is(f.onlyList(input), input)
}
{
  const input = args()
  is(f.onlyList(input), input)
}
throws(f.onlyList, 'not list')
throws(f.onlyList, {length: 0})

eq(f.onlyDict(null),                  {})
eq(f.onlyDict(undefined),             {})
eq(f.onlyDict({dict: true}),          {dict: true})
eq(f.onlyDict(Object.create(null)),   {})
{
  const input = {}
  is(f.onlyDict(input), input)
}
throws(f.onlyDict, 'not dict')
throws(f.onlyDict, ['not dict'])
throws(f.onlyDict, Object.create({}))

eq(f.onlyStruct(null),                {})
eq(f.onlyStruct(undefined),           {})
eq(f.onlyStruct({struct: true}),      {struct: true})
{
  const input = {}
  is(f.onlyStruct(input), input)
}
{
  const input = Object.create({})
  is(f.onlyStruct(input), input)
}
throws(f.onlyStruct, 'not struct')
throws(f.onlyStruct, ['not struct'])

eq(f.toArray(), [])
eq(f.toArray([10, 20, 30]), [10, 20, 30])
eq(f.toArray(args(10, 20, 30)), [10, 20, 30])
{
  const input = []
  is(f.toArray(input), input)
}
throws(f.toArray, 'not list')
throws(f.toArray, {length: 0})
