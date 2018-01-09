'use strict'

const {eq} = require('./utils')
const fpx = require('../dist/fpx')

function args ()     {return arguments}
function join (a, b) {return a.concat([b])}
function add  (a, b) {return a + b}

eq(fpx.get(),                 undefined)
eq(fpx.get(undefined, 'one'), undefined)
eq(fpx.get([], 'length'),     [].length)
eq(fpx.get(join, 'length'),   join.length)
eq(fpx.get({one: 1}, 'one'),  1)

eq(fpx.scan(undefined, 'one'),              undefined)
eq(fpx.scan(1),                             1)
eq(fpx.scan({one: 1}, 'one'),               1)
eq(fpx.scan({one: {two: 2}}, 'one', 'two'), 2)

eq(fpx.getIn(undefined, []),                       undefined)
eq(fpx.getIn(undefined, ['one']),                  undefined)
eq(fpx.getIn({one: 1}, []),                        {one: 1})
eq(fpx.getIn({one: 1}, ['one']),                   1)
eq(fpx.getIn({one: {two: 2}}, ['one', 'two']),     2)
eq(fpx.getIn({one: {two: 2}}, args('one', 'two')), 2)

eq(fpx.getAt([]),                                  undefined)
eq(fpx.getAt(['one']),                             undefined)
eq(fpx.getAt([], {one: 1}),                        {one: 1})
eq(fpx.getAt(['one'], {one: 1}),                   1)
eq(fpx.getAt(['one', 'two'], {one: {two: 2}}),     2)
eq(fpx.getAt(args('one', 'two'), {one: {two: 2}}), 2)

eq(fpx.mapVals(undefined, add), {})
eq(fpx.mapVals({one: 1, two: 2}, add), {one: '1one', two: '2two'})

eq(fpx.mapKeys(undefined, add), {})
eq(fpx.mapKeys({one: 1, two: 2}, add), {one1: 1, two2: 2})
