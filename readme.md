## Overview

`fpx`: **F**unctional **P**rogramming e**X**tensions for JavaScript. Lightweight replacement for Lodash. Stuff that should be built into the language.

Features:

  * Higher-order functions for data structures.
    * Common FP tools like `map`, `filter`, and many more.
    * Compatible with arbitrary iterables such as lists, sets, maps, dicts.
  * Boolean tests for common types and interfaces.
  * Minifiable type assertions.
  * Type conversions.
  * Tuned for performance.
  * Small and dependency-free. Single file. Native JS module.

Differences from Lodash:

  * Supports arbitrary iterables and iterators, including sets and maps.
  * Type assertions and conversions.
  * Much smaller and simpler.

## TOC

* [#Usage](#usage)
* [#Why](#why)
* [#Perf](#perf)
* [#API](#api)
   * [#`function bind`](#function-bind)
   * [#`function not`](#function-not)
   * [#`function is`](#function-is)
   * [#`function truthy`](#function-truthy)
   * [#`function falsy`](#function-falsy)
   * [#`function isNil`](#function-isnil)
   * [#`function isSome`](#function-issome)
   * [#`function isBool`](#function-isbool)
   * [#`function isNum`](#function-isnum)
   * [#`function isFin`](#function-isfin)
   * [#`function isFinNeg`](#function-isfinneg)
   * [#`function isFinPos`](#function-isfinpos)
   * [#`function isInt`](#function-isint)
   * [#`function isNat`](#function-isnat)
   * [#`function isIntNeg`](#function-isintneg)
   * [#`function isIntPos`](#function-isintpos)
   * [#`function isNaN`](#function-isnan)
   * [#`function isInf`](#function-isinf)
   * [#`function isBigInt`](#function-isbigint)
   * [#`function isStr`](#function-isstr)
   * [#`function isSym`](#function-issym)
   * [#`function isKey`](#function-iskey)
   * [#`function isJunk`](#function-isjunk)
   * [#`function isComp`](#function-iscomp)
   * [#`function isPrim`](#function-isprim)
   * [#`function isFun`](#function-isfun)
   * [#`function isFunSync`](#function-isfunsync)
   * [#`function isFunGen`](#function-isfungen)
   * [#`function isFunAsync`](#function-isfunasync)
   * [#`function isFunAsyncGen`](#function-isfunasyncgen)
   * [#`function isObj`](#function-isobj)
   * [#`function isStruct`](#function-isstruct)
   * [#`function isArr`](#function-isarr)
   * [#`function isReg`](#function-isreg)
   * [#`function isDate`](#function-isdate)
   * [#`function isValidDate`](#function-isvaliddate)
   * [#`function isInvalidDate`](#function-isinvaliddate)
   * [#`function isSet`](#function-isset)
   * [#`function isMap`](#function-ismap)
   * [#`function isPromise`](#function-ispromise)
   * [#`function isIter`](#function-isiter)
   * [#`function isIterAsync`](#function-isiterasync)
   * [#`function isIterator`](#function-isiterator)
   * [#`function isIteratorAsync`](#function-isiteratorasync)
   * [#`function isGen`](#function-isgen)
   * [#`function isCls`](#function-iscls)
   * [#`function isDict`](#function-isdict)
   * [#`function isList`](#function-islist)
   * [#`function isSeq`](#function-isseq)
   * [#`function isInst`](#function-isinst)
   * [#`function hasMeth`](#function-hasmeth)
   * [#`function isListOf`](#function-islistof)
   * [#`function isEmpty`](#function-isempty)
   * [#`function isVac`](#function-isvac)
   * [#`function req`](#function-req)
   * [#`function opt`](#function-opt)
   * [#`function reqInst`](#function-reqinst)
   * [#`function optInst`](#function-optinst)
   * [#`function only`](#function-only)
   * [#`function arrOf`](#function-arrof)
   * [#`function prim`](#function-prim)
   * [#`function bool`](#function-bool)
   * [#`function num`](#function-num)
   * [#`function fin`](#function-fin)
   * [#`function int`](#function-int)
   * [#`function nat`](#function-nat)
   * [#`function intPos`](#function-intpos)
   * [#`function str`](#function-str)
   * [#`function dict`](#function-dict)
   * [#`function struct`](#function-struct)
   * [#`function inst`](#function-inst)
   * [#`function add`](#function-add)
   * [#`function sub`](#function-sub)
   * [#`function mul`](#function-mul)
   * [#`function div`](#function-div)
   * [#`function rem`](#function-rem)
   * [#`function lt`](#function-lt)
   * [#`function gt`](#function-gt)
   * [#`function lte`](#function-lte)
   * [#`function gte`](#function-gte)
   * [#`function neg`](#function-neg)
   * [#`function inc`](#function-inc)
   * [#`function dec`](#function-dec)
   * [#`function nop`](#function-nop)
   * [#`function True`](#function-true)
   * [#`function False`](#function-false)
   * [#`function id`](#function-id)
   * [#`function di`](#function-di)
   * [#`function val`](#function-val)
   * [#`function panic`](#function-panic)
   * [#`function jsonDecode`](#function-jsondecode)
   * [#`function jsonEncode`](#function-jsonencode)
   * [#`function show`](#function-show)
   * [#`function npo`](#function-npo)
   * [#`function hasOwn`](#function-hasown)
   * [#`function hasOwnEnum`](#function-hasownenum)
   * [#`function mut`](#function-mut)
   * [#`function mapDict`](#function-mapdict)
   * [#`function pick`](#function-pick)
   * [#`function omit`](#function-omit)
   * [#`function pickKeys`](#function-pickkeys)
   * [#`function omitKeys`](#function-omitkeys)
   * [#`function more`](#function-more)
   * [#`function alloc`](#function-alloc)
   * [#`function arr`](#function-arr)
   * [#`function arrCopy`](#function-arrcopy)
   * [#`function slice`](#function-slice)
   * [#`function keys`](#function-keys)
   * [#`function values`](#function-values)
   * [#`function valuesCopy`](#function-valuescopy)
   * [#`function entries`](#function-entries)
   * [#`function reify`](#function-reify)
   * [#`function vac`](#function-vac)
   * [#`function indexOf`](#function-indexof)
   * [#`function includes`](#function-includes)
   * [#`function concat`](#function-concat)
   * [#`function append`](#function-append)
   * [#`function prepend`](#function-prepend)
   * [#`function len`](#function-len)
   * [#`function hasLen`](#function-haslen)
   * [#`function each`](#function-each)
   * [#`function map`](#function-map)
   * [#`function mapMut`](#function-mapmut)
   * [#`function mapCompact`](#function-mapcompact)
   * [#`function filter`](#function-filter)
   * [#`function reject`](#function-reject)
   * [#`function compact`](#function-compact)
   * [#`function remove`](#function-remove)
   * [#`function fold`](#function-fold)
   * [#`function find`](#function-find)
   * [#`function procure`](#function-procure)
   * [#`function every`](#function-every)
   * [#`function some`](#function-some)
   * [#`function head`](#function-head)
   * [#`function last`](#function-last)
   * [#`function init`](#function-init)
   * [#`function tail`](#function-tail)
   * [#`function take`](#function-take)
   * [#`function count`](#function-count)
   * [#`function compare`](#function-compare)
   * [#`function compareFin`](#function-comparefin)
   * [#`function sort`](#function-sort)
   * [#`function reverse`](#function-reverse)
   * [#`function index`](#function-index)
   * [#`function group`](#function-group)
   * [#`function partition`](#function-partition)
   * [#`function sum`](#function-sum)
   * [#`function zip`](#function-zip)
   * [#`function mapFrom`](#function-mapfrom)
   * [#`function range`](#function-range)
   * [#`function span`](#function-span)
   * [#`function times`](#function-times)
   * [#`function repeat`](#function-repeat)
   * [#`function set`](#function-set)
   * [#`function setCopy`](#function-setcopy)
* [#License](#license)
* [#Misc](#misc)

## Usage

In browsers and Deno, import by URL:

```js
import * as f from 'https://cdn.jsdelivr.net/npm/fpx@0.12.1/fpx.mjs'
```

When using Node or NPM-oriented bundlers like Esbuild:

```sh
npm i -E fpx
```

```js
import * as f from 'fpx'
import * as f from './node_modules/fpx/fpx.mjs'
```

## Why

* Built-ins are insufficient.
* Other libraries are too large.
* Other libraries are annoying to use.
* Other libraries lack vital tools.

### Simplicity

> Programs must be written for people to read, and only incidentally for machines to execute.
>
> _— Abelson & Sussman, "Structure and Interpretation of Computer Programs"_

I believe that _all code_ should strive to be simple and educational. This gives me a massive distaste for most code.

Fpx is tuned for brevity, readability, clarity in addition to performance. If you want to understand how this kind of library works, how higher-order functions work, how to manipulate JS data structures, Fpx should hopefully provide a good read.

### Assertions

Assertions go a **long** way in debugging. Fail fast, catch bugs early. In asynchronous code, validating inputs as early as possible, instead of letting it fail mysteriously later, can save you hours of debugging.

Here's the traditional way of doing assertions:

```js
function someHigherOrderFunction(fun) {
  if (typeof fun !== 'function') {
    throw TypeError(`expected a function, got ${fun}`)
  }
  // Actual code after the assertion.
}

someHigherOrderFunction({one: 10})
// uncaught TypeError: expected a function, got [object Object]
```

Annoying to type and **really** bad for minification. Some folks strip assertions from production builds, but I find the idea flawed. Even in production, failing fast is better than failing mysteriously, and assertions help with debugging when it inevitably fails.

Fpx provides a better alternative:

```js
function someHigherOrderFunction(fun) {
  f.req(fun, f.isFun)
  // Actual code after the assertion.
}

someHigherOrderFunction({one: 10})
// uncaught TypeError: expected {"one":10} to satisfy test isFun
```

Much better. Easy to type with editor autocompletion, produces good error messages, and minifies really well. In a minified build, the function name will be mangled, which is good for bundle size. The mangled name is a non-issue with a source map, which you need for debugging anyway.

To support this style of coding, Fpx provides [#`req`](#function-req) and a bevy of boolean tests.

## Perf

Fpx is carefully tuned for performance. Functions covered by benchmarks appear comparable to their native or Lodash equivalents. Many appear significantly faster.

JS performance is complicated and _very_ unstable, Fpx's benchmark suite is limited and checked only in V8. When in doubt, measure in your particular environment.

## API

Also see changelog: [changelog.md](changelog.md).

### `function bind`

Links: [source](fpx.mjs#L3); [test/example](test/test.mjs#L63).

Like [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), but instead of taking `this` as an argument, takes it contextually. By default `this` is `undefined`. To set it, use `f.bind.call`.

Returns a new function that represents [partial application](https://en.wikipedia.org/wiki/Partial_application) of the given function, a common tool in functional programming. When called, it joins arguments from both calls and invokes the original function. Think of it like splitting a function call in two, or more. Performance is inferior to closures; avoid in hotspots.

```js
const inc = f.bind(f.add, 1)

inc(2)
// 3
```

Note: Fpx no longer provides facilities for currying. Experience has shown it to be extremely error prone. Currying, as seen in purely functional languages such as Haskell, tends to care about the amount of arguments. Calling a curried function may either create a new function, or call the underlying function (possibly side-effectful). This approach works reasonably well in statically typed languages, but not in JS where all functions are variadic and it's conventional to sometimes pass extra utility arguments "just in case", which the callee may or may not care about. `bind` is different because the created function will always call the original function, regardless of how many arguments were passed.

### `function not`

Links: [source](fpx.mjs#L5); [test/example](test/test.mjs#L82).

Returns a new function that negates the result of the given function, like a delayed `!`.

```js
function eq(a, b) {return a === b}

const different = f.not(eq)

different(10, 20)
// !eq(10, 20) = true

// equivalent:
function different(a, b) {return !eq(a, b)}
```

### `function is`

Links: [source](fpx.mjs#L12); [test/example](test/test.mjs#L106).

Identity test: same as `===`, but considers `NaN` equal to `NaN`. Equivalent to [_SameValueZero_](https://www.ecma-international.org/ecma-262/6.0/#sec-samevaluezero) as defined by the language spec. Used internally in Fpx for all identity tests.

Note that [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) implements [_SameValue_](https://www.ecma-international.org/ecma-262/6.0/#sec-samevalue), which treats `-0` and `+0` as _distinct values_. This is typically undesirable. As a result, you should prefer `f.is` over `===` or `Object.is`.

```js
f.is(1, '1')
// false

f.is(NaN, NaN)
// true
```

### `function truthy`

Links: [source](fpx.mjs#L13); [test/example](test/test.mjs#L92).

Same as `!!` or `Boolean`. Sometimes useful with higher-order functions.

### `function falsy`

Links: [source](fpx.mjs#L14); [test/example](test/test.mjs#L99).

Same as `!`. Sometimes useful with higher-order functions.

### `function isNil`

Links: [source](fpx.mjs#L15); [test/example](test/test.mjs#L116).

True for `null` and `undefined`. Same as `value == null`. Incidentally, these are the only values that produce an exception when attempting to read a property: `null.someProperty`.

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

### `function isSome`

Links: [source](fpx.mjs#L16); [test/example](test/test.mjs#L124).

Inverse of [#`isNil`](#function-isnil). False for `null` and `undefined`, true for other values.

### `function isBool`

Links: [source](fpx.mjs#L17); [test/example](test/test.mjs#L132).

Same as `typeof val === 'boolean'`.

### `function isNum`

Links: [source](fpx.mjs#L18); [test/example](test/test.mjs#L141).

Same as `typeof val === 'number'`. True if the value is a primitive number, _including_ `NaN` and `±Infinity`. In most cases you should use `isFin` instead.

```js
f.isNum(1)
// true
f.isNum('1')
// false
f.isNum(NaN)
// true <-- WTF
```

### `function isFin`

Links: [source](fpx.mjs#L19); [test/example](test/test.mjs#L152).

Same as ES2015's [`Number.isFinite`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite). True if `val` is a primitive number and is _not_ `NaN` or `±Infinity`. In most cases you should prefer `isFin` over `isNum`.

```js
f.isFin(1)
// true
f.isFin('1')
// false
f.isFin(NaN)
// false
```

### `function isFinNeg`

Links: [source](fpx.mjs#L20); [test/example](test/test.mjs#L166).

True if value is finite (via [#`isFin`](#function-isfin)) and < 0.

### `function isFinPos`

Links: [source](fpx.mjs#L21); [test/example](test/test.mjs#L185).

True if value is finite (via [#`isFin`](#function-isfin)) and > 0.

### `function isInt`

Links: [source](fpx.mjs#L22); [test/example](test/test.mjs#L204).

True if value is an integer: finite via [#`isFin`](#function-isfin), without a fractional part.

### `function isNat`

Links: [source](fpx.mjs#L23); [test/example](test/test.mjs#L222).

True if value is a natural number: integer >= 0. Also see [#`isIntPos`](#function-isintpos).

### `function isIntNeg`

Links: [source](fpx.mjs#L24); [test/example](test/test.mjs#L240).

True if value is integer < 0. Also see [#`isFinNeg`](#function-isfinneg).

### `function isIntPos`

Links: [source](fpx.mjs#L25); [test/example](test/test.mjs#L259).

True if value is integer > 0. Also see [#`isNat`](#function-isnat), [#`isFinPos`](#function-isfinpos).

### `function isNaN`

Links: [source](fpx.mjs#L26); [test/example](test/test.mjs#L278).

Same as ES2015's [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN). True if value is _actually_ `NaN`. Doesn't coerce non-numbers to numbers, unlike global `isNaN`.

### `function isInf`

Links: [source](fpx.mjs#L27); [test/example](test/test.mjs#L293).

True if value is `-Infinity` or `Infinity`.

### `function isBigInt`

Links: [source](fpx.mjs#L28); [test/example](test/test.mjs#L308).

True if value is a primitive [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). False for all other inputs, including `BigInt` object wrappers.

### `function isStr`

Links: [source](fpx.mjs#L29); [test/example](test/test.mjs#L327).

Same as `typeof val === 'string'`. True if value is a primitive string.

### `function isSym`

Links: [source](fpx.mjs#L30); [test/example](test/test.mjs#L334).

Same as `typeof val === 'symbol'`. True if value is a primitive symbol.

### `function isKey`

Links: [source](fpx.mjs#L31); [test/example](test/test.mjs#L341).

True if value qualifies as a dictionary key. True for all primitives excluding garbage values via [#`isJunk`](#function-isjunk).

### `function isJunk`

Links: [source](fpx.mjs#L32); [test/example](test/test.mjs#L361).

True for garbage values: [#nil](#function-isnil), [#`NaN`](#function-isnan), [#`±Infinity`](#function-isinf).

### `function isComp`

Links: [source](fpx.mjs#L33); [test/example](test/test.mjs#L376).

True if value is "composite" / "compound" / "complex". Opposite of [#`isPrim`](#function-isprim). Definition:

```js
function isComp(val) {return isObj(val) || isFun(val)}
```

### `function isPrim`

Links: [source](fpx.mjs#L34); [test/example](test/test.mjs#L390).

True if value is a JS primitive: not an object, not a function. Opposite of [#`isComp`](#function-iscomp).

### `function isFun`

Links: [source](fpx.mjs#L35); [test/example](test/test.mjs#L404).

Same as `typeof val === 'function'`. True if value is any function, regardless of its type (arrow, async, generator, etc.).

### `function isFunSync`

Links: [source](fpx.mjs#L36); [test/example](test/test.mjs#L428).

True if the input is a normal sync function. False for generator functions or async functions.

### `function isFunGen`

Links: [source](fpx.mjs#L37); [test/example](test/test.mjs#L438).

True if the input is a sync generator function. False for normal sync functions and async functions.

### `function isFunAsync`

Links: [source](fpx.mjs#L38); [test/example](test/test.mjs#L448).

True if the input is an async non-generator function. False for sync functions, generator functions, or async generator functions.

### `function isFunAsyncGen`

Links: [source](fpx.mjs#L39); [test/example](test/test.mjs#L458).

True if the input is an async generator function. False for sync functions and async non-generator functions.

### `function isObj`

Links: [source](fpx.mjs#L40); [test/example](test/test.mjs#L468).

Same as `typeof val === 'object' && val !== null`. True for any JS object: plain dict, array, various other classes. Doesn't include functions, even though JS functions are extensible objects.

Note: this is _not_ equivalent to Lodash's `_.isObject`, which counts functions as objects. Use [#`isComp`](#function-iscomp) for that.

For plain objects used as dictionaries, see [#`isDict`](#function-isdict). For fancy non-list objects, see [#`isStruct`](#function-isstruct).

### `function isStruct`

Links: [source](fpx.mjs#L41); [test/example](test/test.mjs#L484).

True if value is a non-iterable object. Excludes both [#sync iterables](#function-isiter) and [#async iterables](#function-isiterasync). Note that [#dicts](#function-isdict) are automatically structs, but not all structs are dicts.

### `function isArr`

Links: [source](fpx.mjs#L42); [test/example](test/test.mjs#L501).

Alias for [`Array.isArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray). Used internally for all array checks.

True if value is an instance of [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or its subclass. False for all other values, including non-array objects whose prototype is an array.

### `function isReg`

Links: [source](fpx.mjs#L43); [test/example](test/test.mjs#L513).

True if value is an instance of [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) or its subclass.

### `function isDate`

Links: [source](fpx.mjs#L44); [test/example](test/test.mjs#L521).

True of value is an instance of [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). Most of the time you should prefer [#`isValidDate`](#function-isvaliddate).

### `function isValidDate`

Links: [source](fpx.mjs#L45); [test/example](test/test.mjs#L529).

True of value is an instance of [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) and its timestamp is [#finite](#function-isfin) rather than `NaN`.

### `function isInvalidDate`

Links: [source](fpx.mjs#L46); [test/example](test/test.mjs#L536).

True of value is an instance of [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) representing an invalid date whose timestamp is `NaN`.

### `function isSet`

Links: [source](fpx.mjs#L47); [test/example](test/test.mjs#L543).

True if value is an instance of [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) or its subclass.

### `function isMap`

Links: [source](fpx.mjs#L48); [test/example](test/test.mjs#L553).

True if value is an instance of [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) or its subclass.

### `function isPromise`

Links: [source](fpx.mjs#L49); [test/example](test/test.mjs#L563).

True if the value satisfies the ES2015 [promise interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

### `function isIter`

Links: [source](fpx.mjs#L50); [test/example](test/test.mjs#L572).

True if the value satisfies the ES2015 [sync iterable interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols). For _iterator_ rather than _iterable_, use [#`isIterator`](#function-isiterator).

### `function isIterAsync`

Links: [source](fpx.mjs#L51); [test/example](test/test.mjs#L598).

True if the value satisfies the ES2015 [async iterable interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of). For _iterator_ rather than _iterable_, use [#`isIteratorAsync`](#function-isiteratorasync).

### `function isIterator`

Links: [source](fpx.mjs#L52); [test/example](test/test.mjs#L615).

True if the value satisfies the ES2015 [sync iterator interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols). For _iterable_ rather than _iterator_, use [#`isIter`](#function-isiter).

### `function isIteratorAsync`

Links: [source](fpx.mjs#L53); [test/example](test/test.mjs#L641).

True if the value satisfies the ES2015 [async iterator interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of). For _iterable_ rather than _iterator_, use [#`isIterAsync`](#function-isiterasync).

### `function isGen`

Links: [source](fpx.mjs#L54); [test/example](test/test.mjs#L667).

True if value is a [#sync iterator](#function-isiterator) created by calling a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

### `function isCls`

Links: [source](fpx.mjs#L55); [test/example](test/test.mjs#L727).

True if the input is a function with a prototype, likely to be a class. False for arrow functions such as `() => {}`, which don't have a prototype.

### `function isDict`

Links: [source](fpx.mjs#L56); [test/example](test/test.mjs#L739).

True for a "plain object" created via `{...}` or `Object.create(null)`. False for any other input, including instances of any class other than `Object`. Roughly equivalent to Lodash's `_.isPlainObject`.

See [#`isStruct`](#function-isstruct) for a more general definition of a non-iterable object.

### `function isList`

Links: [source](fpx.mjs#L57); [test/example](test/test.mjs#L752).

True for any array-like such as: `[]`, `arguments`, `TypedArray`, `NodeList`, etc. Used internally for most list checks. Note that _primitive strings are not considered lists_.

### `function isSeq`

Links: [source](fpx.mjs#L58); [test/example](test/test.mjs#L767).

True for any of:

  * [#Array](#function-isarr)
  * [#List](#function-islist)
  * [#Set](#function-isset)
  * [#Iterator](#function-isiterator)

Many Fpx functions support arbitrary data structures compatible with [#`values`](#function-values), but some functions such as [#`arr`](#function-arr) allow only sequences, for sanity checking.

### `function isInst`

Links: [source](fpx.mjs#L63); [test/example](test/test.mjs#L784).

Signature: `(val, Cls) => bool`.

Same as `instanceof` but _does not_ implicitly convert the operand to an object. True only if the operand is already an instance of the given class.

### `function hasMeth`

Links: [source](fpx.mjs#L68); [test/example](test/test.mjs#L800).

True if the the given value has the given named method. Safe to call on primitives such as `null`. Always false for primitives.

### `function isListOf`

Links: [source](fpx.mjs#L70); [test/example](test/test.mjs#L820).

Shortcut for `isList(val) && every(val, fun)`. True if the input is a list of values that satisfy the given predicate function.

### `function isEmpty`

Links: [source](fpx.mjs#L75); [test/example](test/test.mjs#L839).

True if the input is an empty collection such as list, set, map, or a primitive such as `null`. False for any other non-primitive. Treating primitives as "empty" is consistent with other Fpx functions that operate on collections.

### `function isVac`

Links: [source](fpx.mjs#L82); [test/example](test/test.mjs#L856).

Short for "is vacuous" or "is vacated". Could also be called "is falsy deep". True if the input is [#falsy](#function-falsy) or a [#list](#function-islist) where all values are vacuous, recursively. Does not iterate non-lists. Also see complementary function [#`vac`](#function-vac).

### `function req`

Links: [source](fpx.mjs#L89); [test/example](test/test.mjs#L894).

Signature: `(val, test) => val` where `test: val => bool`.

Short for "require". Minification-friendly assertion. If `!test(val)`, throws an informative `TypeError`. Otherwise, returns `val` as-is.

```js
f.req({one: `two`}, f.isObj)
// {one: `two`}

f.req('str', f.isFun)
// uncaught TypeError: expected "str" to satisfy test isFun
```

### `function opt`

Links: [source](fpx.mjs#L97); [test/example](test/test.mjs#L915).

Short for "optional". If `val` is [#non-nil](#function-issome), uses [#`req`](#function-req) to validate it. Returns `val` as-is.

### `function reqInst`

Links: [source](fpx.mjs#L108); [test/example](test/test.mjs#L941).

Signature: `(val, Cls) => val`.

Short for "require instance". Asserts that `val` is an instance of the given class. Returns `val` as-is.

### `function optInst`

Links: [source](fpx.mjs#L116); [test/example](test/test.mjs#L963).

Short for "optional instance". If `val` is [#non-nil](#function-issome), uses [#`reqInst`](#function-reqinst) to validate it. Returns `val` as-is.

### `function only`

Links: [source](fpx.mjs#L121); [test/example](test/test.mjs#L995).

Signature: `(val, test) => val` where `test: val => bool`.

Type filtering utility. If `val` satisfies the given test function, returns `val` as-is. Otherwise returns `undefined`.

### `function arrOf`

Links: [source](fpx.mjs#L123); [test/example](test/test.mjs#L1022).

Signature: `(seq<A>, test) => A[]` where `test: A => true`.

Shortcut. Converts the input to an array via [#`arr`](#function-arr) and asserts that every element satisfies the given test function. Returns the resulting array.

### `function prim`

Links: [source](fpx.mjs#L130); [test/example](test/test.mjs#L1034).

Shortcut for asserting that the input is a primitive. Throws for non-primitive inputs. Returns the input as-is.

### `function bool`

Links: [source](fpx.mjs#L131); [test/example](test/test.mjs#L1051).

Similar to `val ?? false` but `val` must be [#nil](#function-isnil) or a [#boolean](#function-isbool), otherwise throws.

### `function num`

Links: [source](fpx.mjs#L132); [test/example](test/test.mjs#L1066).

Similar to `val ?? 0` but `val` must be [#nil](#function-isnil) or a [#number](#function-isnum), otherwise throws.

### `function fin`

Links: [source](fpx.mjs#L133); [test/example](test/test.mjs#L1082).

Similar to `val ?? 0` but `val` must be [#nil](#function-isnil) or a [#finite number](#function-isfin), otherwise throws.

### `function int`

Links: [source](fpx.mjs#L134); [test/example](test/test.mjs#L1098).

Similar to `val ?? 0` but `val` must be [#nil](#function-isnil) or an [#integer](#function-isint), otherwise throws.

### `function nat`

Links: [source](fpx.mjs#L135); [test/example](test/test.mjs#L1117).

Similar to `val ?? 0` but `val` must be [#nil](#function-isnil) or a [#natural number](#function-isnat), otherwise throws.

### `function intPos`

Links: [source](fpx.mjs#L136); [test/example](test/test.mjs#L1137).

Similar to `val ?? 0` but `val` must be [#nil](#function-isnil) or a [#positive integer](#function-isintpos), otherwise throws.

### `function str`

Links: [source](fpx.mjs#L137); [test/example](test/test.mjs#L1157).

Similar to `val ?? ''` but `val` must be [#nil](#function-isnil) or a [#string](#function-isstr), otherwise throws.

### `function dict`

Links: [source](fpx.mjs#L138); [test/example](test/test.mjs#L1170).

Similar to `val ?? Object.create(null)` but `val` must be [#nil](#function-isnil) or a [#dict](#function-isdict), otherwise throws.

### `function struct`

Links: [source](fpx.mjs#L139); [test/example](test/test.mjs#L1188).

Similar to `val ?? Object.create(null)` but `val` must be [#nil](#function-isnil) or a [#struct](#function-isstruct), otherwise throws.

Most Fpx functions that operate on data structures, such as [#`filter`](#function-filter), support structs, treating them similarly to maps. A struct is considered a collection of its [#`values`](#function-values). Iterating over [#`keys`](#function-keys) or [#`entries`](#function-entries) is opt-in.

### `function inst`

Links: [source](fpx.mjs#L140); [test/example](test/test.mjs#L1206).

Signature: `(any, typeof A) => A`.

Idempotently converts an arbitrary input to a given class:

  * If `isInst(val, cls)`, returns `val` as-is.
  * Otherwise returns `new cls(val)`.

```js
const newInst = f.inst([10, 20, 30], Set)
// Set{10, 20, 30}

const oldInst = f.inst(newInst, Set)
// Set{10, 20, 30}

newInst === oldInst
// true
```

### `function add`

Links: [source](fpx.mjs#L148); [test/example](test/test.mjs#L1239).

Same as `+`.

### `function sub`

Links: [source](fpx.mjs#L149); [test/example](test/test.mjs#L1245).

Same as `-`.

### `function mul`

Links: [source](fpx.mjs#L150); [test/example](test/test.mjs#L1251).

Same as `*`.

### `function div`

Links: [source](fpx.mjs#L151); [test/example](test/test.mjs#L1257).

Same as `/`.

### `function rem`

Links: [source](fpx.mjs#L152); [test/example](test/test.mjs#L1263).

Same as `%`.

### `function lt`

Links: [source](fpx.mjs#L153); [test/example](test/test.mjs#L1271).

Same as `<`.

### `function gt`

Links: [source](fpx.mjs#L154); [test/example](test/test.mjs#L1282).

Same as `>`.

### `function lte`

Links: [source](fpx.mjs#L155); [test/example](test/test.mjs#L1293).

Same as `<=`.

### `function gte`

Links: [source](fpx.mjs#L156); [test/example](test/test.mjs#L1304).

Same as `>=`.

### `function neg`

Links: [source](fpx.mjs#L157); [test/example](test/test.mjs#L1315).

Arithmetic negation. Same as unary `-`.

### `function inc`

Links: [source](fpx.mjs#L158); [test/example](test/test.mjs#L1327).

Increments by `1`.

### `function dec`

Links: [source](fpx.mjs#L159); [test/example](test/test.mjs#L1335).

Decrements by `1`.

### `function nop`

Links: [source](fpx.mjs#L163); [test/example](test/test.mjs#L1343).

Empty function. Functional equivalent of `;` or `undefined`. Sometimes useful with higher-order functions.

### `function True`

Links: [source](fpx.mjs#L164); [test/example](test/test.mjs#L1349).

Always returns `true`. Sometimes useful with higher order functions.

### `function False`

Links: [source](fpx.mjs#L165); [test/example](test/test.mjs#L1357).

Always returns `false`. Sometimes useful with higher order functions.

### `function id`

Links: [source](fpx.mjs#L166); [test/example](test/test.mjs#L1365).

Identity function: returns its first argument unchanged. Sometimes useful with higher-order functions.

### `function di`

Links: [source](fpx.mjs#L167); [test/example](test/test.mjs#L1372).

Returns its _second_ argument unchanged. Sometimes useful with higher-order functions.

### `function val`

Links: [source](fpx.mjs#L168); [test/example](test/test.mjs#L1379).

Takes a value and creates a function that always returns that value. Sometimes useful with higher order functions.

```js
const constant = f.val(1)

constant()
// 1

constant(`this input is ignored`)
// 1
```

### `function panic`

Links: [source](fpx.mjs#L169); [test/example](test/test.mjs#L1393).

Same as `throw` but an expression rather than a statement. Also sometimes useful with higher-order functions.

```js
const x = someTest ? someValue : f.panic(Error(`unreachable`))
```

### `function jsonDecode`

Links: [source](fpx.mjs#L170); [test/example](test/test.mjs#L1415).

Similar to [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) but sane rather than insane. If the input is [#nil](#function-isnil) or an empty string, returns `null`. Otherwise the input must be a primitive string. Throws on other inputs, without trying to stringify them.

### `function jsonEncode`

Links: [source](fpx.mjs#L171); [test/example](test/test.mjs#L1430).

Similar to [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) but sane rather than insane. Equivalent to `JSON.stringify(val ?? null)`. If the input is `undefined`, returns `'null'` (string) rather than `undefined` (nil). Output is _always_ a valid JSON string.

### `function show`

Links: [source](fpx.mjs#L173); [test/example](test/test.mjs#L44).

Returns a string describing the value. When relevant, prints data as JSON to avoid the dreaded `[object Object]`. Prints functions as their names or source code. Convenient for interpolating things into error messages. Used internally in assertion functions such as [#`req`](#function-req).

### `function npo`

Links: [source](fpx.mjs#L182); [test/example](test/test.mjs#L1444).

Short for "null-prototype object". Syntactic shortcut for `Object.create(null)`.

### `function hasOwn`

Links: [source](fpx.mjs#L184); [test/example](test/test.mjs#L1450).

Same as [`Object.prototype.hasOwnProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) but shorter and safe to call on primitives. Always false for primitives.

### `function hasOwnEnum`

Links: [source](fpx.mjs#L189); [test/example](test/test.mjs#L1464).

Same as [`Object.prototype.propertyIsEnumerable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable) but shorter and safe to call on primitives. Always false for primitives.

### `function mut`

Links: [source](fpx.mjs#L194); [test/example](test/test.mjs#L1479).

Signature: `(tar, src) => tar`.

Similar to [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). Differences:

  * Supports only one source argument.
  * Much faster.
  * Much safer:
    * Target must be a [#struct](#function-isstruct). Throws if target is a function or iterable.
    * Source must be nil or a struct. Throws if source is an iterable, non-nil primitive, etc.
    * Does not override inherited properties.
    * Does not override own non-enumerable properties.

### `function mapDict`

Links: [source](fpx.mjs#L202); [test/example](test/test.mjs#L1602).

Signature: `({[Key: A]}, A => B) => {[Key: B]}`.

Similar to [#`map`](#function-map) but for dicts. Creates a version of the given dict where values have been replaced by calling the given function for each value. Returns an empty dict if the input is [#nil](#function-isnil).

### `function pick`

Links: [source](fpx.mjs#L209); [test/example](test/test.mjs#L1617).

Signature: `({[Key: A]}, A => bool) => {[Key: A]}`.

Similar to [#`filter`](#function-filter) but for dicts. Returns a version of the given dict with only the properties for which `fun` returned something truthy. Returns an empty dict if the input is [#nil](#function-isnil).

### `function omit`

Links: [source](fpx.mjs#L219); [test/example](test/test.mjs#L1627).

Signature: `({[Key: A]}, A => bool) => {[Key: A]}`.

Similar to [#`reject`](#function-reject) but for dicts. Returns a version of the given dict without properties for which `fun` returned something truthy. Returns an empty dict if the input is [#nil](#function-isnil).

### `function pickKeys`

Links: [source](fpx.mjs#L221); [test/example](test/test.mjs#L1637).

Signature: `({[Key: A]}, keys) => {[Key: A]}`.

Returns a version of the given dict, keeping only the given properties. Keys can be either a `Set` or an arbitrary [#sequence](#function-arr). Each key must satisfy [#`isKey`](#function-iskey). Existence is not required: missing properties are silently ignored. Returns an empty dict if the input is [#nil](#function-isnil).

### `function omitKeys`

Links: [source](fpx.mjs#L228); [test/example](test/test.mjs#L1655).

Signature: `({[Key: A]}, keys) => {[Key: A]}`.

Returns a version of the given dict without the given properties. Keys must be an arbitrary sequence convertible to a `Set`. Returns an empty dict if the input is [#nil](#function-isnil).

### `function more`

Links: [source](fpx.mjs#L238); [test/example](test/test.mjs#L1673).

Takes an [#iterator](#function-isiterator), consumes one value, and returns true if the iterator is not yet finished. Shortcut for `val.next().done === false`.

### `function alloc`

Links: [source](fpx.mjs#L239); [test/example](test/test.mjs#L1683).

Shortcut for allocating an array with a sanity check. Same as `Array(N)` but ensures that the input is a [#natural number](#function-nat) suitable for array length. Avoids unintentionally passing any non-natural input such as `Array(-1)`. Allows [#nil](#function-isnil), replacing it with `0`.

### `function arr`

Links: [source](fpx.mjs#L240); [test/example](test/test.mjs#L1692).

Converts an arbitrary [#sequence](#function-isseq) to an array. Allows the following inputs:

  * [#Nil](#function-isnil): return `[]`.
  * [#Array](#function-isarr): return as-is.
  * [#List](#function-islist): convert via `Array.prototype.slice`.
  * [#Set](#function-isset) or arbitrary [#iterator](#function-isiterator): convert to array by iterating.

Unlike [#`values`](#function-values), `arr` rejects other inputs such as non-nil primitives, dicts, maps, arbitrary iterables, ensuring that the input is always a sequence.

### `function arrCopy`

Links: [source](fpx.mjs#L241); [test/example](test/test.mjs#L1724).

Like [#`arr`](#function-arr), converts an arbitrary sequence to an array. Unlike `arr,` always makes a copy. Mutating the output doesn't affect the original.

### `function slice`

Links: [source](fpx.mjs#L246); [test/example](test/test.mjs#L1738).

Like [`Array.prototype.slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) but allows arbitrary [#sequences](#function-isseq) compatible with [#`arr`](#function-arr).

### `function keys`

Links: [source](fpx.mjs#L255); [test/example](test/test.mjs#L1770).

Takes an arbitrary input and returns an array of its keys:

  * For non-objects: always `[]`.
  * For [#iterables](#function-isiter) with `.keys()`: equivalent to converting the output of `.keys()` to an array. Implementation varies for performance.
    * Examples: `Array`, `Set`, `Map`, and more.
  * For [#lists](#function-islist): equivalent to above for arrays.
  * For [#iterators](#function-iterator): exhausts the iterator, returning an array of indexes equivalent to `f.span(f.len(iterator))`. See [#`span`](#function-span) and [#`len`](#function-len).
  * For [#structs](#function-isstruct): equivalent to [`Object.keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys).

### `function values`

Links: [source](fpx.mjs#L272); [test/example](test/test.mjs#L1793).

Takes an arbitrary input and returns an array of its values:

  * For non-objects: always `[]`.
  * For [#arrays](#function-isarr): **returns as-is without copying**.
  * For [#lists](#function-islist): slice to array.
  * For [#iterables](#function-isiter) with `.values()`: equivalent to converting the output of `.values()` to an array. Implementation varies for performance.
    * Examples: `Set`, `Map`, and more.
  * For [#iterators](#function-iterator): equivalent to `[...iterator]`.
  * For [#structs](#function-isstruct): equivalent to [`Object.values`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values).

### `function valuesCopy`

Links: [source](fpx.mjs#L295); [test/example](test/test.mjs#L1813).

Variant of [#`values`](#function-values) that always makes a copy. Mutating the output doesn't affect the original.

### `function entries`

Links: [source](fpx.mjs#L297); [test/example](test/test.mjs#L1835).

Takes an arbitrary input and returns an array of its entries (key-value tuples):

  * For non-objects: always `[]`.
  * For [#iterables](#function-isiter) with `.entries()`: equivalent to converting the output of `.entries()` to an array. Implementation varies for performance.
    * Examples: `Set`, `Map`, and more.
  * For [#lists](#function-islist): equivalent to above for arrays.
  * For [#iterators](#function-iterator): exhausts the iterator, returning an array of entries where keys are indexes starting with 0.
  * For [#structs](#function-isstruct): equivalent to [`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries).

### `function reify`

Links: [source](fpx.mjs#L323); [test/example](test/test.mjs#L1854).

Takes an arbitrary value and attempts to deeply materialize it. Any [#iterators](#function-iterator), or [#lists](#function-islist) that contain iterators, or lists that contain lists that contain iterators, etc., are converted to arrays. Does not inspect other data structures such as [#sets](#function-isset) or [#dicts](#function-isdict).

### `function vac`

Links: [source](fpx.mjs#L327); [test/example](test/test.mjs#L1879).

Complements [#`isVac`](#function-isvac). Returns `undefined` if the input is vacuous, otherwise returns the input as-is.

### `function indexOf`

Links: [source](fpx.mjs#L329); [test/example](test/test.mjs#L1886).

Like [`Array.prototype.indexOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf). Differences:

  * Uses [#`is`](#function-is) rather than `===`, therefore able to detect `NaN`.
  * Input may be [#nil](#function-isnil) or any [#list](#function-islist).

### `function includes`

Links: [source](fpx.mjs#L337); [test/example](test/test.mjs#L1907).

Like [`Array.prototype.includes`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes). Differences:

  * Supports arbitrary iterables compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.

### `function concat`

Links: [source](fpx.mjs#L338); [test/example](test/test.mjs#L1926).

Like [`Array.prototype.concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat). Differences:

  * Takes two arguments, without rest/spread.
  * Supports arbitrary iterables compatible with [#`values`](#function-values).
  * Iterables may be [#nil](#function-isnil), equivalent to `[]`.

Note: for individual elements, use [#`append`](#function-append) and
[#`prepend`](#function-prepend).

### `function append`

Links: [source](fpx.mjs#L339); [test/example](test/test.mjs#L1944).

Takes an arbitrary iterable compatible with [#`values`](#function-values) and appends an arbitrary value, returning the resulting array.

### `function prepend`

Links: [source](fpx.mjs#L340); [test/example](test/test.mjs#L1959).

Takes an arbitrary iterable compatible with [#`values`](#function-values) and prepends an arbitrary value, returning the resulting array.

### `function len`

Links: [source](fpx.mjs#L342); [test/example](test/test.mjs#L1994).

Universal length measurement:

  * For non-objects: always 0.
  * For iterables:
    * For [#lists](#function-islist): same as `.length`.
    * For ES2015 collections such as `Set`: same as `.size`.
    * For iterators: exhausts the iterator, returning element count.
  * For [#structs](#function-isstruct): equivalent to `Object.keys(val).length`.

### `function hasLen`

Links: [source](fpx.mjs#L366); [test/example](test/test.mjs#L1998).

Shortcut for [#`len`](#function-len) > 0.

### `function each`

Links: [source](fpx.mjs#L368); [test/example](test/test.mjs#L2030).

Signature: `(Iter<A>, A => void) => void`.

Similar to `Array.prototype.forEach`, `Set.prototype.forEach`, `Map.prototype.forEach`, and so on. Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Doesn't support `this` or additional arguments.

### `function map`

Links: [source](fpx.mjs#L373); [test/example](test/test.mjs#L2051).

Signature: `(Iter<A>, A => B) => B[]`.

Similar to [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Doesn't support `this` or additional arguments.

### `function mapMut`

Links: [source](fpx.mjs#L375); [test/example](test/test.mjs#L2084).

Similar to [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Differences:

  * Mutates the input (which must be an array).
  * Doesn't support `this` or additional arguments.

For a non-mutating version, see [#`map`](#function-map).

### `function mapCompact`

Links: [source](fpx.mjs#L383); [test/example](test/test.mjs#L2100).

Equivalent to `f.compact(f.map(val, fun))`. See [#`map`](#function-map) and [#`compact`](#function-compact).

### `function filter`

Links: [source](fpx.mjs#L385); [test/example](test/test.mjs#L2113).

Signature: `(Iter<A>, A => bool) => A[]`.

Similar to [`Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Doesn't support `this` or additional arguments.

### `function reject`

Links: [source](fpx.mjs#L392); [test/example](test/test.mjs#L2129).

Opposite of [#`filter`](#function-filter). Equivalent to `f.filter(val, f.not(fun))`.

### `function compact`

Links: [source](fpx.mjs#L394); [test/example](test/test.mjs#L2145).

Equivalent to `f.filter(val, f.id)`. Takes an arbitrary iterable and returns an array of its truthy [#`values`](#function-values), discarding falsy values.

### `function remove`

Links: [source](fpx.mjs#L400); [test/example](test/test.mjs#L2157).

Signature: `(Iter<A>, A) => A[]`.

Takes an arbitrary iterable and an element to remove. Returns an array of the iterable's [#`values`](#function-values), discarding each occurrence of this element, comparing via [#`is`](#function-is).

### `function fold`

Links: [source](fpx.mjs#L404); [test/example](test/test.mjs#L2174).

Signature: `(src: Iter<A>, acc: B, fun: (B, A) => B) => B`.

Similar to [`Array.prototype.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Arguments are `(src, acc, fun)` rather than `(fun, acc)`.
  * Accumulator argument is mandatory.
  * Doesn't support `this`.
  * Iterator function receives exactly two arguments: accumulator and next value.

### `function find`

Links: [source](fpx.mjs#L410); [test/example](test/test.mjs#L2190).

Signature: `(Iter<A>, A => bool) => A`.

Similar to [`Array.prototype.find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Doesn't support `this` or additional arguments.

### `function procure`

Links: [source](fpx.mjs#L416); [test/example](test/test.mjs#L2205).

Signature: `(src: Iter<A>, fun: A => B) => B`.

Similar to [#`find`](#function-find), but returns the first truthy result of calling the iterator function, rather than the corresponding element. Equivalent to `f.find(f.map(src, fun), f.id)` but more efficient.

### `function every`

Links: [source](fpx.mjs#L422); [test/example](test/test.mjs#L2222).

Signature: `(Iter<A>, A => bool) => bool`.

Similar to [`Array.prototype.every`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Doesn't support `this` or additional arguments.

### `function some`

Links: [source](fpx.mjs#L428); [test/example](test/test.mjs#L2241).

Signature: `(Iter<A>, A => bool) => bool`.

Similar to [`Array.prototype.some`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Doesn't support `this` or additional arguments.

### `function head`

Links: [source](fpx.mjs#L434); [test/example](test/test.mjs#L2260).

Takes an arbitrary iterable compatible with [#`values`](#function-values) and returns its first element or `undefined`.

### `function last`

Links: [source](fpx.mjs#L435); [test/example](test/test.mjs#L2270).

Takes an arbitrary iterable compatible with [#`values`](#function-values) and returns its last element or `undefined`.

### `function init`

Links: [source](fpx.mjs#L436); [test/example](test/test.mjs#L2280).

Short for "initial". Takes an arbitrary iterable compatible with [#`values`](#function-values) and returns an array of all its values except last.

### `function tail`

Links: [source](fpx.mjs#L437); [test/example](test/test.mjs#L2290).

Takes an arbitrary iterable compatible with [#`values`](#function-values) and returns an array of all its values except first.

### `function take`

Links: [source](fpx.mjs#L438); [test/example](test/test.mjs#L2300).

Takes an arbitrary iterable compatible with [#`values`](#function-values) and returns N values from the start.

### `function count`

Links: [source](fpx.mjs#L440); [test/example](test/test.mjs#L2332).

Signature: `(src: Iter<A>, fun: A => B) => nat`.

Takes an arbitrary iterable compatible with [#`values`](#function-values), calls the given function for each value, and returns the count of truthy results. The count is between 0 and iterable length.

### `function compare`

Links: [source](fpx.mjs#L448); [test/example](test/test.mjs#L2347).

Signature: `(a, b) => -1 | 0 | 1`.

Equivalent to the [default JS sort comparison algorithm](https://tc39.github.io/ecma262/#sec-sortcompare). Sometimes useful for sorting via [`Array.prototype.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) or [#`sort`](#function-sort), as a fallback.

### `function compareFin`

Links: [source](fpx.mjs#L459); [test/example](test/test.mjs#L2357).

Signature: `(a, b) => -1 | 0 | 1` where arguments are [#nil](#function-isnil) or [#finite](#function-isfin).

Sort comparison for finite numbers. Usable for [`Array.prototype.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) or [#`sort`](#function-sort). Throws on non-nil, non-finite arguments.

### `function sort`

Links: [source](fpx.mjs#L467); [test/example](test/test.mjs#L2369).

Signature: `(src: Iter<A>, fun?: (prev: A, next: A) => -1 | 0 | 1) => A[]`.

Similar to [`Array.prototype.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Always creates a new array. Does not mutate the input.

The comparison function is optional. If omitted, default JS sorting is used.

### `function reverse`

Links: [source](fpx.mjs#L468); [test/example](test/test.mjs#L2401).

Similar to [`Array.prototype.reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values).
  * Iterable may be [#nil](#function-isnil), equivalent to `[]`.
  * Always creates a new array. Does not mutate the input.

### `function index`

Links: [source](fpx.mjs#L470); [test/example](test/test.mjs#L2419).

Signature: `(Iter<A>, A => Key | any) => {[Key: A]}`.

Takes an arbitrary iterable compatible with [#`values`](#function-values) and returns an index where its values are _keyed_ by the given function, hence the name. The function is called for each value. If the function returns a [#valid key](#function-iskey), the key-value pair is added to the index. Invalid keys are ignored. If the function returns the same key for multiple values, previous values are lost.

Similar to Lodash's `_.keyBy`. Compare [#`group`](#function-group) which keeps all values for each group, rather than only the last.

### `function group`

Links: [source](fpx.mjs#L480); [test/example](test/test.mjs#L2464).

Signature: `(Iter<A>, A => Key | any) => {[Key: A[]]}`.

Takes an arbitrary iterable compatible with [#`values`](#function-values) and groups its values by keys generated by the given function. The function is called for each value. If the function returns a [#valid key](#function-iskey), the value is added to the index under that key. Invalid keys are ignored.

Compare [#`index`](#function-index), which keeps only the last value for each group.

### `function partition`

Links: [source](fpx.mjs#L490); [test/example](test/test.mjs#L2490).

Signature: `(Iter<A>, A => bool) => [A[], A[]]`.

Partitions the [#`values`](#function-values) of a given iterable, returning a tuple of two groups: values that satisfy the predicate and the remainder.

### `function sum`

Links: [source](fpx.mjs#L498); [test/example](test/test.mjs#L2507).

Signature: `(Iter<A>) => fin`.

Sums all finite [#`values`](#function-values) of an arbitrary iterable, ignoring all non-finite values.

### `function zip`

Links: [source](fpx.mjs#L503); [test/example](test/test.mjs#L2518).

Signature: `(Iter<[Key, A]>) => {[Key: A]}`.

Similar to [`Object.fromEntries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries). Differences:

  * Takes an arbitrary iterable compatible with [#`values`](#function-values) (more flexible).
    * Each value of this iterable must be a key-value pair.
  * Ignores entries where the first element is not a [#valid key](#function-iskey).
  * Returns a [#null-prototype object](#function-npo).
  * Slightly slower.

### `function mapFrom`

Links: [source](fpx.mjs#L509); [test/example](test/test.mjs#L2535).

Syntactic shortcut for creating a `Map` with inline keys and values. Shorter and less noisy than either `new Map` with an array of entries or chained `.set` calls.

### `function range`

Links: [source](fpx.mjs#L516); [test/example](test/test.mjs#L2542).

Signature: `(min: int, max: int) => int[]`.

Returns an array of contiguous integers in the range of `[min, max)`. The first value is `min`, the last value is `max - 1`.

### `function span`

Links: [source](fpx.mjs#L527); [test/example](test/test.mjs#L2557).

Signature: `nat => nat[]`.

Returns an array of the given length, where values are integers from 0. Shortcut for `f.range(0, length)`. Nil length is equivalent to 0.

### `function times`

Links: [source](fpx.mjs#L528); [test/example](test/test.mjs#L2568).

Signature: `(len: nat, fun: nat => A) => A[]`.

Takes an array length and a mapping function. Returns an array of the given length, where each element is the result of calling the given function, passing the element's index, starting with 0. Equivalent to `f.mapMut(f.span(len), fun)`.

### `function repeat`

Links: [source](fpx.mjs#L529); [test/example](test/test.mjs#L2589).

Signature: `(len: nat, val: A) => A[]`.

Returns an array of the given length where each element is the given value. Equivalent to `f.alloc(len).fill(val)`.

### `function set`

Links: [source](fpx.mjs#L530); [test/example](test/test.mjs#L2601).

Converts an arbitrary input to a native [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). Similar to `new Set`. Differences:

  * If input is already a set: **return as-is without copying**.
  * Otherwise, create a set of the input's [#`values`](#function-values).
    * [#Maps](#function-ismap) and [#structs](#function-isstruct) are treated as collections of their values rather than key-value entries.

### `function setCopy`

Links: [source](fpx.mjs#L531); [test/example](test/test.mjs#L2625).

Similar to [#`set`](#function-set): converts an arbitrary input to a set. Difference: always makes a copy. If the original was a set, it's unaffected by mutations of the output.


## License

https://unlicense.org

## Misc

I'm receptive to suggestions. If this library _almost_ satisfies you but needs changes, open an issue or chat me up. Contacts: https://mitranim.com/#contacts
