/* eslint-disable no-new-wrappers */

import {eq, is, throws} from './utils.mjs'
import * as f from '../fpx.mjs'

function args() {return arguments}

eq(f.str(null),       '')
eq(f.str(undefined),  '')
eq(f.str('string'),   'string')
throws(f.str, 10)
throws(f.str, ['not string'])
throws(f.str, new String('not string')) // eslint-disable-line no-new-wrappers

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
throws(f.list, 'not list')
throws(f.list, {length: 0})

eq(f.dict(null),                  {})
eq(f.dict(undefined),             {})
eq(f.dict({dict: true}),          {dict: true})
eq(f.dict(Object.create(null)),   {})
{
  const input = {}
  is(f.dict(input), input)
}
throws(f.dict, 'not dict')
throws(f.dict, ['not dict'])
throws(f.dict, Object.create({}))

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
throws(f.struct, 'not struct')
throws(f.struct, ['not struct'])

eq(f.arr(), [])
eq(f.arr([10, 20, 30]), [10, 20, 30])
{
  const input = []
  is(f.arr(input), input)
}
throws(f.arr, 'not list')
throws(f.arr, {length: 0})
throws(f.arr, args())

eq(f.opt(null,      f.isStr), undefined)
eq(f.opt(undefined, f.isStr), undefined)
eq(f.opt('str',     f.isStr), 'str')
eq(f.opt(null,      f.isList), undefined)
eq(f.opt(undefined, f.isList), undefined)
eq(f.opt([10],      f.isList), [10])
throws(f.opt)
throws(f.opt, null)
throws(f.opt, undefined)
throws(f.opt, 'str')
throws(f.opt, ['str but in list'], f.isStr)
throws(f.opt, 'not list', f.isList)

eq(f.optInst(null,      String), undefined)
eq(f.optInst(undefined, String), undefined)
{const x = {};             is(f.optInst(x, Object), x)}
{const x = [];             is(f.optInst(x, Object), x)}
{const x = [];             is(f.optInst(x, Array),  x)}
{const x = new String(''); is(f.optInst(x, Object), x)}
{const x = new String(''); is(f.optInst(x, String), x)}
throws(f.optInst)
throws(f.optInst, null)
throws(f.optInst, undefined)
throws(f.optInst, 'str')
throws(f.optInst, 'str', Object)
throws(f.optInst, 'str', String)
throws(f.optInst, {}, Array)

eq(f.toStr(null),      '')
eq(f.toStr(undefined), '')
eq(f.toStr(10),        '10')
eq(f.toStr(true),      'true')
eq(f.toStr(false),     'false')
throws(f.toStr,        ['str in list'])
throws(f.toStr,        {key: 'val'})

eq(f.toArr(null),      [])
eq(f.toArr(undefined), [])
eq(f.toArr([]),        [])
eq(f.toArr([10]),      [10])
eq(f.toArr(args(10)),  [10])
throws(f.toArr,        'not list')
throws(f.toArr,        new String('not list'))
throws(f.toArr,        {key: 'val'})
