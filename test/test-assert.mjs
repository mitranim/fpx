/* eslint-disable no-new-wrappers */

import {
  assertStrictEquals as is,
  assertEquals as eq,
  assertThrows as throws,
} from 'assert'

import * as f from '../fpx.mjs'

// TODO test extra args.
eq(f.valid(undefined, f.isNil), undefined)
eq(f.valid('str',     f.isStr), 'str')
throws(() => f.valid('not nil',                    f.isNil))
throws(() => f.valid(undefined,                    f.isStr))
throws(() => f.valid(new String('wrapped string'), f.isStr))

{const x = {};             is(f.validInst(x, Object), x)}
{const x = [];             is(f.validInst(x, Object), x)}
{const x = [];             is(f.validInst(x, Array),  x)}
{const x = new String(''); is(f.validInst(x, Object), x)}
{const x = new String(''); is(f.validInst(x, String), x)}
throws(f.validInst)
throws(() => f.validInst({}))
throws(() => f.validInst(undefined, Object))
throws(() => f.validInst('str',     String))
throws(() => f.validInst({},        String))

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
