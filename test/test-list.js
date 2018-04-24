'use strict'

const {eq} = require('./utils')
const f = require('../dist/fpx')

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
function pairs(acc, val, key) {return join(acc, [val, key])}
function pair(a, b) {return [a, b]}
function double(a) {return a * 2}

eq(f.each(), undefined)
f.each(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.fold(undefined, 1, join),  1)
eq(f.fold([], undefined, join), undefined)
eq(f.fold([1, 2, 3], [], join), join(join(join([], 1), 2), 3))
eq(f.fold([10, 20], [], pairs), pairs(pairs([], 10, 0), 20, 1))
eq(f.fold('one', [], id),       [])
f.fold(['one', 'two'], NaN, foldStash, 10, 20, 30)
eq(unstash(), [[NaN, 'one', 0, 10, 20, 30], [undefined, 'two', 1, 10, 20, 30]])

eq(f.foldRight(undefined, 1, join),  1)
eq(f.foldRight([], undefined, join), undefined)
eq(f.foldRight([1, 2, 3], [], join), join(join(join([], 3), 2), 1))
eq(f.foldRight([10, 20], [], pairs), pairs(pairs([], 20, 1), 10, 0))
eq(f.foldRight('one', [], id),       [])
f.foldRight(['one', 'two'], NaN, foldStash, 10, 20, 30)
eq(unstash(), [[NaN, 'two', 1, 10, 20, 30], [undefined, 'one', 0, 10, 20, 30]])

eq(f.map(undefined, id), [])
eq(f.map([], id),        [])
eq(f.map('one', id),     [])
eq(f.map([10, 20], pair), [[10, 0], [20, 1]])
f.map(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.flatMap(undefined, id), [])
eq(f.flatMap([], id), [])
eq(f.flatMap('one', id), [])
eq(f.flatMap([10, 20], pair), [10, 0, 20, 1])
eq(f.flatMap([10, [20]], pair), [10, 0, [20], 1])
f.flatMap(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.flatMapDeep(undefined, id), [])
eq(f.flatMapDeep([], id), [])
eq(f.flatMapDeep('one', id), [])
eq(f.flatMapDeep([10, 20], pair), [10, 0, 20, 1])
eq(f.flatMapDeep([[10], [[20]]], pair), [10, 0, 20, 1])
f.flatMapDeep(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.mapFilter(undefined, id), [])
eq(f.mapFilter([], id), [])
eq(f.mapFilter('one', id), [])
eq(f.mapFilter([10, 0, 'one', ''], id), [10, 'one'])
f.mapFilter(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.filter(undefined, id),      [])
eq(f.filter([], id),             [])
eq(f.filter([1, 0, 2, ''], id),  [1, 2])
eq(f.filter([1, 0, 2, ''], neg), [0, ''])
eq(f.filter('one', id),          [])
f.filter(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.reject(undefined, id),      [])
eq(f.reject([], id),             [])
eq(f.reject([1, 0, 2, ''], id),  [0, ''])
eq(f.reject([1, 0, 2, ''], neg), [1, 2])
eq(f.reject('one', neg),         [])
f.reject(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.compact(undefined), [])
eq(f.compact([10, 0, 'one', '']), [10, 'one'])
eq(f.compact('blah'), [])

eq(f.find(undefined, id),             undefined)
eq(f.find([], id),                    undefined)
eq(f.find('one', id),                 undefined)
eq(f.find([1, NaN, 2], Number.isNaN), NaN)
f.find(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.findRight(undefined, id),               undefined)
eq(f.findRight([], id),                      undefined)
eq(f.findRight('one', id),                   undefined)
eq(f.findRight([[10], [20]], Array.isArray), [20])
f.findRight(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['two', 1, 10, 20, 30], ['one', 0, 10, 20, 30]])

eq(f.findIndex(undefined, id), -1)
eq(f.findIndex([], id),        -1)
eq(f.findIndex('one', id),     -1)
eq(f.findIndex([10, NaN, 20, NaN, 30], Number.isNaN), 1)
f.findIndex(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.findIndexRight(undefined, id), -1)
eq(f.findIndexRight([], id),        -1)
eq(f.findIndexRight('one', id),     -1)
eq(f.findIndexRight([10, NaN, 20, NaN, 30], Number.isNaN), 3)
f.findIndexRight(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['two', 1, 10, 20, 30], ['one', 0, 10, 20, 30]])

eq(f.indexOf(),                           -1)
eq(f.indexOf([]),                         -1)
eq(f.indexOf('one', 'o'),                 -1)
eq(f.indexOf([10, NaN, 20, NaN, 30], NaN), 1)

eq(f.lastIndexOf(),                            -1)
eq(f.lastIndexOf([]),                          -1)
eq(f.lastIndexOf('one', 'o'),                  -1)
eq(f.lastIndexOf([10, NaN, 20, NaN, 30], NaN), 3)

eq(f.includes(),                   false)
eq(f.includes([]),                 false)
eq(f.includes([10, NaN, 20], NaN), true)
eq(f.includes('one', 'o'),         false)

eq(f.procure(undefined, id),           undefined)
eq(f.procure([0, 10, 20], id),         10)
// eq(f.procure([10, 20], arglist),       [10, 0])
eq(f.procure([0, 0, 10, 100], double), 20)
eq(f.procure([0, 0, 10, 100], mul),    20)
f.procure(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.every(undefined, id), true)
eq(f.every([], id),        true)
eq(f.every([10, NaN], id), false)
eq(f.every([10, 20], id),  true)
eq(f.every('blah', id),    true)
f.every(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30]])

eq(f.some(undefined, id), false)
eq(f.some([], id),        false)
eq(f.some([0, NaN], id),  false)
eq(f.some([10, NaN], id), true)
eq(f.some('blah', id),    false)
f.some(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.slice([]),                     [].slice())
eq(f.slice([10, 20], 1),            [10, 20].slice(1))
eq(f.slice([10, 20, 30, 40], 1, 3), [10, 20, 30, 40].slice(1, 3))
eq(f.slice('one'),                  [])

eq(f.append(undefined, 1), [1])
eq(f.append([1], 2),       [1, 2])
eq(f.append([1], [2]),     [1, [2]])
eq(f.append(args(1), 2),   [1, 2])
eq(f.append('one', '!'),   ['!'])

eq(f.prepend(undefined, 1),    [1])
eq(f.prepend([1], 2),          [2, 1])
eq(f.prepend([1], [2]),        [[2], 1])
eq(f.prepend(args(1), 2),      [2, 1])
eq(f.prepend('not list', '!'), ['!'])

eq(f.remove(),                    [])
eq(f.remove([10, NaN]),           [10, NaN])
eq(f.remove([10, NaN], NaN),      [10])
eq(f.remove([NaN, 10, NaN], NaN), [10, NaN])
eq(f.remove('not list', '!'),     [])

eq(f.insertAtIndex([], 0),                      [undefined])
eq(f.insertAtIndex(['one', 'three'], 1, 'two'), ['one', 'two', 'three'])
eq(f.insertAtIndex(['one', 'two'], 2, 'three'), ['one', 'two', 'three'])

eq(f.removeAtIndex(undefined, 0),        [])
eq(f.removeAtIndex([NaN, 10, NaN], 0),   [10, NaN])
eq(f.removeAtIndex([NaN, 10, NaN], 1),   [NaN, NaN])
eq(f.removeAtIndex([NaN, 10, NaN], 10),  [NaN, 10, NaN])
eq(f.removeAtIndex([NaN, 10, NaN], -1),  [NaN, 10, NaN])
eq(f.removeAtIndex('not list', 0),       [])

eq(f.adjoin(undefined, 10),  [10])
eq(f.adjoin([10], NaN),      [10, NaN])
eq(f.adjoin([10, NaN], NaN), [10, NaN])
eq(f.adjoin('not list', 10), [10])

eq(f.toggle(),               [undefined])
eq(f.toggle([10], NaN),      [10, NaN])
eq(f.toggle([10, NaN], NaN), [10])
eq(f.toggle('not list', 10), [10])

eq(f.concat(),                 [])
eq(f.concat([]),               [])
eq(f.concat([], []),           [])
eq(f.concat([], [], []),       [])
eq(f.concat([10], '20'),       [10])
eq(f.concat(10, 20),           [])
eq(f.concat([10], 20),         [10])
eq(f.concat([10], [20]),       [10, 20])
eq(f.concat([10], [20], 30),   [10, 20])
eq(f.concat([10], [20], [30]), [10, 20, 30])
eq(f.concat([10], [[20]]),     [10, [20]])
eq(f.concat([10], args(20)),   [10, 20])

eq(f.flatten(),                                 [])
eq(f.flatten('one'),                            [])
eq(f.flatten([10, [20], [[30]]]),               [10, 20, [30]])
eq(f.flatten(args(10, [20], [[30]])),           [10, 20, [30]])

eq(f.flattenDeep(),                                 [])
eq(f.flattenDeep('one'),                            [])
eq(f.flattenDeep([10, [20], [[30]]]),               [10, 20, 30])
eq(f.flattenDeep(args(10, [20], [[30]])),           [10, 20, 30])

eq(f.head(),             undefined)
eq(f.head('one'),        undefined)
eq(f.head([10, 20]),     10)
eq(f.head(args(10, 20)), 10)

eq(f.tail(),             [])
eq(f.tail('one'),        [])
eq(f.tail([10, 20]),     [20])
eq(f.tail(args(10, 20)), [20])

eq(f.init(),             [])
eq(f.init('one'),        [])
eq(f.init([10, 20]),     [10])
eq(f.init(args(10, 20)), [10])

eq(f.last(),             undefined)
eq(f.last('one'),        undefined)
eq(f.last([10, 20]),     20)
eq(f.last(args(10, 20)), 20)

eq(f.take(undefined, 0),       [])
eq(f.take([], 0),              [])
eq(f.take([10, 20], 0),        [])
eq(f.take([10, 20], 1),        [10])
eq(f.take([10, 20], 2),        [10, 20])
eq(f.take([10, 20], 3),        [10, 20])
eq(f.take([10, 20], Infinity), [10, 20])

eq(f.drop(undefined, 0),        [])
eq(f.drop(undefined, Infinity), [])
eq(f.drop([], 1),               [])
eq(f.drop([10, 20], 0),         [10, 20])
eq(f.drop([10, 20], 1),         [20])
eq(f.drop([10, 20], 2),         [])
eq(f.drop([10, 20], Infinity),  [])

eq(f.reverse(),                     [])
eq(f.reverse('one'),                [])
eq(f.reverse([10, 20]),             [20, 10])
eq(f.reverse([[10, 20], [30, 40]]), [[30, 40], [10, 20]])

eq(f.sort(), [])
eq(f.sort('one'), [])
// That's stupid JS sorting for you
eq(f.sort([3, 22, 111]), [111, 22, 3])
eq(f.sort([111, 22, 3], sub), [3, 22, 111])

eq(f.sortBy(undefined, id), [])
eq(f.sortBy('one', id), [])
eq(
  f.sortBy([{id: 3}, {id: 22}, {id: 111}], x => x.id),
  [{id: 111}, {id: 22}, {id: 3}]
)
f.sortBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 10, 20, 30, undefined], ['two', 10, 20, 30, undefined]])

eq(f.intersection(), [])
eq(f.intersection([10], undefined), [])
eq(f.intersection(undefined, [10]), [])
eq(f.intersection([10], [20]), [])
eq(f.intersection([10, 20], [20, 30]), [20])
eq(f.intersection([10, 20, 30], [20, 30, 40]), [20, 30])
eq(f.intersection([10, 10], [10, 10]), [10])

eq(f.keyBy(undefined, id), {})
eq(f.keyBy('one', id), {})
eq(f.keyBy([10, 20], id), {10: 10, 20: 20})
eq(
  f.keyBy(['one', null, undefined, 20, {}, NaN], id),
  {one: 'one', 20: 20}
)
f.keyBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.groupBy(undefined, id), {})
eq(f.groupBy('one', id), {})
eq(f.groupBy([], id), {})
eq(f.groupBy([10, 20, 20], id), {10: [10], 20: [20, 20]})
eq(
  f.groupBy(['one', null, undefined, 20, {}, NaN], id),
  {one: ['one'], 20: [20]}
)
f.groupBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.uniq(), [])
eq(f.uniq('one'), [])
eq(f.uniq([]), [])
eq(f.uniq([10, 10, 20, 20]), [10, 20])

eq(f.uniqBy(undefined, id), [])
eq(f.uniqBy('one', id), [])
eq(f.uniqBy([], id), [])
eq(f.uniqBy([10, 10, 20, 20], id), [10, 20])
f.uniqBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.partition(undefined, id), [[], []])
eq(f.partition('one', id), [[], []])
eq(f.partition([], id), [[], []])
eq(
  f.partition([10, undefined, 20, NaN, 30], id),
  [[10, 20, 30], [undefined, NaN]]
)
f.partition(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.sum(), 0)
eq(f.sum('123'), 0)
eq(f.sum({one: 10}), 0)
eq(f.sum([]), 0)
eq(f.sum([10, 20, null, NaN, [], '', '5']), 30)

eq(f.sumBy(undefined, id), 0)
eq(f.sumBy('123', id), 0)
eq(f.sumBy({one: 10}, id), 0)
eq(f.sumBy([], id), 0)
eq(f.sumBy([10, 20, null, NaN, [], '', '5'], id), 30)
eq(f.sumBy([{id: 10}, {id: 20}], x => x.id), 30)
f.sumBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.min(), undefined)
eq(f.min('123'), undefined)
eq(f.min({one: 10}), undefined)
eq(f.min([]), undefined)
eq(f.min([null, '', '10']), undefined)
eq(f.min([20, NaN, 10, 'blah']), 10)

eq(f.max(), undefined)
eq(f.max('123'), undefined)
eq(f.max({one: 10}), undefined)
eq(f.max([]), undefined)
eq(f.max([null, '', '10']), undefined)
eq(f.max([10, NaN, 20, 'blah']), 20)

eq(f.minBy(undefined, id), undefined)
eq(f.minBy('123', id), undefined)
eq(f.minBy({one: 10}, id), undefined)
eq(f.minBy([], id), undefined)
eq(f.minBy([null, '', '10'], id), undefined)
eq(f.minBy([20, NaN, 10, 'blah'], id), 10)
eq(f.minBy([{id: 20}, {id: 10}], x => x.id), 10)
f.minBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.maxBy(undefined, id), undefined)
eq(f.maxBy('123', id), undefined)
eq(f.maxBy({one: 10}, id), undefined)
eq(f.maxBy([], id), undefined)
eq(f.maxBy([null, '', '10'], id), undefined)
eq(f.maxBy([20, NaN, 10, 'blah'], id), 20)
eq(f.maxBy([{id: 10}, {id: 20}], x => x.id), 20)
f.maxBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.findMinBy(undefined, id), undefined)
eq(f.findMinBy('123', id), undefined)
eq(f.findMinBy({one: 10}, id), undefined)
eq(f.findMinBy([], id), undefined)
eq(f.findMinBy([null, '', '10'], id), undefined)
eq(f.findMinBy([20, NaN, 10, 'blah'], id), 10)
eq(f.findMinBy([{id: 20}, {id: 10}], x => x.id), {id: 10})
f.findMinBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.findMaxBy(undefined, id), undefined)
eq(f.findMaxBy('123', id), undefined)
eq(f.findMaxBy({one: 10}, id), undefined)
eq(f.findMaxBy([], id), undefined)
eq(f.findMaxBy([null, '', '10'], id), undefined)
eq(f.findMaxBy([20, NaN, 10, 'blah'], id), 20)
eq(f.findMaxBy([{id: 10}, {id: 20}], x => x.id), {id: 20})
f.findMaxBy(['one', 'two'], stash, 10, 20, 30)
eq(unstash(), [['one', 0, 10, 20, 30], ['two', 1, 10, 20, 30]])

eq(f.range(0, 0), [])
eq(f.range(5, 5), [])
eq(f.range(-5, 0), [-5, -4, -3, -2, -1])
eq(f.range(0, 5), [0, 1, 2, 3, 4])
eq(f.range(-2, 3), [-2, -1, 0, 1, 2])
