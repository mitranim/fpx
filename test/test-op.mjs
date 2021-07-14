/* eslint-disable no-self-compare */

import {
  // assertStrictEquals as is,
  assertEquals as eq,
  // assertThrows as throws,
} from 'assert'

import * as f from '../fpx.mjs'

eq(f.add(),       undefined + undefined)
eq(f.add('7', 3), `7${3}`)
eq(f.add(7, 3),   7 + 3)

eq(f.sub(),       undefined - undefined)
eq(f.sub('7', 3), '7' - 3)
eq(f.sub(7, 3),   7 - 3)

eq(f.mul(),       undefined * undefined)
eq(f.mul('7', 3), '7' * 3)
eq(f.mul(7, 3),   7 * 3)

eq(f.div(),       undefined / undefined)
eq(f.div('7', 3), '7' / 3)
eq(f.div(7, 3),   7 / 3)

eq(f.rem(),         undefined % undefined)
eq(f.rem('1.1', 1), '1.1' % 1)
eq(f.rem(1.1, 1),   1.1 % 1)
eq(f.rem(2.3, 1),   2.3 % 1)
eq(f.rem(33, 2),    33 % 2)

eq(f.lt(),         undefined < undefined)
eq(f.lt('10', 20), '10' < 20)
eq(f.lt(10, 10),   10 < 10)
eq(f.lt(10, -10),  10 < -10)
eq(f.lt(10, 10.1), 10 < 10.1)
eq(f.lt(10.1, 10), 10.1 < 10)
eq(f.lt(10, 20),   10 < 20)
eq(f.lt(20, 10),   20 < 10)

eq(f.gt(),         undefined > undefined)
eq(f.gt('10', 20), '10' > 20)
eq(f.gt(10, 10),   10 > 10)
eq(f.gt(10, -10),  10 > -10)
eq(f.gt(10, 10.1), 10 > 10.1)
eq(f.gt(10.1, 10), 10.1 > 10)
eq(f.gt(10, 20),   10 > 20)
eq(f.gt(20, 10),   20 > 10)

eq(f.lte(),         undefined <= undefined)
eq(f.lte('10', 20), '10' <= 20)
eq(f.lte(10, 10),   10 <= 10)
eq(f.lte(10, -10),  10 <= -10)
eq(f.lte(10, 10.1), 10 <= 10.1)
eq(f.lte(10.1, 10), 10.1 <= 10)
eq(f.lte(10, 20),   10 <= 20)
eq(f.lte(20, 10),   20 <= 10)

eq(f.gte(),         undefined >= undefined)
eq(f.gte('10', 20), '10' >= 20)
eq(f.gte(10, 10),   10 >= 10)
eq(f.gte(10, -10),  10 >= -10)
eq(f.gte(10, 10.1), 10 >= 10.1)
eq(f.gte(10.1, 10), 10.1 >= 10)
eq(f.gte(10, 20),   10 >= 20)
eq(f.gte(20, 10),   20 >= 10)

eq(f.inc(),      undefined + 1)
eq(f.inc('one'), `one${1}`)
eq(f.inc(NaN),   NaN + 1)
eq(f.inc(-2),    -2 + 1)
eq(f.inc(1),     1 + 1)

eq(f.dec(),      undefined - 1)
eq(f.dec('one'), 'one' - 1)
eq(f.dec(NaN),   NaN - 1)
eq(f.dec(-2),    -2 - 1)
eq(f.dec(2),     2 - 1)
