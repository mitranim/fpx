/* eslint-disable no-new-wrappers */

import {
  assertStrictEquals as is,
  assertEquals as eq,
  assertThrows as throws,
} from 'assert'

import * as f from '../fpx.mjs'

// TODO test extra args.
eq(f.req(undefined, f.isNil), undefined)
eq(f.req('str',     f.isStr), 'str')
throws(() => f.req('not nil',                    f.isNil))
throws(() => f.req(undefined,                    f.isStr))
throws(() => f.req(new String('wrapped string'), f.isStr))

{const x = {};             is(f.reqInst(x, Object), x)}
{const x = [];             is(f.reqInst(x, Object), x)}
{const x = [];             is(f.reqInst(x, Array),  x)}
{const x = new String(''); is(f.reqInst(x, Object), x)}
{const x = new String(''); is(f.reqInst(x, String), x)}
throws(f.reqInst)
throws(() => f.reqInst({}))
throws(() => f.reqInst(undefined, Object))
throws(() => f.reqInst('str',     String))
throws(() => f.reqInst({},        String))

// TODO test extra args.
eq(f.opt(null,      f.isStr), null)
eq(f.opt(undefined, f.isStr), undefined)
eq(f.opt('str',     f.isStr), 'str')
eq(f.opt(null,      f.isList), null)
eq(f.opt(undefined, f.isList), undefined)
eq(f.opt([10],      f.isList), [10])
throws(f.opt)
throws(() => f.opt(null))
throws(() => f.opt(undefined))
throws(() => f.opt('str'))
throws(() => f.opt(['str but in list'], f.isStr))
throws(() => f.opt('not list', f.isList))

eq(f.optInst(null,      String), null)
eq(f.optInst(undefined, String), undefined)
{const x = {};             is(f.optInst(x, Object), x)}
{const x = [];             is(f.optInst(x, Object), x)}
{const x = [];             is(f.optInst(x, Array),  x)}
{const x = new String(''); is(f.optInst(x, Object), x)}
{const x = new String(''); is(f.optInst(x, String), x)}
throws(f.optInst)
throws(() => f.optInst(null))
throws(() => f.optInst(undefined))
throws(() => f.optInst('str'))
throws(() => f.optInst('str', Object))
throws(() => f.optInst('str', String))
throws(() => f.optInst({}, Array))
