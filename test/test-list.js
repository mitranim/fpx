'use strict'

const {eq} = require('./utils')
const fpx = require('../dist/fpx')

function join    (a, b)          {return a.concat([b])}
function add     (a, b)          {return a + b}
function mul     (a, b)          {return a * b}
function id      (a)             {return a}
function args    ()              {return arguments}
function pairs   (acc, val, key) {return join(acc, [val, key])}
function arglist (...args)       {return args}
function double  (a)             {return a * 2}

eq(fpx.list(),           [])
eq(fpx.list(1, ['one']), [1, ['one']])
eq(fpx.list('one'),      ['one'])

// eq(fpx.foldl(undefined, join, 1),  1)
// eq(fpx.foldl([], join, undefined), undefined)
// eq(fpx.foldl([1, 2, 3], join, []), join(join(join([], 1), 2), 3))
// eq(fpx.foldl([10, 20], pairs, []), pairs(pairs([], 10, 0), 20, 1))
// eq(fpx.foldl('one', id, []),       [])

eq(fpx.foldl(undefined, 1, join),  1)
eq(fpx.foldl([], undefined, join), undefined)
eq(fpx.foldl([1, 2, 3], [], join), join(join(join([], 1), 2), 3))
eq(fpx.foldl([10, 20], [], pairs), pairs(pairs([], 10, 0), 20, 1))
eq(fpx.foldl('one', [], id),       [])

// eq(fpx.foldr(undefined, join, 1),  1)
// eq(fpx.foldr([], join, undefined), undefined)
// eq(fpx.foldr([1, 2, 3], join, []), join(join(join([], 3), 2), 1))
// eq(fpx.foldr([10, 20], pairs, []), pairs(pairs([], 20, 1), 10, 0))
// eq(fpx.foldr('one', id, []),       [])

eq(fpx.foldr(undefined, 1, join),  1)
eq(fpx.foldr([], undefined, join), undefined)
eq(fpx.foldr([1, 2, 3], [], join), join(join(join([], 3), 2), 1))
eq(fpx.foldr([10, 20], [], pairs), pairs(pairs([], 20, 1), 10, 0))
eq(fpx.foldr('one', [], id),       [])

eq(fpx.map(undefined, id), [])
eq(fpx.map([], id),        [])
eq(fpx.map([10, 20], add), [add(10, 0), add(20, 1)])
eq(fpx.map('one', id),     [])

eq(fpx.filter(undefined, id),     [])
eq(fpx.filter([], id),            [])
eq(fpx.filter([1, 0, 2, ''], id), [1, 2])
eq(fpx.filter('one', id),         [])

eq(fpx.find(undefined, id),             undefined)
eq(fpx.find([], id),                    undefined)
eq(fpx.find([1, NaN, 2], Number.isNaN), NaN)
eq(fpx.find('one', Boolean),            undefined)

eq(fpx.every(undefined, id), true)
eq(fpx.every([], id),        true)
eq(fpx.every([10, NaN], id), false)
eq(fpx.every([10, 20], id),  true)
eq(fpx.every('blah', id),    true)

eq(fpx.some(undefined, id), false)
eq(fpx.some([], id),        false)
eq(fpx.some([0, NaN], id),  false)
eq(fpx.some([10, NaN], id), true)
eq(fpx.some('blah', id),    false)

eq(fpx.procure(undefined, id),           undefined)
eq(fpx.procure([0, 10, 20], id),         10)
eq(fpx.procure([10, 20], arglist),       [10, 0])
eq(fpx.procure([0, 0, 10, 100], double), 20)
eq(fpx.procure([0, 0, 10, 100], mul),    20)

eq(fpx.includes(),                   false)
eq(fpx.includes([]),                 false)
eq(fpx.includes([10, NaN, 20], NaN), true)
eq(fpx.includes('one', 'o'),         false)

eq(fpx.indexOf(),                   -1)
eq(fpx.indexOf([]),                 -1)
eq(fpx.indexOf([10, NaN, 20], NaN), 1)
eq(fpx.indexOf('one', 'o'),         -1)

eq(fpx.slice([]),                     [].slice())
eq(fpx.slice([10, 20], 1),            [10, 20].slice(1))
eq(fpx.slice([10, 20, 30, 40], 1, 3), [10, 20, 30, 40].slice(1, 3))
eq(fpx.slice('one'),                  ['o', 'n', 'e'])

eq(fpx.append(undefined, 1), [1])
eq(fpx.append([1], 2),       [1, 2])
eq(fpx.append([1], [2]),     [1, [2]])
eq(fpx.append(args(1), 2),   [1, 2])
eq(fpx.append('one', '!'),   ['!'])

eq(fpx.prepend(undefined, 1),    [1])
eq(fpx.prepend([1], 2),          [2, 1])
eq(fpx.prepend([1], [2]),        [[2], 1])
eq(fpx.prepend(args(1), 2),      [2, 1])
eq(fpx.prepend('not list', '!'), ['!'])

eq(fpx.remove(),                    [])
eq(fpx.remove([10, NaN]),           [10, NaN])
eq(fpx.remove([10, NaN], NaN),      [10])
eq(fpx.remove([NaN, 10, NaN], NaN), [10, NaN])
eq(fpx.remove('not list', '!'),     [])

eq(fpx.insertAtIndex([], 0),                      [undefined])
eq(fpx.insertAtIndex(['one', 'three'], 1, 'two'), ['one', 'two', 'three'])
eq(fpx.insertAtIndex(['one', 'two'], 2, 'three'), ['one', 'two', 'three'])

eq(fpx.removeAtIndex(undefined, 0),        [])
eq(fpx.removeAtIndex([NaN, 10, NaN], 0),   [10, NaN])
eq(fpx.removeAtIndex([NaN, 10, NaN], 1),   [NaN, NaN])
eq(fpx.removeAtIndex([NaN, 10, NaN], 10),  [NaN, 10, NaN])
eq(fpx.removeAtIndex([NaN, 10, NaN], -1),  [NaN, 10, NaN])
eq(fpx.removeAtIndex('not list', 0),       [])

eq(fpx.adjoin(undefined, 10),  [10])
eq(fpx.adjoin([10], NaN),      [10, NaN])
eq(fpx.adjoin([10, NaN], NaN), [10, NaN])
eq(fpx.adjoin('not list', 10), [10])

eq(fpx.toggle(),               [undefined])
eq(fpx.toggle([10], NaN),      [10, NaN])
eq(fpx.toggle([10, NaN], NaN), [10])
eq(fpx.toggle('not list', 10), [10])

eq(fpx.concat(),                 [])
eq(fpx.concat([]),               [])
eq(fpx.concat([], []),           [])
eq(fpx.concat([], [], []),       [])
eq(fpx.concat([10], '20'),       [10])
eq(fpx.concat(10, 20),           [])
eq(fpx.concat([10], 20),         [10])
eq(fpx.concat([10], [20]),       [10, 20])
eq(fpx.concat([10], [20], 30),   [10, 20])
eq(fpx.concat([10], [20], [30]), [10, 20, 30])
eq(fpx.concat([10], [[20]]),     [10, [20]])
eq(fpx.concat([10], args(20)),   [10, 20])

eq(fpx.flat(),                                 [])
eq(fpx.flat([[1], [['one']]]),                 [1, 'one'])
eq(fpx.flat(args(args(1), args(args('one')))), [1, 'one'])
eq(fpx.flat('one'),                            [])
eq(fpx.flat(['one']),                          ['one'])

eq(fpx.head(),             undefined)
eq(fpx.head([10, 20]),     10)
eq(fpx.head(args(10, 20)), 10)
eq(fpx.head('one'),        undefined)

eq(fpx.tail(),             [])
eq(fpx.tail([10, 20]),     [20])
eq(fpx.tail(args(10, 20)), [20])
eq(fpx.tail('one'),        [])

eq(fpx.init(),             [])
eq(fpx.init([10, 20]),     [10])
eq(fpx.init(args(10, 20)), [10])
eq(fpx.init('one'),        [])

eq(fpx.last(),             undefined)
eq(fpx.last([10, 20]),     20)
eq(fpx.last(args(10, 20)), 20)
eq(fpx.last('one'),        undefined)

eq(fpx.take(undefined, 0),       [])
eq(fpx.take([], 0),              [])
eq(fpx.take([10, 20], 0),        [])
eq(fpx.take([10, 20], 1),        [10])
eq(fpx.take([10, 20], 2),        [10, 20])
eq(fpx.take([10, 20], 3),        [10, 20])
eq(fpx.take([10, 20], Infinity), [10, 20])

eq(fpx.drop(undefined, 0),        [])
eq(fpx.drop(undefined, Infinity), [])
eq(fpx.drop([], 1),               [])
eq(fpx.drop([10, 20], 0),         [10, 20])
eq(fpx.drop([10, 20], 1),         [20])
eq(fpx.drop([10, 20], 2),         [])
eq(fpx.drop([10, 20], Infinity),  [])

eq(fpx.reverse(),                     [])
eq(fpx.reverse([10, 20]),             [20, 10])
eq(fpx.reverse([[10, 20], [30, 40]]), [[30, 40], [10, 20]])
eq(fpx.reverse('one'),                [])
