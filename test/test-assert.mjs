/* eslint-disable no-new-wrappers */

import {eq, is, throws} from './utils.mjs'
import * as f from '../fpx.mjs'

eq(f.only(undefined, f.isNil), undefined)
eq(f.only('str',     f.isStr), 'str')
throws(f.only, 'not nil',                    f.isNil)
throws(f.only, undefined,                    f.isStr)
throws(f.only, new String('wrapped string'), f.isStr)

{const x = {};             is(f.onlyInst(x, Object), x)}
{const x = [];             is(f.onlyInst(x, Object), x)}
{const x = [];             is(f.onlyInst(x, Array),  x)}
{const x = new String(''); is(f.onlyInst(x, Object), x)}
{const x = new String(''); is(f.onlyInst(x, String), x)}
throws(f.onlyInst)
throws(f.onlyInst, {})
throws(f.onlyInst, undefined, Object)
throws(f.onlyInst, 'str',     String)
throws(f.onlyInst, {},        String)
