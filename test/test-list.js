'use strict'

const {eq} = require('./utils')
const f = require('../dist/fpx')

function join    (a, b)          {return a.concat([b])}
function add     (a, b)          {return a + b}
function mul     (a, b)          {return a * b}
function id      (a)             {return a}
function args    ()              {return arguments}
function pairs   (acc, val, key) {return join(acc, [val, key])}
function arglist (...args)       {return args}
function double  (a)             {return a * 2}

eq(f.list(),           [])
eq(f.list(1, ['one']), [1, ['one']])
eq(f.list('one'),      ['one'])

// eq(f.foldl(undefined, join, 1),  1)
// eq(f.foldl([], join, undefined), undefined)
// eq(f.foldl([1, 2, 3], join, []), join(join(join([], 1), 2), 3))
// eq(f.foldl([10, 20], pairs, []), pairs(pairs([], 10, 0), 20, 1))
// eq(f.foldl('one', id, []),       [])

eq(f.foldl(undefined, 1, join),  1)
eq(f.foldl([], undefined, join), undefined)
eq(f.foldl([1, 2, 3], [], join), join(join(join([], 1), 2), 3))
eq(f.foldl([10, 20], [], pairs), pairs(pairs([], 10, 0), 20, 1))
eq(f.foldl('one', [], id),       [])

// eq(f.foldr(undefined, join, 1),  1)
// eq(f.foldr([], join, undefined), undefined)
// eq(f.foldr([1, 2, 3], join, []), join(join(join([], 3), 2), 1))
// eq(f.foldr([10, 20], pairs, []), pairs(pairs([], 20, 1), 10, 0))
// eq(f.foldr('one', id, []),       [])

eq(f.foldr(undefined, 1, join),  1)
eq(f.foldr([], undefined, join), undefined)
eq(f.foldr([1, 2, 3], [], join), join(join(join([], 3), 2), 1))
eq(f.foldr([10, 20], [], pairs), pairs(pairs([], 20, 1), 10, 0))
eq(f.foldr('one', [], id),       [])

eq(f.map(undefined, id), [])
eq(f.map([], id),        [])
eq(f.map([10, 20], add), [add(10, 0), add(20, 1)])
eq(f.map('one', id),     [])

eq(f.filter(undefined, id),     [])
eq(f.filter([], id),            [])
eq(f.filter([1, 0, 2, ''], id), [1, 2])
eq(f.filter('one', id),         [])

eq(f.find(undefined, id),             undefined)
eq(f.find([], id),                    undefined)
eq(f.find([1, NaN, 2], Number.isNaN), NaN)
eq(f.find('one', Boolean),            undefined)

eq(f.every(undefined, id), true)
eq(f.every([], id),        true)
eq(f.every([10, NaN], id), false)
eq(f.every([10, 20], id),  true)
eq(f.every('blah', id),    true)

eq(f.some(undefined, id), false)
eq(f.some([], id),        false)
eq(f.some([0, NaN], id),  false)
eq(f.some([10, NaN], id), true)
eq(f.some('blah', id),    false)

eq(f.procure(undefined, id),           undefined)
eq(f.procure([0, 10, 20], id),         10)
eq(f.procure([10, 20], arglist),       [10, 0])
eq(f.procure([0, 0, 10, 100], double), 20)
eq(f.procure([0, 0, 10, 100], mul),    20)

eq(f.includes(),                   false)
eq(f.includes([]),                 false)
eq(f.includes([10, NaN, 20], NaN), true)
eq(f.includes('one', 'o'),         false)

eq(f.indexOf(),                   -1)
eq(f.indexOf([]),                 -1)
eq(f.indexOf([10, NaN, 20], NaN), 1)
eq(f.indexOf('one', 'o'),         -1)

eq(f.slice([]),                     [].slice())
eq(f.slice([10, 20], 1),            [10, 20].slice(1))
eq(f.slice([10, 20, 30, 40], 1, 3), [10, 20, 30, 40].slice(1, 3))
eq(f.slice('one'),                  ['o', 'n', 'e'])

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

eq(f.flat(),                                 [])
eq(f.flat([[1], [['one']]]),                 [1, 'one'])
eq(f.flat(args(args(1), args(args('one')))), [1, 'one'])
eq(f.flat('one'),                            [])
eq(f.flat(['one']),                          ['one'])

eq(f.head(),             undefined)
eq(f.head([10, 20]),     10)
eq(f.head(args(10, 20)), 10)
eq(f.head('one'),        undefined)

eq(f.tail(),             [])
eq(f.tail([10, 20]),     [20])
eq(f.tail(args(10, 20)), [20])
eq(f.tail('one'),        [])

eq(f.init(),             [])
eq(f.init([10, 20]),     [10])
eq(f.init(args(10, 20)), [10])
eq(f.init('one'),        [])

eq(f.last(),             undefined)
eq(f.last([10, 20]),     20)
eq(f.last(args(10, 20)), 20)
eq(f.last('one'),        undefined)

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
eq(f.reverse([10, 20]),             [20, 10])
eq(f.reverse([[10, 20], [30, 40]]), [[30, 40], [10, 20]])
eq(f.reverse('one'),                [])
