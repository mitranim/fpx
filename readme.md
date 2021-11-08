## Overview

`fpx`: **F**unctional **P**rogramming e**X**tensions for JavaScript. Lightweight replacement for Lodash. Large amount of FP-oriented utility functions and type assertions. Stuff that should be built into the language.

Small, dependency-free, single file, native module.

## TOC

* [Usage](#usage)
* [Why](#why)
* [Performance](#performance)
* [API](#api)
  * [Var](#var)
    * [`const global`](#const-global)
  * [Bool](#bool)
    * [`function truthy`](#function-truthy)
    * [`function falsy`](#function-falsy)
    * [`function is`](#function-is)
    * [`function isNil`](#function-isnil)
    * [`function isSome`](#function-issome)
    * [`function isBool`](#function-isbool)
    * [`function isNum`](#function-isnum)
    * [`function isFin`](#function-isfin)
    * [`function isInt`](#function-isint)
    * [`function isNat`](#function-isnat)
    * [`function isNatPos`](#function-isnatpos)
    * [`function isNaN`](#function-isnan)
    * [`function isInf`](#function-isinf)
    * [`function isStr`](#function-isstr)
    * [`function isKey`](#function-iskey)
    * [`function isPrim`](#function-isprim)
    * [`function isComp`](#function-iscomp)
    * [`function isFun`](#function-isfun)
    * [`function isObj`](#function-isobj)
    * [`function isStruct`](#function-isstruct)
    * [`function isArr`](#function-isarr)
    * [`function isReg`](#function-isreg)
    * [`function isSym`](#function-issym)
    * [`function isDate`](#function-isdate)
    * [`function isValidDate`](#function-isvaliddate)
    * [`function isInvalidDate`](#function-isinvaliddate)
    * [`function isPromise`](#function-ispromise)
    * [`function isCls`](#function-iscls)
    * [`function isInst`](#function-isinst)
    * [`function isDict`](#function-isdict)
    * [`function isList`](#function-islist)
    * [`function isIter`](#function-isiter)
    * [`function isOpt`](#function-isopt)
    * [`function isListOf`](#function-islistof)
    * [`function isDictOf`](#function-isdictof)
    * [`function hasOwn`](#function-hasown)
    * [`function testBy`](#function-testby)
    * [`function test`](#function-test)
  * [Cast](#cast)
    * [`function prim`](#function-prim)
    * [`function bool`](#function-bool)
    * [`function num`](#function-num)
    * [`function fin`](#function-fin)
    * [`function int`](#function-int)
    * [`function nat`](#function-nat)
    * [`function natPos`](#function-natpos)
    * [`function str`](#function-str)
    * [`function list`](#function-list)
    * [`function arr`](#function-arr)
    * [`function dict`](#function-dict)
    * [`function struct`](#function-struct)
    * [`function comp`](#function-comp)
    * [`function toStr`](#function-tostr)
    * [`function toArr`](#function-toarr)
  * [Assert](#assert)
    * [`function req`](#function-req)
    * [`function opt`](#function-opt)
    * [`function reqInst`](#function-reqinst)
    * [`function optInst`](#function-optinst)
    * [`function reqEach`](#function-reqeach)
    * [`function reqEachVal`](#function-reqeachval)
  * [Fun](#fun)
    * [`function call`](#function-call)
    * [`function apply`](#function-apply)
    * [`function bind`](#function-bind)
    * [`function not`](#function-not)
    * [`function cwk`](#function-cwk)
  * [List](#list)
    * [`function len`](#function-len)
    * [`function hasLen`](#function-haslen)
    * [`function vacate`](#function-vacate)
    * [`function each`](#function-each)
    * [`function map`](#function-map)
    * [`function mapMut`](#function-mapmut)
    * [`function mapFlat`](#function-mapflat)
    * [`function mapFlatDeep`](#function-mapflatdeep)
    * [`function mapFilter`](#function-mapfilter)
    * [`function filter`](#function-filter)
    * [`function reject`](#function-reject)
    * [`function fold`](#function-fold)
    * [`function foldRight`](#function-foldright)
    * [`function fold1`](#function-fold1)
    * [`function compact`](#function-compact)
    * [`function find`](#function-find)
    * [`function findRight`](#function-findright)
    * [`function findIndex`](#function-findindex)
    * [`function findIndexRight`](#function-findindexright)
    * [`function indexOf`](#function-indexof)
    * [`function lastIndexOf`](#function-lastindexof)
    * [`function includes`](#function-includes)
    * [`function procure`](#function-procure)
    * [`function every`](#function-every)
    * [`function some`](#function-some)
    * [`function slice`](#function-slice)
    * [`function append`](#function-append)
    * [`function prepend`](#function-prepend)
    * [`function remove`](#function-remove)
    * [`function adjoin`](#function-adjoin)
    * [`function toggle`](#function-toggle)
    * [`function insertAt`](#function-insertat)
    * [`function replaceAt`](#function-replaceat)
    * [`function removeAt`](#function-removeat)
    * [`function concat`](#function-concat)
    * [`function flat`](#function-flat)
    * [`function flatDeep`](#function-flatdeep)
    * [`function head`](#function-head)
    * [`function tail`](#function-tail)
    * [`function init`](#function-init)
    * [`function last`](#function-last)
    * [`function take`](#function-take)
    * [`function takeWhile`](#function-takewhile)
    * [`function drop`](#function-drop)
    * [`function dropWhile`](#function-dropwhile)
    * [`function count`](#function-count)
    * [`function countWhile`](#function-countwhile)
    * [`function times`](#function-times)
    * [`function reverse`](#function-reverse)
    * [`function sort`](#function-sort)
    * [`function sortBy`](#function-sortby)
    * [`function sortCompare`](#function-sortcompare)
    * [`function intersect`](#function-intersect)
    * [`function keyBy`](#function-keyby)
    * [`function groupBy`](#function-groupby)
    * [`function uniq`](#function-uniq)
    * [`function uniqBy`](#function-uniqby)
    * [`function partition`](#function-partition)
    * [`function sum`](#function-sum)
    * [`function sumBy`](#function-sumby)
    * [`function min`](#function-min)
    * [`function max`](#function-max)
    * [`function minBy`](#function-minby)
    * [`function maxBy`](#function-maxby)
    * [`function findMinBy`](#function-findminby)
    * [`function findMaxBy`](#function-findmaxby)
    * [`function range`](#function-range)
    * [`function zip`](#function-zip)
  * [Struct](#struct)
    * [`function size`](#function-size)
    * [`function keys`](#function-keys)
    * [`function vals`](#function-vals)
    * [`function entries`](#function-entries)
    * [`function hasSize`](#function-hassize)
    * [`function eachVal`](#function-eachval)
    * [`function foldVals`](#function-foldvals)
    * [`function mapVals`](#function-mapvals)
    * [`function mapValsMut`](#function-mapvalsmut)
    * [`function mapKeys`](#function-mapkeys)
    * [`function mapValsSort`](#function-mapvalssort)
    * [`function pick`](#function-pick)
    * [`function omit`](#function-omit)
    * [`function pickKeys`](#function-pickkeys)
    * [`function omitKeys`](#function-omitkeys)
    * [`function findVal`](#function-findval)
    * [`function findKey`](#function-findkey)
    * [`function everyVal`](#function-everyval)
    * [`function someVal`](#function-someval)
    * [`function invert`](#function-invert)
    * [`function invertBy`](#function-invertby)
  * [Operator](#operator)
    * [`function neg`](#function-neg)
    * [`function add`](#function-add)
    * [`function sub`](#function-sub)
    * [`function mul`](#function-mul)
    * [`function div`](#function-div)
    * [`function rem`](#function-rem)
    * [`function lt`](#function-lt)
    * [`function gt`](#function-gt)
    * [`function lte`](#function-lte)
    * [`function gte`](#function-gte)
    * [`function inc`](#function-inc)
    * [`function dec`](#function-dec)
  * [Misc](#misc)
    * [`function vac`](#function-vac)
    * [`function True`](#function-true)
    * [`function False`](#function-false)
    * [`function nop`](#function-nop)
    * [`function id`](#function-id)
    * [`function di`](#function-di)
    * [`function val`](#function-val)
    * [`function rethrow`](#function-rethrow)
    * [`function get`](#function-get)
    * [`function scan`](#function-scan)
    * [`function getIn`](#function-getin)
    * [`function getter`](#function-getter)
    * [`function assign`](#function-assign)
    * [`function show`](#function-show)
* [Miscellaneous](#miscellaneous)

## Usage

```sh
npm i -E fpx
```

Fpx is a single file, a native JS module usable anywhere. In Node or with a bundler like Webpack or Esbuild:

```js
import * as f from 'fpx'
````

In browsers without a bundler, use either the following, or an importmap:

```js
import * as f from './node_modules/fpx/fpx.mjs'

import * as f from 'https://cdn.jsdelivr.net/npm/fpx@0.11.2/fpx.mjs'
```

## Why

Why a library: the built-ins are not sufficient. Fpx replaces some common code patterns with small functions, significantly reducing the code size. It also enables assertions that are desired but missing from most JS code.

### Size

Why not just use Lodash? It's way, **way**, **WAY** too huge. You just want a few functions and BAM, you get ≈ 73 KiB minified. You could make a custom bundle, but most folks just import the whole thing. For a web developer, shipping so much useless code to your users is irresponsible. It's also space-inefficient, bloated with avoidable code, and judging by the source, this seems unlikely to change. If you care about size, you need a replacement.

Last I checked, Lodash was incompatible with techniques like tree shaking / dead code elimination / live code inclusion, which pick just the functions you actually use, dropping the rest. These techniques work perfectly on Fpx. When using a module bundler that supports them, such as Esbuild or Webpack, you automatically get a "custom version" of Fpx without any unused stuff.

### Simplicity

> Programs must be written for people to read, and only incidentally for machines to execute.
>
> _— Abelson & Sussman, "Structure and Interpretation of Computer Programs"_

I believe that _all code_ should strive to be simple and educational. This gives me a massive distaste for most code ever written. For example, reading Lodash's source might teach you code obfuscation, but not much else.

In Fpx, I strive to keep the code and the algorithms dead simple, with as few unnecessary elements and indirections as possible. If you want to understand how this kind of library works, how higher-order functions work, how to manipulate JS data structures, Fpx should hopefully provide a good read.

### Strictness

Fpx functions tend to be somewhat stricter than their built-in counterparts, and _much_ stricter than the Lodash counterparts. They tend to work _either_ on lists ([`fold`](#function-fold)) _or_ dicts ([`foldVals`](#function-foldvals)), not both. Collection functions don't accept strings. This prevents subtle gotchas.

On the other hand, collection functions accept `null` and `undefined`, which is very useful in practice. This would not be possible with methods, since methods must be invoked on an object.

Unlike Lodash, higher-order functions always require an operator function. There's no implicit fallback on the identity function, and no implicit conversion of data patterns into functions.

### Minifiable Assertions

Assertions go a **long** way in debugging. Fail fast, catch bugs early. In asynchronous code, validating inputs as early as possible, instead of letting it fail mysteriously later, can save you hours of debugging.

Here's the traditional way of doing assertions:

```js
function someFunction(input) {
  if (typeof input !== 'function') {
    throw Error(`expected a function, got ${input}`)
  }
}

someFunction({one: 10})
// Error: Expected a function, got [object Object]
```

Annoying to type and **really** bad for minification. Some folks strip assertions from production builds, but I find the idea flawed. Even in production, failing fast is better than failing mysteriously, and assertions help with debugging when it inevitably fails.

Fpx provides a much better alternative:

```js
function someFunction(input) {
  f.req(input, f.isFun)
}

someFunction({one: 10})
// TypeError: expected {"one":10} to satisfy test isFun
```

So much better! Easy to type with editor autocompletion, produces good error messages, and minifies really well. In a minified build, the function name will be mangled, which is good for bundle size. The mangled name is a non-issue with a source map, which you need for debugging anyway.

To support this style of coding, Fpx provides [`req`](#function-req) and a bevy of boolean tests.

## Performance

Fpx functions tend to be faster than equivalent "native" methods. It shouldn't be your bottleneck.

There's potential for improvement, but I don't have infinite spare time for microbenchmark contests. Suggestions are welcome.

### Bonus Arguments

In Fpx, most collection functions, such as [`map`](#function-map), pass additional arguments to the operator function. Use this to define your functions statically and avoid local closures:

```js
// local context
const a = 1
const b = 2
const c = 3


// bonus args (recommended)

function add5(val, key, a, b, c) {
  return val + key + a + b + c
}
f.map([10, 20, 30], add5, a, b, c)
// [16, 27, 38]


// closure (not recommended)

function add5(val, key) {
  return val + key + a + b + c
}
f.map([10, 20, 30], add5)
// [16, 27, 38]
```

Broadly speaking, closures have a cost; defining functions statically avoids that cost.

This doesn't always improve performance, and can even make it worse. A smart engine can sometimes optimize a closure away. Closures may accidentally enable optimizations like function specialization. However, such optimizations can be unreliable. As a rule of thumb, memory allocation beats most other costs. Avoiding closure allocation is reliable and predictable at improving performance.

This may change with future advancements in JS engines.

---

## API

For changes between versions, see [changelog.md](changelog.md).

### Var

#### `const global`

Same as [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis), but works in IE.

  * Node → `global`
  * Deno → `window`
  * Browser → `window`
  * Service worker, extension script → `self`

### Bool

Various boolean tests.

#### `function truthy`

`ƒ(val) => bool`

Same as `!!` or `Boolean`. Sometimes useful with higher-order functions.

```js
f.truthy(null)
// false

f.truthy(1)
// true
```

#### `function falsy`

`ƒ(val) => bool`

Same as `!`. Sometimes useful with higher-order functions.

```js
f.falsy(null)
// true

f.falsy(1)
// false
```

#### `function is`

`ƒ(a, b) => bool`

Identity test: same as `===`, but considers `NaN` equal to `NaN`. Equivalent to [_SameValueZero_](https://www.ecma-international.org/ecma-262/6.0/#sec-samevaluezero) as defined by the language spec.

Note that [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) implements [_SameValue_](https://www.ecma-international.org/ecma-262/6.0/#sec-samevalue), which treats `-0` and `+0` as _distinct values_. This is typically undesirable. As a result, you should prefer `f.is` over `===` or `Object.is`.

Used internally in Fpx for all identity tests.

```js
f.is(1, '1')
// false

f.is(NaN, NaN)
// true
```

#### `function isNil`

`ƒ(val) => bool`

True for `null` and `undefined`. Same as `value == null`.

Incidentally, these are the only values that produce an exception when attempting to read a property: `null.someProperty`.

```js
// Definition
function isNil(value) {return value == null}

f.isNil(null)
// true

f.isNil(undefined)
// true

f.isNil(false)
// false
```

#### `function isSome`

`ƒ(val) => bool`

True for everything except `null` and `undefined`.

```js
// Definition
function isSome(value) {return value != null}

f.isSome(null)
// false
f.isSome(undefined)
// false
f.isSome(false)
// true
```

#### `function isBool`

`ƒ(val) => bool`

```js
f.isBool(false)
// true
```

#### `function isNum`

`ƒ(val) => bool`

Same as `typeof val === 'number'`. Returns `true` for `NaN` and `±Infinity`. In most cases, you should use `isFin` instead.

```js
f.isNum(1)
// true
f.isNum('1')
// false
f.isNum(NaN)
// true <-- WTF
```

#### `function isFin`

`ƒ(val) => bool`

Same as ES2015's [`Number.isFinite`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite).

Returns `true` if `val` is a number and is _not_ `NaN` or `±Infinity`. In most cases, you should prefer `isFin` over `isNum`.

```js
f.isFin(1)
// true
f.isFin('1')
// false
f.isFin(NaN)
// false
```

#### `function isInt`

`ƒ(val) => bool`

True if `val` is an integer: finite without a fractional part.

```js
f.isInt(0)
// true
f.isInt(1)
// true
f.isInt(-1)
// true
f.isInt(1.1)
// false
f.isInt('1')
// false
```

#### `function isNat`

`ƒ(val) => bool`

True if `val` is a natural number: a positive integer, starting with `0`.

```js
f.isNat(0)
// true
f.isNat(1)
// true
f.isNat(-1)
// false
f.isNat(1.1)
// false
f.isNat('1')
// false
```

#### `function isNatPos`

`ƒ(val) => bool`

True if `val` is a natural positive integer, starting with `1`.

```js
f.isNatPos(0)
// false
f.isNatPos(1)
// true
f.isNatPos(-1)
// false
f.isNatPos(1.1)
// false
f.isNatPos('1')
// false
```

#### `function isNaN`

`ƒ(val) => bool`

Same as ES2015's [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN). True if `val` is _actually_ `NaN`. Doesn't coerce non-numbers to numbers, unlike `global.isNaN` / `window.isNaN`.

```js
f.isNaN(NaN)
// true
f.isNaN(undefined)
// false
```

#### `function isInf`

`ƒ(val) => bool`

True if `val` is `-Infinity` or `Infinity`.

```js
f.isInf(Infinity)
// true
f.isInf(-Infinity)
// true
f.isInf(10)
// false
f.isInf(NaN)
// false
f.isInf(undefined)
// false
```

#### `function isStr`

`ƒ(val) => bool`

```js
f.isStr('blah')
// true
```

#### `function isKey`

`ƒ(val) => bool`

True if `val` could, with some suspension of disbelief, claim to be usable as a dict key. Must satisfy either of:

  * `isStr`
  * `isSym`
  * `isBool`
  * `isFin`

```js
f.isKey('key')
// true
f.isKey(Symbol('key'))
// true
f.isKey(10)
// true
f.isKey(undefined)
// false
```

In other words, this is a subset of [`isPrim`](#function-isprim) that excludes `null`, `undefined`, `NaN`, and `±Infinity`. These values are often produced on accident, and you almost never want them as your dict keys.

Fpx uses `isKey` to validate keys in functions like [`keyBy`](#function-keyby).

#### `function isPrim`

`ƒ(val) => bool`

Short for "is primitive". Opposite of `isComp`. One of:

  * `isNil`
  * `isStr`
  * `isSym`
  * `isBool`
  * `isNum`

#### `function isComp`

`ƒ(val) => bool`

Short for "is complex". Definition:

```js
function isComp(val) {return isObj(val) || isFun(val)}
```

This covers all mutable objects in the true JavaScript sense, including functions.

#### `function isFun`

`ƒ(val) => bool`

```js
f.isFun(f.isFun)
// true
```

#### `function isObj`

`ƒ(val) => bool`

True if `val` is a non-`null` object. This includes plain dicts, arrays, regexps, user-defined "classes", built-in classes, and so on. Doesn't count functions as objects, even though _technically_ they are.

Note: this is _not_ equivalent to lodash's `_.isObject`, which counts functions as objects. See [`isComp`](#function-iscomplex) for that.

For plain objects used as dictionaries, see [`isDict`](#function-isdict). For fancy non-list objects, see [`isStruct`](#function-isstruct).

```js
f.isObj('blah')
// false

f.isObj(/blah/)
// true

f.isObj([])
// true

f.isObj(Object.create(null))
// true

f.isObj(() => {})
// false
```

#### `function isStruct`

`ƒ(val) => bool`

True if `val` is a non-list object. In Fpx lingo, such objects are called "structs". There's an entire category of functions dedicated to them, similar to "object" functions in Lodash.

Note that anything that satisfies `isDict` automatically satisfies `isStruct`, but not vice versa.

```js
f.isStruct({})
// true

f.isStruct(new RegExp())
// true

f.isStruct([])
// false

f.isStruct(f.isStruct)
// false
```

#### `function isArr`

`ƒ(val) => bool`

True if `val` inherits from `Array.prototype`.

```js
f.isArr([])
// true
```

#### `function isReg`

`ƒ(val) => bool`

Short for "is regex".

```js
f.isReg(/blah/)
// true
```

#### `function isSym`

`ƒ(val) => bool`

```js
f.isSym(Symbol('blah'))
// true
```

#### `function isDate`

`ƒ(val) => bool`

```js
f.isDate(new Date())             // true
f.isDate(new Date().toString())  // false
```

#### `function isValidDate`

`ƒ(val) => bool`

```js
f.isValidDate(new Date())     // true
f.isValidDate(new Date(NaN))  // false
```

#### `function isInvalidDate`

`ƒ(val) => bool`

```js
f.isInvalidDate(new Date())     // false
f.isInvalidDate(new Date(NaN))  // true
```

#### `function isPromise`

`ƒ(val) => bool`

True if the value [quacks](https://en.wikipedia.org/wiki/Duck_test) like an ES2015 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The value doesn't have to inherit from the global `Promise`, if any.

```js
f.isPromise(new Promise(() => {}))
// true

f.isPromise({then() {}, catch() {}})
// true

f.isPromise({then() {}})
// false
```

#### `function isCls`

`ƒ(val) => bool`

#### `function isInst`

`ƒ(val, Cls) => bool`

Same as `instanceof` but more efficient for primitives.

When the left operand to `instanceof` is a primitive, it creates a temporary wrapper object, wasting CPU cycles on allocation and garbage collection, even though `false` was guaranteed. `isInst` avoids this mistake. At the time of writing, the improvement is measurable in V8.

```js
f.isInst([],         Array)  // true
f.isInst(new Date(), Date)   // true
f.isInst(1,          Number) // false, cheaper than instanceof
f.isInst(undefined,  Object) // false, cheaper than instanceof
```

#### `function isDict`

`ƒ(val) => bool`

True if `val` is a normal, honest-to-goodness dictionary and not something fancy-shmancy.

Roughly equivalent to Lodash's `_.isPlainObject`.

```js
f.isDict({})
// true

f.isDict(Object.create(null))
// true

f.isDict(Object.create({}))
// false

f.isDict([])
// false

f.isDict(new class {}())
// false
```

#### `function isList`

`ƒ(val) => bool`

True if `val` looks array-like, such as:

  * `[]`
  * `arguments`
  * `TypedArray`
  * `NodeList`
  * etc.

Used internally for most list checks. Note that _strings are not considered lists_.

```js
f.isList([])
// true

function args() {return arguments}
f.isList(args())
// true

f.isList(new Uint8Array())
// true

f.isList(document.querySelectorAll('div'))
// true

f.isList('string')
// false
```

#### `function isIter`

`ƒ(val) => bool`

True if the value [quacks](https://en.wikipedia.org/wiki/Duck_test) like an ES2015 [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator). _Iterators_, also called _generator objects_, are created by calling a _generator function_.

```js
function* myGenerator() {
  yield 10
  yield 20
  return 30
}

f.isIter(myGenerator())
// true

f.isIter(myGenerator)
// false
```

#### `function isOpt`

`ƒ(val, fun, ...args) => bool`

#### `function isListOf`

`ƒ(val, fun, ...args) => bool`

#### `function isDictOf`

`ƒ(val, fun, ...args) => bool`

#### `function hasOwn`

`ƒ(val, key) => bool`

#### `function testBy`

`ƒ(val, pattern) => bool`

Limited form of pattern testing. Together with ES2015 destructuring, it lets you crudely approximate pattern matching, a feature common in functional languages but missing from JavaScript.

Most of the time, using `testBy` is _much_ slower than an equivalent "hardcoded" test function. It can be your bottleneck. Avoid using this in hotspots.

Tests `val` against `pattern`, using the following rules:

```js
// Function pattern: call it, convert result to boolean

f.testBy(10, f.inc)  ≡  !!f.inc(10)

// Primitive pattern: test for identity via `f.is`

f.testBy(x, null)  ≡  f.is(x, null)
f.testBy(x, 10)    ≡  f.is(x, 10)
f.testBy(x, NaN)   ≡  f.is(x, NaN)

// Regexp pattern:
//   input must be a string
//   use `RegExp.prototype.test`

f.testBy(x, /blah/)  ≡  f.isString(x) && /blah/.test(x)

// List pattern:
//   input must be a list
//   recursively apply sub-patterns

f.testBy(x, [])             ≡  f.isList(x)
f.testBy(x, [/blah/])       ≡  f.isList(x) && f.testBy(x[0], /blah/)
f.testBy(x, [/blah/, 'c'])  ≡  f.isList(x) && f.testBy(x[0], /blah/) && f.testBy(x[1], 'c')

// Struct pattern:
//   input must a struct (a non-list object)
//   recursively apply sub-patterns

f.testBy(x, {})             ≡  f.isStruct(x)
f.testBy(x, {one: /blah/})  ≡  f.isStruct(x) && f.testBy(x.one, /blah/)
f.testBy(x, {a: {b: 'c'}})  ≡  f.isStruct(x) && f.testBy(x.a, {b: 'c'})
```

#### `function test`

`ƒ(pattern) => (any) => bool`

Takes a pattern and returns a version of [`testBy`](#function-testby) bound to that pattern. See the rules above.

Most of the time, using `test` is _much_ slower than an equivalent "hardcoded" test function. It can be your bottleneck. Avoid using this in hotspots.

```js
f.test(pattern)
// ≡ function(x) {return f.testBy(x, pattern)}

f.test(pattern)(input)
// ≡ f.testBy(input, pattern)
```

### Cast

Functions for type conversion. Most of them convert from `?T` to `T`.

#### `function prim`

`ƒ(val) => impl<isPrim>`

Similar to `val ?? undefined`, but throws if `val` was a non-nil non-primitive.

#### `function bool`

`ƒ(val) => bool`

Similar to `val ?? false`, but throws if `val` was a non-nil non-boolean.

#### `function num`

`ƒ(val) => number`

Similar to `val ?? 0`, but throws if `val` was a non-nil non-number.

#### `function fin`

`ƒ(val) => impl<isFin>`

Similar to `val ?? 0`, but throws if `val` was a non-nil non-finite-number.

#### `function int`

`ƒ(val) => impl<isInt>`

Similar to `val ?? 0`, but throws if `val` was a non-nil non-integer.

#### `function nat`

`ƒ(val) => impl<isNat>`

Similar to `val ?? 0`, but throws if `val` was a non-nil non-natural-number.

#### `function natPos`

`ƒ(val) => impl<isNatPos>`

Similar to `val ?? 0`, but throws if `val` was a non-nil non-positive-integer.

#### `function str`

`ƒ(val) => string`

Similar to `val ?? ''`, but throws if `val` was a non-nil non-string.

#### `function list`

`ƒ(val) => impl<isList>`

Similar to `val ?? []`, but throws if `val` was a non-nil non-list. Used internally in various [list functions](#list).

```js
f.list()
// []

f.list([10, 20])
// [10, 20]

f.list('not list')
// TypeError: expected "not list" to satisfy test isList
```

#### `function arr`

`ƒ(val) => Array`

Similar to `val ?? []`, but throws if `val` was a non-nil non-array.

#### `function dict`

`ƒ(val) => impl<isDict>`

Similar to `val ?? {}`, but throws if `val` was a non-nil non-dict.

#### `function struct`

`ƒ(val) => impl<isStruct>`

Similar to `val ?? {}`, but throws if `val` was a non-nil non-struct. Used internally in various [struct functions](#struct).

```js
f.struct()
// {}

f.struct({one: 10})
// {one: 10}

f.struct('not struct')
// TypeError: expected "not struct" to satisfy test isDict
```

#### `function comp`

`ƒ(val) => impl<isComp>`

Similar to `val ?? {}`, but throws if `val` was a non-nil primitive.

#### `function toStr`

`ƒ(val) => string`

Similar to `String(val ?? '')`, but throws if `val` was a non-nil non-primitive.

#### `function toArr`

`ƒ(val) => Array`

Nil-tolerant conversion. Converts any [list](#function-islist) into an `Array`. If the input is already an `Array`, it's returned as-is. Converts `null` and `undefined` to `[]`.

```js
f.toArr()
// []

f.toArr([10, 20])
// [10, 20]

f.toArr(function args() {return arguments}(10, 20))
// [10, 20]
```

### Assert

Assertion utilities.

#### `function req`

`ƒ(val, test, ...args) => typeof val`

where `test: ƒ(val) => bool`

Short for "require". Minification-friendly assertion. If `!test(value)`, throws an exception with a message including `val` and the name of the test function. Otherwise, returns `val` as-is. Since the assertion doesn't contain any strings, it can be minified to just a few characters.

```js
f.req({}, f.isObj)
// {}

f.req('blah', f.isFun)
// TypeError: expected "blah" to satisfy test isFun
```

#### `function opt`

`ƒ(val, test, ...args) => typeof val | null | undefined`

where `test: ƒ(val) => bool`

Short for "optional". Similar to `req`, but allows nil values. Performs a type assertion only if `val` is non-nil. Always returns `val` as-is.

#### `function reqInst`

`ƒ(val, Cls) => Cls`

Short for "require instance". Asserts that `val` is an instance of the given class. Returns `val` as-is.

```js
f.reqInst([10, 20], Array)
// [10, 20]

f.reqInst(undefined, Array)
// TypeError: expected undefined to be an instance of Array
```

#### `function optInst`

`ƒ(val, Cls) => Cls | null | undefined`

Short for "optional instance". Similar to `optInst`, but allows nil values. Performs a type assertion only if `val` is non-nil. Returns `val` as-is.

#### `function reqEach`

`ƒ(list, test, ...args) => typeof list`

Short for "require each". Same as `req` but asserts each value in the provided `list`. Includes the list index in the error message.

```js
f.reqEach([10, 20], f.isNum)
// [10, 20]

f.reqEach(['blah'], f.isFun)
// TypeError: expected "blah" at index 0 to satisfy test isFun
```

#### `function reqEachVal`

`ƒ(struct, test, ...args) => typeof struct`

Short for "require each value". Similar to `reqEach` but for structs.

### Fun

Miscellaneous utilities and transforms for functions.

#### `function call`

`ƒ(fun, ...args) => any`

Like [`Function.prototype.call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call). Sometimes useful with higher-order functions.

```js
f.call(f.add, 10, 20)
// 3

// equivalent:
f.add(10, 20)
f.call(f.add, 10, 20)
```

#### `function apply`

`ƒ(fun, args) => any`

Like [`Function.prototype.apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply). Sometimes useful with higher-order functions.

```js
f.apply(f.add, [10, 20])
// 3

// equivalent:
f.add(10, 20)
f.add(...[10, 20])
f.apply(f.add, [10, 20])
```

#### `function bind`

`ƒ(fun, ...args) => ƒ(...args) => any`

Like [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), but sets implicit `this = fun` as a side effect of the implementation.

Returns a new function that represents [partial application](https://en.wikipedia.org/wiki/Partial_application) of the given function, a common tool in functional programming. When called, it joins arguments from both calls and invokes the original function. Think of it like splitting a function call in two, or more.

```js
const inc = f.bind(f.add, 1)

inc(2)
// 3
```

Note: Fpx no longer provides facilities for currying. Experience has shown it to be extremely error prone. Currying, as seen in purely functional languages such as Haskell, tends to care about the amount of arguments. Calling a curried function may either create a new function, or call the underlying function (possibly side-effectful). This approach works reasonably well in statically typed purely functional languages, but not in JS, where all functions are variadic, and it's conventional to sometimes pass extra utility arguments "just in case", which the callee may or may not care about. `bind` is different because the created function will always call the original function, regardless of how many arguments were passed.

#### `function not`

`ƒ(fun) => ƒ(any) => bool`

Returns a new function that negates the result of the given function, like a delayed `!`.

```js
function eq(a, b) {return a === b}

const different = f.not(eq)

different(10, 20)
// !eq(10, 20) = true

// equivalent:
function different(a, b) {return !eq(a, b)}
```

#### `function cwk`

Short for "call without key".

`ƒ(val, _key, fun, ...args) => any` = `fun(val, ...args)`

Tool for omitting the "key" argument in various list and struct functions. Calls the provided function, skipping the second argument. Example from Fpx source:

```js
function isListOf(val, fun, ...args) {
  req(fun, isFun)
  return isList(val) && every(val, cwk, fun, ...args)
}
```

### Misc

Uncategorised utils.

#### `function vac`

`ƒ(val) => typeof val | undefined`

Short for "vacuum" or "vacuous". Same as `val || undefined`. Don't confuse with [`vacate`](#function-vacate).

#### `function True`

`ƒ() => true`

Always returns `true`. Sometimes useful in higher-order functions.

#### `function False`

`ƒ() => false`

Always returns `false`. Sometimes useful in higher-order functions.

### List

List manipulation utils.

Common rules:

  * Accept `null` and `undefined`, treating them as `[]`.
  * Accept inputs that satisfy [`isList`](#function-islist): `arguments`, typed arrays, Node buffers, DOM lists, etc.
  * Reject other inputs with an exception.
  * Don't modify the input; return a new version instead.
  * Accept [bonus arguments](#bonus-arguments) for the operator function.

Note that _strings are not considered lists_.

#### `function len`

`ƒ(list) => integer`

Equivalent to `f.list(list).length`. Allows `null` and `undefined`. Rejects non-lists with an exception.

```js
f.len()
// 0

f.len([10, 20])
// 2

f.len({one: 10, two: 20})
// TypeError

f.len('string')
// TypeError
```

#### `function hasLen`

`ƒ(val) => bool`

True if `isList(val)` and `!len(val)`. For non-list objects, see [`hasSize`](#function-hassize)

```js
f.hasLen(undefined)
// false

f.hasLen('blah')
// false

f.hasLen([10, 20])
// true

f.hasLen({one: 10, two: 20})
// false
```

#### `function vacate`

`ƒ(list) => typeof list | undefined`

Takes a list, returns `undefined` if empty, otherwise returns `list` as-is.

```js
f.vacate()
// undefined

f.vacate([])
// undefined

f.vacate([10])
// [10]
```

#### `function each`

`ƒ(list, fun, ...args) => void`

where `fun: ƒ(elem, index, ...args)`

Like [`Array.prototype.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach), but works on `null`, `undefined`, and array-likes.

```js
function report(val, index, ...args) {
  console.info(val, index, ...args)
}

f.each(['one', 'two'], report, 10, 20, 30)
// 'one' 0 10 20 30
// 'two' 1 10 20 30
```

#### `function map`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(val, index, ...args)`

Like [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), but works on `null`, `undefined`, and array-likes.

```js
function double(num) {return num * 2}

f.map([10, 20, 30], double)
// [20, 40, 60]
```

#### `function mapMut`

`ƒ(list, fun, ...args) => typeof list`

where `fun: ƒ(elem, index, ...args) => any`

Similar to `map`, but maps the input in-place and returns it as-is. The input must be a mutable list.

#### `function mapFlat`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(elem, index, ...args)`

Similar to `map`, but flattens any lists returned by `fun` into the output array. Equivalent to `f.flat(f.map(...arguments))`.

```js
f.mapFlat([10, [20], [[30]]], x => x)
// [10, 20, [30]]
```

#### `function mapFlatDeep`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(elem, index, ...args)`

Similar to `map`, but deeply flattens any lists returned by `fun`, returning a completely flat array. Equivalent to `f.flatDeep(f.map(...arguments))`.

```js
f.mapFlatDeep([10, [20], [[[30]]]], x => x)
// [10, 20, 30]
```

#### `function mapFilter`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(elem, index, ...args)`

Similar to `map`, but drops any "falsy" values from the output. Equivalent to `f.compact(f.map(...arguments))`.

```js
f.mapFilter([10, 0, 20, 0], x => x * 2)
// [20, 40]
```

#### `function filter`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(elem, index, ...args)`

Like [`Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), but works on `null`, `undefined`, and array-likes.

```js
f.filter([10, 20, true, false], f.isBool)
// [true, false]
```

#### `function reject`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(elem, index, ...args)`

Opposite of `filter`: drops elements that don't satisfy `fun`.

```js
f.reject([10, 20, true, false], f.isNum)
// [true, false]
```

#### `function fold`

`ƒ(list, acc, fun, ...args) => typeof acc`

where `fun: ƒ(acc, elem, index, ...args) => typeof acc`

Like [`Array.prototype.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce), with the following differences:

  * Accepts `null`, `undefined`, and array-likes.
  * The argument order is `list, acc, fun` rather than `this=list, fun, acc`.
  * The acc argument is mandatory.

```js
f.fold([10, 20], 5, f.add)
// 5 + 10 + 20 = 35
```

#### `function foldRight`

`ƒ(list, acc, fun, ...args) => typeof acc`

where `fun: ƒ(acc, list, index, ...args) => typeof acc`

Like [`Array.prototype.reduceRight`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight), with the following differences:

  * Accepts `null`, `undefined`, and array-likes.
  * The argument order is `list, acc, fun` rather than `this=list, fun, acc`.
  * The acc argument is mandatory.

```js
f.foldRight([1, 5, 20], 100, f.sub)
// 100 - 20 - 5 - 1 = 74
```

#### `function fold1`

`ƒ(list, fun, ...args) => any`

where `fun: ƒ(acc, elem, index, ...args) => any`

Like [`Array.prototype.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) without the initial accumulator argument, with the following differences:

  * Accepts `null`, `undefined`, and array-likes.
  * Allows an empty list, returning `undefined`.
  * The argument order is `list, fun` rather than `this=list, fun`.

```js
f.fold1([10, 20], f.add)
// 10 + 20 = 30
```

#### `function compact`

`ƒ(list) => Array`

Returns a version of `list` without any "falsy" elements. Equivalent to `f.filter(list, id)`.

```js
f.compact([10, 0, 20, NaN, 30, undefined])
// [10, 20, 30]
```

#### `function find`

`ƒ(list, fun, ...args) => any`

where `fun: ƒ(elem, index, ...args)`

Like [`Array.prototype.find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find), but works on `null`, `undefined`, and array-likes.

```js
f.find([true, 10, false, 20, true], f.isNum)
// 10
```

#### `function findRight`

`ƒ(list, fun, ...args) => any`

where `fun: ƒ(elem, index, ...args)`

Like `find`, but iterates from the _end_ of the list. Returns the rightmost element that satisfies `fun`, or `undefined` if none do.

```js
f.findRight([true, 10, false, 20, true], f.isNum)
// 20
```

#### `function findIndex`

`ƒ(list, fun, ...args) => integer`

where `fun: ƒ(elem, index, ...args)`

Like [`Array.prototype.findIndex`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex), but works on `null`, `undefined`, and array-likes.

```js
f.findIndex([true, 10, false, 20, true], f.isNum)
// 1
```

#### `function findIndexRight`

`ƒ(list, fun, ...args) => integer`

where `fun: ƒ(elem, index, ...args)`

Like `findIndex`, but iterates from the _end_ of the list. Returns the index of the rightmost element that satisfies `fun`, or `-1` if none do.

```js
f.findIndexRight([true, 10, false, 20, true], f.isNum)
// 3
```

#### `function indexOf`

`ƒ(list, elem) => integer`

Like [`Array.prototype.indexOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf), with the following differences:

  * Works on `null`, `undefined`, and array-likes.
  * Uses [`is`](#function-is) rather than `===` and therefore detects `NaN`.

```js
f.indexOf([10, NaN, NaN, 20], NaN)
// 1
```

#### `function lastIndexOf`

`ƒ(list, elem) => integer`

Like [`Array.prototype.lastIndexOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf), with the following differences:

  * Works on `null`, `undefined`, and array-likes.
  * Uses [`is`](#function-is) rather than `===` and therefore detects `NaN`.

```js
f.lastIndexOf([10, NaN, NaN, 20], NaN)
// 2
```

#### `function includes`

`ƒ(list, elem) => bool`

Like [`Array.prototype.includes`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes), but works on `null`, `undefined`, and array-likes.

```js
f.includes([10, 20, 30], NaN)
// false

f.includes([10, 20, NaN], NaN)
// true
```

#### `function procure`

`ƒ(list, fun, ...args) => any`

Similar to [`find`](#function-find), but returns the first truthy result of calling `fun`, rather than the corresponding list element.

```js
function double(num) {return num * 2}

f.procure([0, 0, 10, 100], double)
// double(10) = 20
```

#### `function every`

`ƒ(list, fun, ...args) => bool`

where `fun: ƒ(elem, index, ...args)`

Like [`Array.prototype.every`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every), but works on `null`, `undefined`, and array-likes.

```js
f.every([], f.isBool)
// true

f.every([true, false], f.isBool)
// true

f.every([true, false, 10, 20], f.isBool)
// false
```

#### `function some`

`ƒ(list, fun, ...args) => bool`

where `fun: ƒ(elem, index, ...args)`

Like [`Array.prototype.some`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some), but works on `null`, `undefined`, and array-likes.

```js
f.some([], f.isBool)
// false

f.some([10, 20], f.isBool)
// false

f.some([true, false, 10, 20], f.isBool)
// true
```

#### `function slice`

`ƒ(list, start, next) => Array`

Like [`Array.prototype.slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice), but also accepts `null` and `undefined`. `start` and `next` can be missing or negative; see the linked documentation.

```js
f.slice([10, 20, 30, 40, 50], 1, -1)
// [20, 30, 40]
```

#### `function append`

`ƒ(list, elem) => Array`

Returns a version of `list` with `elem` appended at the end.

```js
f.append([10, 20], 30)
// [10, 20, 30]
```

#### `function prepend`

`ƒ(list, elem) => Array`

Returns a version of `list` with `elem` prepended at the start.

```js
f.prepend([20, 30], 10)
// [10, 20, 30]
```

#### `function remove`

`ƒ(list, elem) => Array`

Returns a version of `list` with one occurrence of `elem` removed. May return
the original list.

```js
f.remove(['one', 'two', 'three'], 'two')
// ['one', 'three']

f.remove(['one', 'two', 'one'], 'one')
// ['two', 'one']
```

#### `function adjoin`

`ƒ(list, elem) => Array`

Appends `elem` to `list`, duplicate-free. Returns the same `list` if it already [`includes`](#function-includes) `elem`. Always returns an `Array`, converting the input from a non-array list.

```js
f.adjoin([10, 20], 30)
// [10, 20, 30]

f.adjoin([10, 20, 30], 20)
// [10, 20, 30]
```

#### `function toggle`

`ƒ(list, elem) => Array`

Appends or removes `elem`, depending on whether it's already [`included`](#function-includes).

```js
f.toggle([10, 20], 30)
// [10, 20, 30]

f.toggle([10, 20, 30], 30)
// [10, 20]
```

#### `function insertAt`

`ƒ(val, ind, elem) => Array`

Returns a version of `list` with `val` inserted at `ind`, moving subsequent elements to the end. `ind` must be an integer within list bounds + 1, otherwise throws.

```js
f.insertAt(undefined, 0, 'zero')
// ['zero']

f.insertAt(['zero', 'one', 'two'], 0, 'absolute zero')
// ['absolute zero', 'zero', 'one', 'two']

f.insertAt(['zero', 'one', 'two'], 2, '...')
// ['zero', 'one', '...', 'two']
```

#### `function replaceAt`

`ƒ(val, ind, elem) => Array`

Returns a version of `list` with the value at `ind` replaced with `elem`. Index must be within bounds, otherwise throws.

```js
f.replaceAt(['zero', 'two'], 0, 'one')
// ['one', 'two']

f.replaceAt(['one', 'two'], 1, 'three')
// ['one', 'three']
```

#### `function removeAt`

`ƒ(val, ind) => Array`

Returns a version of `list` with the value at `ind` removed, if within bounds. `ind` must be an integer, otherwise throws.

```js
f.removeAt(['zero', 'one', 'two'], 0)
// ['one', 'two']

f.removeAt(['zero', 'one', 'two'], 1)
// ['zero', 'two']

f.removeAt(['zero', 'one', 'two'], 10)
// ['zero', 'one', 'two']
```

#### `function concat`

`ƒ(...lists) => Array`

Concatenates lists, ignoring non-list arguments.

**Different** from [`Array.prototype.concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), which inherited Scheme's hazardous mistake of appending non-list inputs while flattening list inputs. This leads to surprising errors and/or intentional abuse. Fpx's `concat` rejects non-lists, preventing this gotcha.

Note: for individual elements, use [`append`](#function-append) and
[`prepend`](#function-prepend) instead.

```js
f.concat()
// []

f.concat([10], [20], [30])
// [10, 20, 30]

f.concat([10, 20], 30)
// TypeError: expected 30 to satisfy test isList
```

#### `function flat`

`ƒ(list) => Array`

Returns a version of `list` flattened one level down.

```js
f.flat([10, [20], [[30]]])
// [10, 20, [30]]
```

#### `function flatDeep`

`ƒ(list) => Array`

Returns a version of `list` with all nested lists flattened into one result.

```js
f.flatDeep([10, [20], [[[30]]]])
// [10, 20, 30]
```

#### `function head`

`ƒ(list) => any`

Returns the first element of the given list.

```js
f.head()
// undefined

f.head([10, 20, 30])
// 10
```

#### `function tail`

`ƒ(list) => Array`

Returns all but first element of the given list.

```js
f.tail()
// []

f.tail([10, 20, 30])
// [20, 30]
```

#### `function init`

`ƒ(list) => Array`

Returns all but last element of the given list.

```js
f.init()
// []

f.init([10, 20, 30])
// [10, 20]
```

#### `function last`

`ƒ(list) => any`

Returns the last element of the given list.

```js
f.last()
// undefined

f.last([10, 20, 30])
// 30
```

#### `function take`

`ƒ(list, count) => Array`

Returns a sub-`list` with `count` elements taken from the start. Equivalent to `f.slice(list, count)`.

```js
f.take(undefined, 0)
// []

f.take([10, 20, 30, 40], 2)
// [10, 20]

f.take([10, 20, 30, 40], Infinity)
// [10, 20, 30, 40]
```

#### `function takeWhile`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(elem, index, ...args) => bool`

Returns a sub-`list` with elements from the start for which `fun` returned something truthy. Stops taking elements as soon as `fun` returns something falsy.

#### `function drop`

`ƒ(list, count) => Array`

Returns a sub-`list` with `count` elements removed from the start. Equivalent to `f.slice(list, 0, count)`.

```js
f.drop(undefined, 0)
// []

f.drop([10, 20, 30, 40], 2)
// [30, 40]

f.drop([10, 20, 30, 40], Infinity)
// []
```

#### `function dropWhile`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(elem, index, ...args) => bool`

Returns a sub-`list` without elements from the start for which `fun` returned something truthy. Stops dropping elements as soon as `fun` returns something falsy.

#### `function count`

`ƒ(list, fun, ...args) => integer`

where `fun: ƒ(elem, index, ...args) => bool`

Counts elements for which `fun` returns something truthy.

#### `function countWhile`

`ƒ(list, fun, ...args) => integer`

where `fun: ƒ(elem, index, ...args) => bool`

Counts elements for which `fun` returns something truthy, but stops counting as soon as it returns something falsy.

#### `function times`

`ƒ(count, fun, ...args) => Array`

where `fun: ƒ(index, ...args) => any`

Create a populates an array of the given size, where elements are created by calling `fun`.

#### `function reverse`

`ƒ(list) => Array`

Like [`Array.prototype.reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse), with the following differences:

  * Works on `null`, `undefined`, and array-likes.
  * Returns a new version instead of mutating the list.

```js
f.reverse()
// []

f.reverse([10, 20, 30])
// [30, 20, 10]
```

#### `function sort`

`ƒ(list, ?fun) => Array`

where `fun: ƒ(any, any) => integer`

Like [`Array.prototype.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), with the following differences:

  * Works on `null`, `undefined`, and array-likes.
  * Returns a new version instead of mutating the list.

```js
// Messed-up default JS sorting.
f.sort([3, 22, 111])
// [111, 22, 3]

// Use a custom comparator to sort numbers properly.
f.sort([3, 22, 111], f.sub)
// [3, 22, 111]
```

#### `function sortBy`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(elem, ...args)`

Returns a version of `list` sorted by the order of values returned by `fun`, which is called on every element with the bonus arguments. Kinda like mapping `list` to `fun`, sorting the result, then changing the element order in the original list the same way.

The "virtual elements" are sorted the same way as in `.sort()`, i.e. by the Unicode code order of its stringified elements; see the relevant [part of the spec](https://tc39.github.io/ecma262/#sec-sortcompare). `sortBy` currently doesn't accept a custom comparator, although this could be changed if needed.

Works on array-likes. Note that `fun` doesn't receive an element index.

```js
function getId({id}) {return id}

f.sortBy([{id: 3}, {id: 22}, {id: 111}], getId)
// [{id: 111}, {id: 22}, {id: 3}]
```

#### `function sortCompare`

`ƒ(left, right) => integer`

Default JS algorithm for comparing elements when sorting, as described in the spec. Reference: https://tc39.github.io/ecma262/#sec-sortcompare.

#### `function intersect`

`ƒ(left, right) => Array`

Returns a list representing a [set intersection](https://en.wikipedia.org/wiki/Set_intersection) of the two lists. It contains only the elements that occur in both lists, tested via [`is`](#function-is), without any duplicates.

```js
f.intersect([10, 20, 20, 30], [20, 30, 30, 40])
// [20, 30]

f.intersect([10, 20], undefined)
// []
```

#### `function keyBy`

`ƒ(list, fun, ...args) => Record<impl<isKey>, any>`

where `fun: ƒ(elem, index, ...args)`

Returns a dict where `list`'s values are assigned to the keys created by `fun`.

Major difference from Lodash's `_.keyBy`: keys must pass the [`isKey`](#function-iskey) test or be ignored. This means they must be primitives, excluding the nonsense values `null`, `undefined`, `NaN` and `±Infinity`. This helps avoid accidental garbage in the output.

```js
function double(value) {return value * 2}

f.keyBy([10, 20, 30], double)
// {20: 10, 40: 20, 60: 30}
```

#### `function groupBy`

`ƒ(list, fun, ...args) => Record<impl<isKey>, any>`

where `fun: ƒ(elem, index, ...args)`

Similar to `keyBy`: returns a dict where keys have been created by calling `fun`. Unlike `keyBy`, it groups values into lists, accumulating them for repeating keys instead of overwriting.

Just like `keyBy`, and unlike Lodash's `_.groupBy`, keys must pass the [`isKey`](#function-iskey) test or be ignored. This helps avoid accidental garbage in the output.

```js
function oddness(value) {return value % 2}

f.groupBy([10, 13, 16, 19], oddness)
// {0: [10, 16], 1: [13, 19]}
```

#### `function uniq`

`ƒ(list) => Array`

Returns a version of `list` without duplicate elements, compared via [`is`](#function-is).

```js
f.uniq([10, 20, NaN, 20, NaN, 30])
// [10, 20, NaN, 30]
```

#### `function uniqBy`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(elem, index, ...args)`

Returns a version of `list` where no two elements have produced the same result when `fun` was called on them. The results are compared via [`is`](#function-is).

```js
function isOdd(value) {return !!(value % 2)}

f.uniqBy([10, 13, 16, 19], isOdd)
// [10, 13]
```

#### `function partition`

`ƒ(list, fun, ...args) => [Array, Array]`

where `fun: ƒ(elem, index, ...args)`

Splits `list` into "accepted" and "rejected" groups. The accepted group contains elements for which `fun` returned something truthy, and the rejected group contains the rest.

```js
function isOdd(value) {return !!(value % 2)}

f.partition([10, 13, 16, 19], isOdd)
// [[13, 19], [10, 16]]
```

#### `function sum`

`ƒ(list) => impl<isFin>`

Sums all elements of `list` that satisfy [`isFin`](#function-isfin), ignoring the rest.

```js
f.sum([10, NaN, 20, '5'])
// 30
```

#### `function sumBy`

`ƒ(list, fun, ...args) => impl<isFin>`

where `fun: ƒ(elem, index, ...args)`

Calls `fun` on every element of the list and sums the results. Like `sum`, ignores values that don't satisfy [`isFin`](#function-isfin).

```js
f.sumBy([10, undefined, '20'], Number)
// 30
```

#### `function min`

`ƒ(list) => impl<isFin>`

Finds the smallest value in `list` that also satisfies [`isFin`](#function-isfin), or `undefined`. Note that it ignores `±Infinity`.

```js
f.min([])
// undefined

f.min(['10', 20, '30', -Infinity, NaN])
// 20
```

#### `function max`

`ƒ(list) => impl<isFin>`

Finds the largest value in `list` that also satisfies [`isFin`](#function-isfin), or `undefined`. Note that it ignores `±Infinity`.

```js
f.max([])
// undefined

f.max(['10', 20, '30', Infinity, NaN])
// 20
```

#### `function minBy`

`ƒ(list, fun, ...args) => impl<isFin>`

where `fun: ƒ(elem, index, ...args)`

Calls `fun` on every element of the list and returns the smallest result, using the same rules as [`min`](#function-min).

Note a major difference from Lodash's `_.minBy`: this returns the smallest value returned by `fun`, not its corresponding list element. I find this far more intuitive. See `findMinBy` for the counterpart to `_.minBy`.

```js
function getNum({num}) {return num}

f.minBy([{num: 10}, {num: 20}, {num: 30}], getNum)
// 10
```

#### `function maxBy`

`ƒ(list, fun, ...args) => impl<isFin>`

where `fun: ƒ(elem, index, ...args)`

Calls `fun` on every element of the list and returns the largest result, using the same rules as [`max`](#function-max).

Note a major difference from Lodash's `_.maxBy`: this returns the smallest value returned by `fun`, not its corresponding list element. I find this far more intuitive. See `findMaxBy` for the counterpart to `_.maxBy`.

```js
function getNum({num}) {return num}

f.maxBy([{num: 10}, {num: 20}, {num: 30}], getNum)
// 30
```

#### `function findMinBy`

`ƒ(list, fun, ...args) => impl<isFin>`

where `fun: ƒ(elem, index, ...args)`

Calls `fun` on every element of the list and returns the element for which `fun` returned the smallest value, using the same rules as [`min`](#function-min).

Similar to Lodash's `_.minBy`.

```js
function getNum({num}) {return num}

f.findMinBy([{num: 10}, {num: 20}, {num: 30}], getNum)
// {num: 10}
```

#### `function findMaxBy`

`ƒ(list, fun, ...args) => impl<isFin>`

where `fun: ƒ(elem, index, ...args)`

Calls `fun` on every element of the list and returns the element for which `fun` returned the largest value, using the same rules as [`max`](#function-max).

Similar to Lodash's `_.maxBy`.

```js
function getNum({num}) {return num}

f.findMaxBy([{num: 10}, {num: 20}, {num: 30}], getNum)
// {num: 30}
```

#### `function range`

`ƒ(start, next) => Array`

Returns a list of integers from `start` (inclusive) to `next` (exclusive). Both inputs must be integers, with `start <= next`.

```js
f.range(5, 10)
// [5, 6, 7, 8, 9]

f.range(-10, 5)
// [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4]
```

#### `function zip`

`ƒ(entries) => Record<impl<isKey>, any>`

Like [`Object.fromEntries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries), but the input may be `null`, `undefined`, or array-like.

### Struct

Utils for dealing with non-list objects, called "structs" or "dictionaries" in Fpx.

Common rules:

  * Accept `null` and `undefined`, treating them as `{}`.
  * Accept non-list objects; reject lists and all other inputs with an exception.
  * Don't modify the input; return a new version instead.
  * Accept [bonus arguments](#bonus-arguments) for the operator function.

Property getters `get`, `scan`, `getIn` and `getter` work on _any_ input, even primitives.

#### `function size`

`ƒ(struct) => integer`

Equivalent to `Object.keys(f.struct(struct)).length`. Allows `null` and `undefined`. Rejects non-structs with an exception.

```js
f.size()
// 0

f.size({one: 10, two: 20})
// 2

f.size([10, 20])
// TypeError

f.size('string')
// TypeError
```

#### `function hasSize`

`ƒ(val) => bool`

True if `isStruct(val)` and `!size(val)`. For lists, see [`hasLen`](#function-haslen).

```js
f.hasSize(undefined)
// false

f.hasSize('blah')
// false

f.hasSize([10, 20])
// false

f.hasSize({one: 10, two: 20})
// true
```

#### `function keys`

`ƒ(struct) => Array<impl<isKey>>`

Like `Object.keys`, with the following differences:

  * Works on `null` and `undefined`.
  * Rejects list inputs with an exception.

```js
f.keys()
// []

f.keys({one: 10, two: 20})
// ['one', 'two']

f.keys([10, 20])
// TypeError: expected [10,20] to satisfy test isStruct
```

#### `function vals`

`ƒ(struct) => Array`

Like `Object.values`, with the following differences:

  * Works on `null` and `undefined`.
  * Rejects list inputs with an exception.

```js
f.vals()
// []

f.vals({one: 10, two: 20})
// [10, 20]

f.vals([10, 20])
// TypeError: expected [10,20] to satisfy test isStruct
```

#### `function entries`

`ƒ(struct) => Array<[impl<isKey>, any]>`

Like `Object.entries`, with the following differences:

  * Works on `null` and `undefined`.
  * Rejects list inputs with an exception.

```js
f.entries()
// []

f.entries({one: 10, two: 20})
// [['one', 10], ['two', 20]]

f.entries([10, 20])
// TypeError: expected [10,20] to satisfy test isStruct
```

#### `function eachVal`

`ƒ(struct, fun, ...args) => void`

where `fun: ƒ(elem, key, ...args)`

Iterates for side effects, calling `fun` with every property and key.

```js
function report(value, key, ...args) {
  console.info(value, key, ...args)
}

f.eachVal({one: 10, two: 20}, report, 10, 20, 30)
// 10 'one' 10 20 30
// 20 'two' 10 20 30
```

#### `function foldVals`

`ƒ(struct, acc, fun, ...args) => typeof acc`

where `fun: ƒ(acc, elem, key, ...args) => typeof acc`

Similar to [`fold`](#function-fold), but for dicts. Iterates over each property, updating the accumulator, which is returned in the end.

```js
f.foldVals({one: 10, two: 20}, 5, f.add)
// 5 + 10 + 20 = 35
```

#### `function mapVals`

`ƒ(struct, fun, ...args) => Record<impl<isKey>, any>`

where `fun: ƒ(elem, key, ...args)`

Similar to [`map`](#function-map), but for dicts. Creates a version of `dict` where values have been replaced by calling `fun`.

```js
function bang(value) {return value + '!'}

f.mapVals({ping: 'ping', pong: 'pong'}, bang)
// {ping: 'ping!', pong: 'pong!'}
```

#### `function mapValsMut`

`ƒ(struct, fun, ...args) => Record<impl<isKey>, any>`

where `fun: ƒ(elem, key, ...args) => any`

Similar to `mapVals`, but maps the input in-place and returns it as-is. The input must be a mutable struct.

#### `function mapFlat`

`ƒ(list, fun, ...args) => Array`

where `fun: ƒ(elem, index, ...args)`

Similar to `map`, but flattens any lists returned by `fun` into the output array. Equivalent to `f.flat(f.map(...arguments))`.

```js
f.mapFlat([10, [20], [[30]]], x => x)
// [10, 20, [30]]
```

#### `function mapKeys`

`ƒ(struct, fun, ...args) => Record<imp<isKey>, any>`

where `fun: ƒ(key, elem, ...args)`

Similar to [`mapVals`](#function-mapvals), but replaces keys rather than values.

Major difference from Lodash's `_.mapKeys`: keys must pass the [`isKey`](#function-iskey) test or be ignored. This means they must be primitives, excluding the nonsense values `null`, `undefined`, `NaN` and `±Infinity`. This helps avoid accidental garbage in the output.

Another major difference from Lodash's `_.mapKeys`: the operator receives `key, elem, ...args` rather than `elem, key, struct`.

```js
f.mapKeys({one: 10, two: 20}, f.head)
// {o: 10, t: 20}
```

#### `function mapValsSort`

`ƒ(struct, fun, ...args) => Array`

where `fun: ƒ(elem, key, ...args)`

Maps `struct` to a _list_, sorted by key order.

Note the difference: Lodash's `_.map` works on dicts, but since object key/iteration order is unspecified, the output is unsorted and therefore unstable. `mapValsSort` avoids this issue, always producing the same output for a given dict.

```js
f.mapValsSort({3: 'three', 22: 'two', 111: 'one'}, f.id)
// ['one', 'two', 'three']
```

#### `function pick`

`ƒ(struct, fun, ...args) => Record<impl<isKey>, any>`

where `fun: ƒ(elem, key, ...args)`

Similar to [`filter`](#function-filter), but for structs. Returns a version of `struct` with properties for which `fun` returned something truthy.

```js
function isOdd(value) {return !!(value % 2)}

f.pick({one: 10, two: 13, three: 16, four: 19}, isOdd)
// {two: 13, four: 19}
```

#### `function omit`

`ƒ(struct, fun, ...args) => Record<impl<isKey>, any>`

where `fun: ƒ(elem, key, ...args)`

Similar to [`reject`](#function-reject), but for structs. Returns a version of `struct` without properties for which `fun` returned something truthy.

```js
function isOdd(value) {return !!(value % 2)}

f.omit({one: 10, two: 13, three: 16, four: 19}, isOdd)
// {one: 10, three: 16}
```

#### `function pickKeys`

`ƒ(struct, keys) => Record<impl<isKey>, any>`

Returns a version of `struct` with only the properties whitelisted in `keys`. The keys must satisfy [`isKey`](#function-iskey).

Same as Lodash's `_.pick`.

```js
f.pickKeys({one: 10, two: 20}, ['one'])
// {one: 10}
```

#### `function omitKeys`

`ƒ(struct, keys) => Record<impl<isKey>, any>`

Returns a version of `struct` without any properties blacklisted in `keys`. The keys must satisfy [`isKey`](#function-iskey).

Same as Lodash's `_.omit`.

```js
f.omitKeys({one: 10, two: 20}, ['one'])
// {two: 20}
```

#### `function findVal`

`ƒ(struct, fun, ...args) => any`

where `fun: ƒ(elem, key, ...args)`

Similar to [`find`](#function-find), but for structs. Returns the first value for which `fun` returned something truthy.

```js
function isOdd(value) {return !!(value % 2)}

f.findVal({one: 10, two: 13}, isOdd)
// 13
```

#### `function findKey`

`ƒ(struct, fun, ...args) => impl<isKey> | undefined`

where `fun: ƒ(elem, key, ...args)`

Similar to [`findIndex`](#function-findindex), but for structs. Returns the first key for which `fun` returned something truthy.

```js
function isOdd(value) {return !!(value % 2)}

f.findKey({one: 10, two: 13}, isOdd)
// 'two'
```

#### `function everyVal`

`ƒ(struct, fun, ...args) => bool`

where `fun: ƒ(elem, key, ...args)`

Similar to [`every`](#function-every), but for struct values:

```js
f.everyVal({}, f.isBool)
// true

f.everyVal({one: true, two: false}, f.isBool)
// true

f.everyVal({one: true, two: false, three: 10}, f.isBool)
// false
```

#### `function someVal`

`ƒ(struct, fun, ...args) => bool`

where `fun: ƒ(elem, key, ...args)`

Similar to [`some`](#function-some), but for struct values:

```js
f.someVal({}, f.isBool)
// false

f.someVal({one: 10, two: 20}, f.isBool)
// false

f.someVal({one: true, two: false, three: 10}, f.isBool)
// true
```

#### `function invert`

`ƒ(struct) => Record<impl<isKey>, any>`

Returns a version of `struct` with keys and values swapped. Values must satisfy [`isKey`](#function-iskey) to become keys; ones that don't are silently dropped from the output.

```js
f.invert({one: 10, two: 20})
// {10: 'one', 20: 'two'}
```

#### `function invertBy`

`ƒ(struct, fun, ...args) => Record<impl<isKey>, any>`

where `fun: ƒ(elem, key, ...args)`

Similar to `invert`, but calls `fun` on each value to produce a key. The resulting keys must satisfy [`isKey`](#function-iskey) or be silently dropped from the output.

```js
function double(value) {return value * 2}

f.invertBy({one: 10, two: 20}, double)
// {20: 'one', 40: 'two'}
```

### Operator

Operator-style functions. Sometimes useful with higher-order functions. Like with regular JS operators, beware of implicit type coercions.

#### `function neg`

`ƒ(val) => bool`

Same as `!val`.

```js
f.neg(10)
// false
```

#### `function add`

`ƒ(a, b) => typeof a`

Same as `+`.

```js
f.add(10, 20)
// 10 + 20 = 30
```

#### `function sub`

`ƒ(a, b) => number`

Same as `-`.

```js
f.sub(20, 10)
// 20 - 10 = 10
```

#### `function mul`

`ƒ(a, b) => number`

Same as `*`.

```js
f.mul(10, 20)
// 10 * 20 = 200
```

#### `function div`

`ƒ(a, b) => number`

Same as `/`.

```js
f.div(10, 20)
// 10 / 20 = 0.5
```

#### `function rem`

`ƒ(a, b) => number`

Same as `%`.

```js
f.rem(2.5, 1)
// 2.5 % 1 = 0.5
```

#### `function lt`

`ƒ(a, b) => bool`

Same as `<`.

```js
f.lt(10, 20)
// 10 < 20 = true
```

#### `function gt`

`ƒ(a, b) => bool`

Same as `>`.

```js
f.gt(10, 20)
// 10 > 20 = false
```

#### `function lte`

`ƒ(a, b) => bool`

Same as `<=`.

```js
f.lte(10, 20)
// 10 <= 20 = true
f.lte(10, 10)
// 10 <= 10 = true
```

#### `function gte`

`ƒ(a, b) => bool`

Same as `>=`.

```js
f.gte(10, 20)
// 10 >= 20 = false
f.gte(10, 10)
// 10 >= 10 = true
```

#### `function inc`

`ƒ(a) => typeof a`

Increments by `1`.

```js
f.inc(1)
// 1 + 1 = 2
```

#### `function dec`

`ƒ(a) => number`

Decrements by `1`.

```js
f.dec(2)
// 2 - 1 = 1
```

#### `function nop`

`ƒ() => void`

Empty function. Functional equivalent of `;` or `undefined`. Sometimes useful with higher-order functions.

```js
f.nop()
// undefined
```

#### `function id`

`ƒ(val) => typeof val`

Identity function: returns its first argument unchanged. Sometimes useful with higher-order functions.

```js
f.id('first', 'second', 'third')
// 'first'
```

#### `function di`

`ƒ(_, val) => typeof val`

Returns its _second_ argument unchanged. Sometimes useful with higher-order functions.

```js
f.di('first', 'second', 'third')
// 'second'
```

#### `function val`

`ƒ(val) => ƒ() => typeof val`

"Constant" function. Returns a function that always returns the original value. Useful for dealing with functional APIs when values are known in advance.

```js
const one = f.val(1)

one()
// 1

one(100)
// 1
```

#### `function rethrow`

`ƒ(val) => void`

Same as `throw` but can be used as an expression. Also sometimes useful with higher-order functions.

```js
// Can be used where the regular `throw` can't.
const x = someTest ? someValue : f.rethrow(Error('unreachable'))
```

#### `function get`

`ƒ(val, key) => any`

Same as `val?.[key]`.

```js
f.get()
// undefined

f.get(null, 'one')
// undefined

f.get({one: 1}, 'one')
// 1

f.get('string', 'length')
// 6
```

#### `function scan`

`ƒ(val, ...path) => any`

Like `get` but takes many keys and reads a nested property at that path. Like `get`, is safe against `null` or `undefined`.

```js
f.scan()
// undefined

f.scan(null)
// null

f.scan(null, 'one')
// undefined

f.scan({one: 1}, 'one')
// 1

f.scan({one: {two: 2}}, 'one', 'two')
// 2
```

#### `function getIn`

`ƒ(val, path) => any`

Like `scan` but expects the entire `path` as the second argument. Like `get`, is safe against `null` or `undefined`.

```js
f.getIn(1, [])
// 1

f.getIn({one: {two: 2}}, ['one', 'two'])
// 2
```

#### `function getter`

`ƒ(key) => ƒ(any) => any`

Delayed `get`. Equivalent to `x => f.get(x, key)`.

```js
f.map([{value: 10}, {value: 20}], f.getter('value'))
// [10, 20]
```

Convenient, but also a performance malpractice. The "right" way, performance-wise, is to statically define a getter function with a hardcoded property:

```js
function getValue(val) {return val?.value}

f.map([{value: 10}, {value: 20}], getValue)
// [10, 20]
```

#### `function assign`

`ƒ(tar, ...args) => typeof tar`

Like [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign), but stricter:

  * `tar` must be a mutable object.
  * Each source must be a non-list object, `null`, or `undefined`.

```js
const target = {}
f.assign(target, {one: 10}, {two: 20})
// {one: 10, two: 20}
```

#### `function show`

`ƒ(val) => string`

Returns a string describing the value. Prints plain data as JSON to avoid the dreaded `[object Object]`. Prints functions as their names or source code. Convenient for interpolating things into error messages. Used internally in assertion functions such as [`req`](#function-req).

```js
f.show(10)
// '10'

f.show(f.show)
// 'show'

f.show({one: 10, two: 20})
// '{"one":10,"two":20}'
```

---

## License

https://unlicense.org

## Miscellaneous

I'm receptive to suggestions. If this library _almost_ satisfies you but needs changes, open an issue or chat me up. Contacts: https://mitranim.com/#contacts
