/* eslint-disable no-new-wrappers */

import {eq, throws} from './utils.mjs'
import * as f from '../fpx.mjs'

const STASH = []
function stash(value, key, a, b, c) {STASH.push([value, key, a, b, c])}
function foldStash(acc, value, key, a, b, c) {STASH.push([acc, value, key, a, b, c])}
function unstash() {return STASH.splice(0)}

function join(a, b) {return a.concat([b])}
function mul(a, b) {return a * b}
function sub(a, b) {return a - b}
function id(a) {return a}
function neg(a) {return !a}
function args() {return arguments}
function arglist(...args) {return args}
function pairs(acc, val, key) {return join(acc, [val, key])}
function pair(a, b) {return [a, b]}
function double(a) {return a * 2}

eq(f.len(),         0)
eq(f.len(null),     0)
eq(f.len([10, 20]), 2)
throws(f.len,       10)
throws(f.len,       'one')
throws(f.len,       id)
throws(f.len,       {one: 10, two: 20})

eq(f.hasLen(),                  false)
eq(f.hasLen(null),              false)
eq(f.hasLen(undefined),         false)
eq(f.hasLen([]),                false)
eq(f.hasLen([10]),              true)
eq(f.hasLen(args()),            false)
eq(f.hasLen(args(10)),          true)
eq(f.hasLen(10),                false)
eq(f.hasLen('one'),             false)
eq(f.hasLen(new String('one')), false)
eq(f.hasLen({one: 10}),         false)

eq(f.vacate(),                  undefined)
eq(f.vacate([]),                undefined)
eq(f.vacate([10]),              [10])
eq(f.vacate('one'),             undefined)
eq(f.vacate(new String('one')), undefined)
eq(f.vacate({one: 10}),         undefined)

f.each(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.each)
throws(f.each, [])
throws(f.each, 'not list', id)
throws(f.each, {'not list': true}, id)

eq(f.fold(undefined, 1, join),  1)
eq(f.fold([], undefined, join), undefined)
eq(f.fold([1, 2, 3], [], join), join(join(join([], 1), 2), 3))
eq(f.fold([10, 20], [], pairs), pairs(pairs([], 10, 0), 20, 1))
f.fold(['one', 'two'], NaN, foldStash, 10, 20, 30)
eq(unstash(), [[NaN, 'one', 0, 10, 20, 30], [undefined, 'two', 1, 10, 20, 30]])
throws(f.fold)
throws(f.fold, [])
throws(f.fold, 'not list', [], id)
throws(f.fold, {'not list': true}, [], id)

eq(f.fold1(undefined,    f.add),   undefined)
eq(f.fold1([],           f.add),   undefined)
eq(f.fold1([10, 20, 30], f.add),   f.add(f.add(10, 20), 30))
eq(f.fold1([10, 20, 30], f.add),   60)
eq(f.fold1([10, 20, 30], arglist), arglist(arglist(10, 20, 1), 30, 2))
eq(f.fold1([10, 20, 30], arglist), [[10, 20, 1], 30, 2])
throws(f.fold1)
throws(f.fold1, [])
throws(f.fold1, 'not list', id)
throws(f.fold1, {'not list': true}, id)

eq(f.foldRight(undefined, 1, join),  1)
eq(f.foldRight([], undefined, join), undefined)
eq(f.foldRight([1, 2, 3], [], join), join(join(join([], 3), 2), 1))
eq(f.foldRight([10, 20], [], pairs), pairs(pairs([], 20, 1), 10, 0))
f.foldRight(['one', 'two'], NaN, foldStash, 10, 20, 30)
eq(unstash(), [[NaN, 'two', 1, 10, 20, 30], [undefined, 'one', 0, 10, 20, 30]])
throws(f.foldRight)
throws(f.foldRight, [])
throws(f.foldRight, 'not list', [], id)
throws(f.foldRight, {'not list': true}, [], id)

eq(f.map(undefined, id), [])
eq(f.map([], id),        [])
eq(f.map([10, 20], pair), [[10, 0], [20, 1]])
f.map(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.map)
throws(f.map, [])
throws(f.map, 'not list', id)
throws(f.map, {'not list': true}, id)

eq(f.mapFlat(undefined, id), [])
eq(f.mapFlat([], id), [])
eq(f.mapFlat([10, 20], pair), [10, 0, 20, 1])
eq(f.mapFlat([10, [20]], pair), [10, 0, [20], 1])
f.mapFlat(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.mapFlat)
throws(f.mapFlat, [])
throws(f.mapFlat, 'not list', id)
throws(f.mapFlat, {'not list': true}, id)

eq(f.mapFlatDeep(undefined, id), [])
eq(f.mapFlatDeep([], id), [])
eq(f.mapFlatDeep([10, 20], pair), [10, 0, 20, 1])
eq(f.mapFlatDeep([[10], [[20]]], pair), [10, 0, 20, 1])
f.mapFlatDeep(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.mapFlatDeep)
throws(f.mapFlatDeep, [])
throws(f.mapFlatDeep, 'not list', id)
throws(f.mapFlatDeep, {'not list': true}, id)

eq(f.mapFilter(undefined, id), [])
eq(f.mapFilter([], id), [])
eq(f.mapFilter([10, 0, 'one', ''], id), [10, 'one'])
f.mapFilter(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.mapFilter)
throws(f.mapFilter, [])
throws(f.mapFilter, 'not list', id)
throws(f.mapFilter, {'not list': true}, id)

eq(f.filter(undefined, id),      [])
eq(f.filter([], id),             [])
eq(f.filter([1, 0, 2, ''], id),  [1, 2])
eq(f.filter([1, 0, 2, ''], neg), [0, ''])
f.filter(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.filter)
throws(f.filter, [])
throws(f.filter, 'not list', id)
throws(f.filter, {'not list': true}, id)

eq(f.reject(undefined, id),      [])
eq(f.reject([], id),             [])
eq(f.reject([1, 0, 2, ''], id),  [0, ''])
eq(f.reject([1, 0, 2, ''], neg), [1, 2])
f.reject(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.reject)
throws(f.reject, [])
throws(f.reject, 'not list', id)
throws(f.reject, {'not list': true}, id)

eq(f.compact(undefined), [])
eq(f.compact([10, 0, 'one', '']), [10, 'one'])
throws(f.compact, 'not list')
throws(f.compact, {'not list': true})

eq(f.find(undefined, id),             undefined)
eq(f.find([], id),                    undefined)
eq(f.find([1, NaN, 2], Number.isNaN), NaN)
f.find(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.find)
throws(f.find, [])
throws(f.find, 'not list', id)
throws(f.find, {'not list': true}, id)

eq(f.findRight(undefined, id),               undefined)
eq(f.findRight([], id),                      undefined)
eq(f.findRight([[10], [20]], Array.isArray), [20])
f.findRight(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['two', 1, 10, 20, 30], ['one', 0, 10, 20, 30]])
throws(f.findRight)
throws(f.findRight, [])
throws(f.findRight, 'not list', id)
throws(f.findRight, {'not list': true}, id)

eq(f.findIndex(undefined, id), -1)
eq(f.findIndex([], id),        -1)
eq(f.findIndex([10, NaN, 20, NaN, 30], Number.isNaN), 1)
f.findIndex(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.findIndex)
throws(f.findIndex, [])
throws(f.findIndex, 'not list', id)
throws(f.findIndex, {'not list': true}, id)

eq(f.findIndexRight(undefined, id), -1)
eq(f.findIndexRight([], id),        -1)
eq(f.findIndexRight([10, NaN, 20, NaN, 30], Number.isNaN), 3)
f.findIndexRight(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['two', 1, 10, 20, 30], ['one', 0, 10, 20, 30]])
throws(f.findIndexRight)
throws(f.findIndexRight, [])
throws(f.findIndexRight, 'not list', id)
throws(f.findIndexRight, {'not list': true}, id)

eq(f.indexOf(),                           -1)
eq(f.indexOf([]),                         -1)
eq(f.indexOf([10, NaN, 20, NaN, 30], NaN), 1)
throws(f.indexOf, 'not list', 'n')
throws(f.indexOf, {'not list': true}, 'n')

eq(f.lastIndexOf(),                            -1)
eq(f.lastIndexOf([]),                          -1)
eq(f.lastIndexOf([10, NaN, 20, NaN, 30], NaN), 3)
throws(f.lastIndexOf, 'not list', 'n')
throws(f.lastIndexOf, {'not list': true}, 'n')

eq(f.includes(),                   false)
eq(f.includes([]),                 false)
eq(f.includes([10, NaN, 20], NaN), true)
throws(f.includes, 'not list', 'n')
throws(f.includes, {'not list': true}, 'n')

eq(f.procure(undefined, id),           undefined)
eq(f.procure([0, 10, 20], id),         10)
eq(f.procure([0, 0, 10, 100], double), 20)
eq(f.procure([0, 0, 10, 100], mul),    20)
f.procure(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.procure)
throws(f.procure, [])
throws(f.procure, 'not list', id)
throws(f.procure, {'not list': true}, id)

eq(f.every(undefined, id), true)
eq(f.every([], id),        true)
eq(f.every([10, NaN], id), false)
eq(f.every([10, 20], id),  true)
f.every(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30]])
throws(f.every)
throws(f.every, [])
throws(f.every, 'not list', id)
throws(f.every, {'not list': true}, id)

eq(f.some(undefined, id), false)
eq(f.some([], id),        false)
eq(f.some([0, NaN], id),  false)
eq(f.some([10, NaN], id), true)
f.some(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.some)
throws(f.some, [])
throws(f.some, 'not list', id)
throws(f.some, {'not list': true}, id)

eq(f.slice([]),                     [].slice())
eq(f.slice([10, 20], 1),            [10, 20].slice(1))
eq(f.slice([10, 20, 30, 40], 1, 3), [10, 20, 30, 40].slice(1, 3))
throws(f.slice, 'not list')
throws(f.slice, {'not list': true})

eq(f.append(undefined, 1), [1])
eq(f.append([1], 2),       [1, 2])
eq(f.append([1], [2]),     [1, [2]])
eq(f.append(args(1), 2),   [1, 2])
throws(f.append, 'not list', '!')
throws(f.append, {'not list': true}, '!')

eq(f.prepend(undefined, 1),    [1])
eq(f.prepend([1], 2),          [2, 1])
eq(f.prepend([1], [2]),        [[2], 1])
eq(f.prepend(args(1), 2),      [2, 1])
throws(f.prepend, 'not list', '!')
throws(f.prepend, {'not list': true}, '!')

eq(f.remove(),                    [])
eq(f.remove([10, NaN]),           [10, NaN])
eq(f.remove([10, NaN], NaN),      [10])
eq(f.remove([NaN, 10, NaN], NaN), [10, NaN])
throws(f.remove, 'not list', '!')
throws(f.remove, {'not list': true}, '!')

eq(f.adjoin(undefined, 10),  [10])
eq(f.adjoin([10], NaN),      [10, NaN])
eq(f.adjoin([10, NaN], NaN), [10, NaN])
throws(f.adjoin, 'not list', 10)
throws(f.adjoin, {'not list': true}, 10)

eq(f.toggle(),               [undefined])
eq(f.toggle([10], NaN),      [10, NaN])
eq(f.toggle([10, NaN], NaN), [10])
throws(f.toggle, 'not list', 10)
throws(f.toggle, {'not list': true}, 10)

eq(f.insertAt([], 0),                      [undefined])
eq(f.insertAt(undefined, 0, 10),           [10])
eq(f.insertAt(['one', 'three'], 1, 'two'), ['one', 'two', 'three'])
eq(f.insertAt(['one', 'two'], 2, 'three'), ['one', 'two', 'three'])
throws(f.insertAt, 'not list', 0)
throws(f.insertAt, {'not list': true}, 0)

eq(f.replaceAt(undefined, 0, 'one'),        ['one'])
eq(f.replaceAt([], 0, 'one'),               ['one'])
eq(f.replaceAt(['one', 'three'], 1, 'two'), ['one', 'two'])
eq(f.replaceAt(['one', 'two'], 2, 'three'), ['one', 'two', 'three'])
throws(f.replaceAt, 'not list', 0, 'one')
throws(f.replaceAt, {'not list': true}, 0, 'one')

eq(f.removeAt(undefined, 0),        [])
eq(f.removeAt([NaN, 10, NaN], 0),   [10, NaN])
eq(f.removeAt([NaN, 10, NaN], 1),   [NaN, NaN])
eq(f.removeAt([NaN, 10, NaN], 10),  [NaN, 10, NaN])
eq(f.removeAt([NaN, 10, NaN], -1),  [NaN, 10, NaN])
throws(f.removeAt, 'not list', 0)
throws(f.removeAt, {'not list': true}, 0)

eq(f.concat(),                 [])
eq(f.concat([]),               [])
eq(f.concat([], []),           [])
eq(f.concat([], [], []),       [])
eq(f.concat([10], [20]),       [10, 20])
eq(f.concat([10], [20], [30]), [10, 20, 30])
eq(f.concat([10], [[20]]),     [10, [20]])
eq(f.concat([10], args(20)),   [10, 20])
throws(f.concat, [10], 'not list')
throws(f.concat, [10], {'not list': true})

eq(f.flat(),                       [])
eq(f.flat([10, [20], [[30]]]),     [10, 20, [30]])
eq(f.flat(args(10, [20], [[30]])), [10, 20, [30]])
throws(f.flat, 'not list')
throws(f.flat, {'not list': true})

eq(f.flatDeep(),                                 [])
eq(f.flatDeep([10, [20], [[30]]]),               [10, 20, 30])
eq(f.flatDeep(args(10, [20], [[30]])),           [10, 20, 30])
throws(f.flatDeep, 'not list')
throws(f.flatDeep, {'not list': true})

eq(f.head(),             undefined)
eq(f.head([10, 20]),     10)
eq(f.head(args(10, 20)), 10)
throws(f.head, 'not list')
throws(f.head, {'not list': true})

eq(f.tail(),             [])
eq(f.tail([10, 20]),     [20])
eq(f.tail(args(10, 20)), [20])
throws(f.tail, 'not list')
throws(f.tail, {'not list': true})

eq(f.init(),             [])
eq(f.init([10, 20]),     [10])
eq(f.init(args(10, 20)), [10])
throws(f.init, 'not list')
throws(f.init, {'not list': true})

eq(f.last(),             undefined)
eq(f.last([10, 20]),     20)
eq(f.last(args(10, 20)), 20)
throws(f.last, 'not list')
throws(f.last, {'not list': true})

eq(f.take(undefined, 0),       [])
eq(f.take([], 0),              [])
eq(f.take([10, 20], 0),        [])
eq(f.take([10, 20], 1),        [10])
eq(f.take([10, 20], 2),        [10, 20])
eq(f.take([10, 20], 3),        [10, 20])
eq(f.take([10, 20], Infinity), [10, 20])
throws(f.take, 'not list', 0)
throws(f.take, [10, 20], -1)

eq(f.takeWhile(undefined,       f.False),  [])
eq(f.takeWhile([],              f.False),  [])
eq(f.takeWhile([10, 20, 0, 30], f.truthy), [10, 20])
eq(f.takeWhile([10, 20, 0, 30], f.falsy),  [])
throws(f.takeWhile)
throws(f.takeWhile, [])
throws(f.takeWhile, 'not list')
throws(f.takeWhile, 'not list', f.True)

eq(f.drop(undefined, 0),        [])
eq(f.drop([], 1),               [])
eq(f.drop([10, 20], 0),         [10, 20])
eq(f.drop([10, 20], 1),         [20])
eq(f.drop([10, 20], 2),         [])
eq(f.drop([10, 20], Infinity),  [])
throws(f.drop, 'not list', 0)
throws(f.drop, [10, 20], -1)

eq(f.dropWhile(undefined,       f.False),  [])
eq(f.dropWhile([],              f.False),  [])
eq(f.dropWhile([10, 20, 0, 30], f.truthy), [0, 30])
eq(f.dropWhile([10, 20, 0, 30], f.falsy),  [10, 20, 0, 30])
throws(f.dropWhile)
throws(f.dropWhile, [])
throws(f.dropWhile, 'not list')
throws(f.dropWhile, 'not list', f.True)

eq(f.count(undefined, f.True),            0)
eq(f.count([], f.True),                   0)
eq(f.count([10, 0, 20, 0, 30], f.truthy), 3)
eq(f.count([10, 0, 20, 0, 30], f.falsy),  2)
throws(f.count)
throws(f.count, [])
throws(f.count, 'not list')
throws(f.count, 'not list', f.True)

eq(f.countWhile(undefined, f.True),             0)
eq(f.countWhile([], f.True),                    0)
eq(f.countWhile([10, 20, 30, 0, 40], f.truthy), 3)
eq(f.countWhile([10, 20, 30, 0, 40], f.falsy),  0)
throws(f.countWhile)
throws(f.countWhile, [])
throws(f.countWhile, 'not list')
throws(f.countWhile, 'not list', f.True)

eq(f.times(0, f.id),           [])
eq(f.times(2, arglist),        [[undefined, 0], [undefined, 1]])
eq(f.times(2, arglist, 'val'), [[undefined, 0, 'val'], [undefined, 1, 'val']])
throws(f.times)
throws(f.times, 0)
throws(f.times, [])
throws(f.times, [], f.id)
throws(f.times, 'not number')
throws(f.times, 'not number', f.id)
throws(f.times, '10', f.id)

eq(f.reverse(),                     [])
eq(f.reverse([10, 20]),             [20, 10])
eq(f.reverse([[10, 20], [30, 40]]), [[30, 40], [10, 20]])
throws(f.reverse, 'not list')
throws(f.reverse, {'not list': true})

eq(f.sort(), [])
// That's stupid JS sorting for you
eq(f.sort([3, 22, 111]), [111, 22, 3])
eq(f.sort([111, 22, 3], sub), [3, 22, 111])
throws(f.sort, 'not list')
throws(f.sort, {'not list': true})

eq(f.sortBy(undefined, id), [])
eq(
  f.sortBy([{id: 3}, {id: 22}, {id: 111}], x => x.id),
  [{id: 111}, {id: 22}, {id: 3}],
)
f.sortBy(['arg', 'arg'], stash, 10, 20, 30)
eq(unstash(), [['arg', 10, 20, 30, undefined], ['arg', 10, 20, 30, undefined]])
throws(f.sortBy)
throws(f.sortBy, [])
throws(f.sortBy, 'not list', id)
throws(f.sortBy, {'not list': true}, id)

eq(f.intersect(), [])
eq(f.intersect([10], undefined), [])
eq(f.intersect(undefined, [10]), [])
eq(f.intersect([10], [20]), [])
eq(f.intersect([10, 20], [20, 30]), [20])
eq(f.intersect([10, 20, 30], [20, 30, 40]), [20, 30])
eq(f.intersect([10, 10], [10, 10]), [10])
throws(f.intersect, [], 'not list')

eq(f.keyBy(undefined, id), {})
eq(f.keyBy([10, 20], id), {10: 10, 20: 20})
eq(
  f.keyBy(['one', null, undefined, 20, {}, NaN], id),
  {one: 'one', 20: 20},
)
f.keyBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.keyBy)
throws(f.keyBy, [])
throws(f.keyBy, 'not list', id)
throws(f.keyBy, {'not list': true}, id)

eq(f.groupBy(undefined, id), {})
eq(f.groupBy([], id), {})
eq(f.groupBy([10, 20, 20], id), {10: [10], 20: [20, 20]})
eq(
  f.groupBy(['one', null, undefined, 20, {}, NaN], id),
  {one: ['one'], 20: [20]},
)
f.groupBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.groupBy)
throws(f.groupBy, [])
throws(f.groupBy, 'not list', id)
throws(f.groupBy, {'not list': true}, id)

eq(f.uniq(), [])
eq(f.uniq([]), [])
eq(f.uniq([10, 10, 20, 20]), [10, 20])
throws(f.uniq, 'not list')
throws(f.uniq, {'not list': true})

eq(f.uniqBy(undefined, id), [])
eq(f.uniqBy([], id), [])
eq(f.uniqBy([10, 10, 20, 20], id), [10, 20])
f.uniqBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.uniqBy)
throws(f.uniqBy, [])
throws(f.uniqBy, 'not list', id)
throws(f.uniqBy, {'not list': true}, id)

eq(f.partition(undefined, id), [[], []])
eq(f.partition([], id), [[], []])
eq(
  f.partition([10, undefined, 20, NaN, 30], id),
  [[10, 20, 30], [undefined, NaN]],
)
f.partition(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.partition)
throws(f.partition, [])
throws(f.partition, 'not list', id)
throws(f.partition, {'not list': true}, id)

eq(f.sum(), 0)
eq(f.sum([]), 0)
eq(f.sum([10, 20, null, NaN, [], '', '5']), 30)
throws(f.sum, 'not list')
throws(f.sum, {'not list': true})

eq(f.sumBy(undefined, id), 0)
eq(f.sumBy([], id), 0)
eq(f.sumBy([10, 20, null, NaN, [], '', '5'], id), 30)
eq(f.sumBy([{id: 10}, {id: 20}], x => x.id), 30)
f.sumBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.sumBy)
throws(f.sumBy, [])
throws(f.sumBy, 'not list', id)
throws(f.sumBy, {'not list': true}, id)

eq(f.min(), undefined)
eq(f.min([]), undefined)
eq(f.min([null, '', '10']), undefined)
eq(f.min([20, NaN, 10, 'blah']), 10)
throws(f.min, 'not list')
throws(f.min, {'not list': true})

eq(f.max(), undefined)
eq(f.max([]), undefined)
eq(f.max([null, '', '10']), undefined)
eq(f.max([10, NaN, 20, 'blah']), 20)
throws(f.max, 'not list')
throws(f.max, {'not list': true})

eq(f.minBy(undefined, id), undefined)
eq(f.minBy([], id), undefined)
eq(f.minBy([null, '', '10'], id), undefined)
eq(f.minBy([20, NaN, 10, 'blah'], id), 10)
eq(f.minBy([{id: 20}, {id: 10}], x => x.id), 10)
f.minBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.minBy)
throws(f.minBy, [])
throws(f.minBy, 'not list', id)
throws(f.minBy, {'not list': true}, id)

eq(f.maxBy(undefined, id), undefined)
eq(f.maxBy([], id), undefined)
eq(f.maxBy([null, '', '10'], id), undefined)
eq(f.maxBy([20, NaN, 10, 'blah'], id), 20)
eq(f.maxBy([{id: 10}, {id: 20}], x => x.id), 20)
f.maxBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.maxBy)
throws(f.maxBy, [])
throws(f.maxBy, 'not list', id)
throws(f.maxBy, {'not list': true}, id)

eq(f.findMinBy(undefined, id), undefined)
eq(f.findMinBy([], id), undefined)
eq(f.findMinBy([null, '', '10'], id), undefined)
eq(f.findMinBy([20, NaN, 10, 'blah'], id), 10)
eq(f.findMinBy([{id: 20}, {id: 10}], x => x.id), {id: 10})
f.findMinBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.findMinBy)
throws(f.findMinBy, [])
throws(f.findMinBy, 'not list', id)
throws(f.findMinBy, {'not list': true}, id)

eq(f.findMaxBy(undefined, id), undefined)
eq(f.findMaxBy([], id), undefined)
eq(f.findMaxBy([null, '', '10'], id), undefined)
eq(f.findMaxBy([20, NaN, 10, 'blah'], id), 20)
eq(f.findMaxBy([{id: 10}, {id: 20}], x => x.id), {id: 20})
f.findMaxBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])
throws(f.findMaxBy)
throws(f.findMaxBy, [])
throws(f.findMaxBy, 'not list', id)
throws(f.findMaxBy, {'not list': true}, id)

eq(f.range(0, 0), [])
eq(f.range(5, 5), [])
eq(f.range(-5, 0), [-5, -4, -3, -2, -1])
eq(f.range(0, 5), [0, 1, 2, 3, 4])
eq(f.range(-2, 3), [-2, -1, 0, 1, 2])
throws(f.range, undefined, 0)
throws(f.range, 0, undefined)

eq(f.zip(),                               {})
eq(f.zip([]),                             {})
eq(f.zip([['one', 10]]),                  {one: 10})
eq(f.zip([['one', 10], ['two', 20]]),     {one: 10, two: 20})
eq(f.zip([[undefined, 10], ['one', 20]]), {one: 20})
throws(f.zip, {})
throws(f.zip, 'not list')
throws(f.zip, new String('not list'))
throws(f.zip, [[new String('not key'), 10]])
