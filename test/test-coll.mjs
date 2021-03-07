import {eq} from './utils.mjs'
import * as f from '../fpx.mjs'

function id(a) {return a}

eq(f.size(),                   0)
eq(f.size(null),               0)
eq(f.size(10),                 0)
eq(f.size('one'),              0)
eq(f.size(id),                 0)
eq(f.size([10, 20]),           2)
eq(f.size({one: 10, two: 20}), 2)

eq(f.vacate(),          undefined)
eq(f.vacate('one'),     undefined)
eq(f.vacate(10),        undefined)
eq(f.vacate([]),        undefined)
eq(f.vacate({}),        undefined)
eq(f.vacate(id),        undefined)
eq(f.vacate([10]),      [10])
eq(f.vacate({one: 10}), {one: 10})
