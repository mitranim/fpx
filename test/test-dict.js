'use strict'

const {eq} = require('./utils')
const f = require('../dist/fpx')

function args ()     {return arguments}
function join (a, b) {return a.concat([b])}
function add  (a, b) {return a + b}

eq(f.get(),                 undefined)
eq(f.get(undefined, 'one'), undefined)
eq(f.get([], 'length'),     [].length)
eq(f.get(join, 'length'),   join.length)
eq(f.get({one: 1}, 'one'),  1)

eq(f.scan(undefined, 'one'),              undefined)
eq(f.scan(1),                             1)
eq(f.scan({one: 1}, 'one'),               1)
eq(f.scan({one: {two: 2}}, 'one', 'two'), 2)

eq(f.getIn(undefined, []),                       undefined)
eq(f.getIn(undefined, ['one']),                  undefined)
eq(f.getIn({one: 1}, []),                        {one: 1})
eq(f.getIn({one: 1}, ['one']),                   1)
eq(f.getIn({one: {two: 2}}, ['one', 'two']),     2)
eq(f.getIn({one: {two: 2}}, args('one', 'two')), 2)

eq(f.getAt([]),                                  undefined)
eq(f.getAt(['one']),                             undefined)
eq(f.getAt([], {one: 1}),                        {one: 1})
eq(f.getAt(['one'], {one: 1}),                   1)
eq(f.getAt(['one', 'two'], {one: {two: 2}}),     2)
eq(f.getAt(args('one', 'two'), {one: {two: 2}}), 2)

eq(f.mapVals(undefined, add), {})
eq(f.mapVals({one: 1, two: 2}, add), {one: '1one', two: '2two'})

eq(f.mapKeys(undefined, add), {})
eq(f.mapKeys({one: 1, two: 2}, add), {one1: 1, two2: 2})
