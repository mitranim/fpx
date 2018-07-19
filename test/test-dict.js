'use strict'

const {eq, throws} = require('./utils')
const f = require('../dist/fpx')

const STASH = []
function stash(value, key, a, b, c) {STASH.push([value, key, a, b, c])}
function foldStash(acc, value, key, a, b, c) {STASH.push([acc, value, key, a, b, c])}
function unstash() {return STASH.splice(0)}

function id(a) {return a}
function args() {return arguments}
function join(a, b) {return a.concat([b])}
function add(a, b) {return a + b}

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

eq(f.getter('one')({one: 10}), 10)
eq(f.getter('one')(), undefined)
eq(f.getter(1)(), undefined)
eq(f.getter(1)([10, 20]), 20)

eq(f.keys(),                 [])
eq(f.keys(null),             [])
eq(f.keys(10),               [])
eq(f.keys('blah'),           [])
eq(f.keys(f.keys),           [])
eq(f.keys([10, 20]),         [])
eq(f.keys([10, 20]),         [])
eq(f.keys({one: 1, two: 2}), ['one', 'two'])

eq(f.values(),                 [])
eq(f.values(null),             [])
eq(f.values(10),               [])
eq(f.values('blah'),           [])
eq(f.values(f.values),         [])
eq(f.values([10, 20]),         [])
eq(f.values([10, 20]),         [])
eq(f.values({one: 1, two: 2}), [1, 2])

eq(f.eachVal(undefined, id), undefined)
f.eachVal({one: 10, two: 20}, stash, 10, 20, 30)
eq(unstash(), [[10, 'one', 10, 20, 30], [20, 'two', 10, 20, 30]])
throws(f.eachVal)
throws(f.eachVal, 'not dict', id)
throws(f.eachVal, ['not dict'], id)

eq(f.foldVals(undefined, 10, add), 10)
eq(f.foldVals({one: 20, two: 30}, 10, add), 60)
f.foldVals({one: 10, two: 20}, 5, foldStash, 10, 20, 30)
eq(unstash(), [[5, 10, 'one', 10, 20, 30], [undefined, 20, 'two', 10, 20, 30]])
throws(f.foldVals)
throws(f.foldVals, 'not dict', 10, add)
throws(f.foldVals, ['not dict'], 10, add)

eq(f.mapVals(undefined, add), {})
eq(f.mapVals({one: 1, two: 2}, add), {one: '1one', two: '2two'})
f.mapVals({one: 10, two: 20}, stash, 10, 20, 30)
eq(unstash(), [[10, 'one', 10, 20, 30], [20, 'two', 10, 20, 30]])
throws(f.mapVals)
throws(f.mapVals, 'not dict', id)
throws(f.mapVals, ['not dict'], id)

eq(f.mapKeys(undefined, add), {})
eq(f.mapKeys({one: 1, two: 2}, add), {one1: 1, two2: 2})
f.mapKeys({one: 10, two: 20}, stash, 10, 20, 30)
eq(unstash(), [['one', 10, 10, 20, 30], ['two', 20, 10, 20, 30]])
throws(f.mapKeys)
throws(f.mapKeys, 'not dict', id)
throws(f.mapKeys, ['not dict'], id)

eq(f.mapValsSort(undefined, id), [])
eq(f.mapValsSort({3: 10, 22: 20, 111: 30}, id), [30, 20, 10])
f.mapValsSort({one: 10, two: 20}, stash, 10, 20, 30)
eq(unstash(), [[10, 'one', 10, 20, 30], [20, 'two', 10, 20, 30]])
throws(f.mapValsSort)
throws(f.mapValsSort, 'not dict', id)
throws(f.mapValsSort, ['not dict'], id)

eq(f.pickBy(undefined, id), {})
eq(f.pickBy({one: 10, two: NaN}, id), {one: 10})
f.pickBy({one: 10, two: 20}, stash, 10, 20, 30)
eq(unstash(), [[10, 'one', 10, 20, 30], [20, 'two', 10, 20, 30]])
throws(f.pickBy)
throws(f.pickBy, 'not dict', id)
throws(f.pickBy, ['not dict'], id)

eq(f.omitBy(undefined, id), {})
eq(f.omitBy({one: 10, two: NaN}, id), {two: NaN})
f.omitBy({one: 10, two: 20}, stash, 10, 20, 30)
eq(unstash(), [[10, 'one', 10, 20, 30], [20, 'two', 10, 20, 30]])
throws(f.omitBy)
throws(f.omitBy, 'not dict', id)
throws(f.omitBy, ['not dict'], id)

eq(f.pickKeys(undefined, []), {})
eq(f.pickKeys({one: 10, two: 20}, []), {})
eq(f.pickKeys({one: 10, two: 20}, ['one']), {one: 10})
throws(f.pickKeys)
throws(f.pickKeys, 'not dict', ['length'])
throws(f.pickKeys, ['not dict'], ['length'])

eq(f.omitKeys(undefined, []), {})
eq(f.omitKeys({one: 10, two: 20}, []), {one: 10, two: 20})
eq(f.omitKeys({one: 10, two: 20}, ['one']), {two: 20})
throws(f.omitKeys)
throws(f.omitKeys, {})
throws(f.omitKeys, 'not dict', [])
throws(f.omitKeys, ['not dict'], [])

eq(f.findVal(undefined, id), undefined)
eq(f.findVal({one: 10}, id), 10)
eq(f.findVal({one: 10, two: [20]}, Array.isArray), [20])
f.findVal({one: 10, two: 20}, stash, 10, 20, 30)
eq(unstash(), [[10, 'one', 10, 20, 30], [20, 'two', 10, 20, 30]])
throws(f.findVal)
throws(f.findVal, 'not dict', id)
throws(f.findVal, ['not dict'], id)

eq(f.findKey(undefined, id), undefined)
eq(f.findKey({one: 10}, id), 'one')
eq(f.findKey({one: 10, two: [20]}, Array.isArray), 'two')
f.findKey({one: 10, two: 20}, stash, 10, 20, 30)
eq(unstash(), [[10, 'one', 10, 20, 30], [20, 'two', 10, 20, 30]])
throws(f.findKey)
throws(f.findKey, 'not dict', id)
throws(f.findKey, ['not dict'], id)

eq(f.invert(), {})
eq(f.invert({one: 10, two: 20}), {10: 'one', 20: 'two'})
throws(f.invert, 'not dict')
throws(f.invert, ['not dict'])

eq(f.invertBy(undefined, id), {})
eq(f.invertBy({one: 10, two: 20}, id), {10: 'one', 20: 'two'})
f.invertBy({one: 10, two: 20}, stash, 10, 20, 30)
eq(unstash(), [[10, 'one', 10, 20, 30], [20, 'two', 10, 20, 30]])
throws(f.invertBy)
throws(f.invertBy, 'not dict', id)
throws(f.invertBy, ['not dict'], id)
