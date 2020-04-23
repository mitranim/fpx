## Overview

`fpx`: Functional Programming eXtensions for JavaScript. [Source on GitHub](https://github.com/mitranim/fpx/blob/master/src/fpx.js).

Lightweight replacement for Lodash, Underscore, etc. Differences:

  * One small file (≈ 12 KiB minified, versus ≈ 73 KiB in Lodash 4+)
  * Extremely simple source code
  * Relatively space-efficient, minifies well
  * Compatible with tree shaking

Doesn't have complete feature parity with Lodash, and probably never will. More functions may be added on demand. Open a GitHub issue or a pull request if something useful is missing.

Written as an ES2015 module for compatibility with tree shaking. When building a browser bundle, Webpack 4+ or Rollup automatically pick the ES2015 version. In Node.js, you automatically get the CommonJS version. A properly configured bundler should strip out the unused code, leaving only what you actually use.

See sibling libraries:

  * Emerge: https://github.com/mitranim/emerge. Efficient patching and merging of plain JS data.
  * Espo: https://mitranim.com/espo/. Reactive and stateful programming: observables, implicit reactivity, automatic resource cleanup.

Install from NPM. Current version: `{{$.VERSION}}`.

```sh
npm i -E fpx
```

All examples on this page imply an import:

```js
import * as f from 'fpx'
// or
const f = require('fpx')
```

On this page, Fpx is globally available as `f` or `fpx`. You can run the examples in the browser console.

## Why

Why a library: the built-ins are not sufficient. Fpx replaces some common code patterns with small functions, significantly reducing the code size. It also enables assertions that are desired but missing from most JS code.

### Size

Why not just use Lodash? It's way, **way**, **WAY** too huge. You just want a few functions and BAM, you get ≈ 73 KiB minified. You could make a custom bundle, but most folks just import the whole thing. For a web developer, shipping so much useless code to your users is irresponsible. It's also space-inefficient, bloated with avoidable code, and judging by the source, this seems unlikely to change. If you care about size, you need a replacement.

The current version of Lodash is incompatible with techniques like tree shaking / dead code elimination / live code inclusion, which pick just the functions you actually use, dropping the rest. These techniques work perfectly on Fpx. When using a module bundler that supports them, such as Rollup or Webpack 4+, you automatically get a "custom version" of Fpx without any unused stuff.

### Simplicity

> Programs must be written for people to read, and only incidentally for machines to execute.
>
> _— Abelson & Sussman, "Structure and Interpretation of Computer Programs"_

I believe that _all code_ should strive to be simple and educational. This gives me a massive distaste for most code ever written. For example, reading Lodash's source might teach you code obfuscation, but not much else.

In Fpx, I strive to keep the code and the algorithms dead simple, with as few unnecessary elements and indirections as possible. If you want to understand how this kind of library works, how higher-order functions work, how to manipulate JS data structures, Fpx should hopefully provide a good read.

### Strictness

Fpx functions tend to be somewhat stricter than their built-in counterparts, and _much_ stricter than the Lodash counterparts. They tend to work _either_ on lists ([`fold`](#fold-list-init-fun-a-b-c-)) _or_ dicts ([`foldVals`](#foldvals-dict-init-fun-a-b-c-)), not both. List functions also don't accept strings. This prevents subtle gotchas.

On the other hand, collection functions accept `null` and `undefined`, which is very useful in practice. This would not be possible with methods, since methods must be invoked on an object.

Unlike Lodash, higher-order functions always require an operator function. There's no implicit fallback on the identity function, and no implicit conversion of data patterns into functions.

### Minifiable Assertions

Assertions go a **long** way in debugging. Fail fast, catch bugs early. In asynchronous code, validating inputs as early as possible, instead of letting it fail mysteriously later, can save you hours of debugging.

Here's the traditional way of doing assertions:

```js
function someFunction(input) {
  if (typeof input !== 'function') throw Error(`Expected a function, got ${input}`)
}

someFunction({one: 10})
// Error: Expected a function, got [object Object]
```

Annoying to type and **really** bad for minification. Some folks strip assertions from production builds, but I find the idea flawed. Even in production, failing fast is better than failing mysteriously, and assertions help with debugging when it inevitably fails.

Fpx provides a much better alternative:

```js
function someFunction(input) {
  f.validate(input, f.isFunction)
}

someFunction({one: 10})
// Error: Expected {"one":10} to satisfy test isFunction
```

So much better! Easy to type with editor autocompletion, produces good error messages, and minifies really well. In a minified build, the function name will be mangled, which I consider a good tradeoff.

To support this style of coding, Fpx provides [`validate`](#validate-value-test-) and a bevy of boolean tests.

---

## Performance

For now, Fpx makes no bold performance claims, other than:

  * it's reasonably competitive with Lodash and native methods
  * it doesn't do anything outlandishly slow and shouldn't be your bottleneck

There's potential for improvement, but I don't have infinite spare time for microbenchmark contests. Suggestions are welcome.

---

## Bonus Arguments

In Fpx, most collection functions, such as [`map`](#map-list-fun-a-b-c-), pass up to 3 additional arguments to the operator function. Use this to define your functions statically and avoid local closures:

```js
// local context
const a = 1
const b = 2
const c = 3


// bonus args (recommended)

function add5(value, key, a, b, c) {
  return value + key + a + b + c
}
f.map([10, 20, 30], add5, a, b, c)
// [16, 27, 38]


// closure (not recommended)

function add5(value, key) {
  return value + key + a + b + c
}
f.map([10, 20, 30], add5)
// [16, 27, 38]
```

Broadly speaking, closures have a cost; defining functions statically avoids that cost.

This doesn't always improve performance, and can even make it worse. A smart engine can sometimes optimize a closure away. Closures may accidentally enable optimizations like function specialization. However, such optimizations can be unreliable. As a rule of thumb, memory allocation beats most other costs. Avoiding closure allocation is reliable and predictable at improving performance.

This may change with future advancements in JS engines.

---

## Fun

Miscellaneous utilities and transforms for functions.

---

### `call(fun, ...args)`

Like [`Function.prototype.call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call). Sometimes useful with higher-order functions.

```js
f.call(f.add, 10, 20)
// 3

// equivalent:
// f.add(10, 20)
// f.call(f.add, 10, 20)

// Side effect of implementation
// f.add.call(f.add, 10, 20)
```

---

### `apply(fun, args)`

Like [`Function.prototype.apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply). Sometimes useful with higher-order functions.

```js
f.apply(f.add, [10, 20])
// 3

// equivalent:
// f.add(10, 20)
// f.add(...[10, 20])
// f.apply(f.add, [10, 20])

// Side effect of implementation
// f.add.apply(f.add, [10, 20])
```

---

### `bind(fun, ...args)`

Like [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), but sets implicit `this = fun` as a side effect of the implementation.

Returns a new function that represents [partial application](https://en.wikipedia.org/wiki/Partial_application) of the given function, a common tool in functional programming. When called, it joins arguments from both calls and invokes the original function. Think of it like splitting a function call in two, or more.

```js
const inc = f.bind(f.add, 1)

inc(2)
// 3
```

Note: Fpx no longer provides facilities for currying. Experience has shown it to be extremely error prone. Currying, as seen in purely functional languages such as Haskell, tends to care about the amount of arguments. Calling a curried function may either create a new function, or call the underlying function (possibly side-effectful). This approach works reasonably well in statically typed purely functional languages, but not in JavaScript, where all functions are variadic, and it's conventional to sometimes pass extra utility arguments "just in case", which the callee may or may not care about. `bind` is different because the created function will always call the original function, regardless of how many arguments were passed.

---

### `not(fun)`

Returns a new function that negates the result of the given function, like a delayed `!`.

```js
function eq(a, b) {return a === b}

const different = f.not(eq)

different(10, 20)
// !eq(10, 20) = true

// equivalent:
function different(a, b) {return !eq(a, b)}
```

---

## Bool

Boolean tests.

---

### `truthy(value)`

Aliases: `truthy`, `bool`.

Same as `!!` or `Boolean`. Sometimes useful with higher-order functions.

```js
f.truthy(null)
// false

f.truthy(1)
// true
```

---

### `falsy(value)`

Aliases: `falsy`, `negate`.

Same as `!`. Sometimes useful with higher-order functions.

```js
f.falsy(null)
// true

f.falsy(1)
// false
```

---

### `is(one, other)`

Identity test: same as `===`, but considers `NaN` equal to `NaN`. Equivalent to [_SameValueZero_](https://www.ecma-international.org/ecma-262/6.0/#sec-samevaluezero) as defined by the language spec.

Note that [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) implements [_SameValue_](https://www.ecma-international.org/ecma-262/6.0/#sec-samevalue), which treats `-0` and `+0` as _distinct values_. This is typically undesirable. As a result, you should prefer `f.is` over `===` or `Object.is`.

Used internally in Fpx for all identity tests.

```js
f.is(1, '1')
// false

f.is(NaN, NaN)
// true
```

---

### `isNumber(value)`

Same as `typeof value === 'number'`. Returns `true` for `NaN` and `±Infinity`. In most cases, you should use `isFinite` instead.

```js
f.isNumber(1)
// true
f.isNumber('1')
// false
f.isNumber(NaN)
// true <-- WTF
```

---

### `isFinite(value)`

Same as ES2015's [`Number.isFinite`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite).

Returns `true` if `value` is a number and is _not_ `NaN` or `±Infinity`. In most cases, you should use `isFinite` rather than `isNumber`.

```js
f.isFinite(1)
// true
f.isFinite('1')
// false
f.isFinite(NaN)
// false
```

---

### `isInteger(value)`

True if `value` is an integer: finite without a fractional part.

```js
f.isInteger(0)
// true
f.isInteger(1)
// true
f.isInteger(-1)
// true
f.isInteger(1.1)
// false
f.isInteger('1')
// false
```

---

### `isNatural(value)`

True if `value` is a natural number: a positive integer, starting with `0`.

```js
f.isNatural(0)
// true
f.isNatural(1)
// true
f.isNatural(-1)
// false
f.isNatural(1.1)
// false
f.isNatural('1')
// false
```

---

### `isNaN(value)`

Same as ES2015's [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN). True if `value` is _actually_ `NaN`. Doesn't coerce non-numbers to numbers, unlike `global.isNaN` / `window.isNaN`.

```js
f.isNaN(NaN)
// true
f.isNaN(undefined)
// false
```

---

### `isInfinity(value)`

True if `value` is `-Infinity` or `Infinity`.

```js
f.isInfinity(Infinity)
// true
f.isInfinity(-Infinity)
// true
f.isInfinity(10)
// false
f.isInfinity(NaN)
// false
f.isInfinity(undefined)
// false
```

---

### `isString(value)`

```js
f.isString('blah')
// true
```

---

### `isBoolean(value)`

```js
f.isBoolean(false)
// true
```

---

### `isSymbol(value)`

```js
f.isSymbol(Symbol('blah'))
// true
```

---

### `isKey(value)`

True if `value` could, with some suspension of disbelief, claim to be usable as a dict key. Must satisfy either of:

  * `isString`
  * `isSymbol`
  * `isBoolean`
  * `isFinite`

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

In other words, this is a subset of [`isPrimitive`](#isprimitive-value-) that excludes `null`, `undefined`, `NaN`, and `±Infinity`. These values are often produced on accident, and you almost never want them as your dict keys.

Fpx uses `isKey` to validate keys in functions like [`keyBy`](#keyby-list-fun-a-b-c-).

---

### `isPrimitive(value)`

Opposite of `isComplex`. Either of:

  * `isString`
  * `isSymbol`
  * `isBoolean`
  * `isNumber`
  * `null`
  * `undefined`

---

### `isComplex(value)`

Definition:

```js
function isComplex(value) {
  return isObject(value) || isFunction(value)
}
```

This covers all mutable objects in the true JavaScript sense, including functions.

---

### `isInstance(value, Class)`

Same as `instanceof` but more efficient for primitives.

When the left operand to `instanceof` is a primitive, it creates a temporary wrapper object, wasting CPU cycles on allocation and garbage collection, even though `false` was guaranteed. `isInstance` avoids this mistake. At the time of writing, the improvement is measurable in V8.

```js
f.isInstance([], Array)          // true
f.isInstance(new Date(), Date)   // true
f.isInstance(1, Number)          // false, cheaper than instanceof
f.isInstance(undefined, Object)  // false, cheaper than instanceof
```

---

### `isFunction(value)`

```js
f.isFunction(isFunction)
// true
```

---

### `isObject(value)`

True if `value` is a non-`null` object. This includes plain dicts, arrays, regexps, user-defined "classes", built-in classes, and so on. Doesn't count functions as objects, even though _technically_ they are.

Note: this is _not_ equivalent to lodash's `_.isObject`, which counts functions as objects. See [`isComplex`](#iscomplex-value-) for that.

For plain objects used as dictionaries, see [`isDict`](#isdict-value-). For fancy non-list objects, see [`isStruct`](#isstruct-value-).

```js
f.isObject('blah')
// false

f.isObject(/blah/)
// true

f.isObject([])
// true

f.isObject(Object.create(null))
// true

f.isObject(() => {})
// false
```

---

### `isDict(value)`

True if `value` is a normal, honest-to-goodness dictionary and not something fancy-shmancy.

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

---

### `isStruct(value)`

True if `value` is a non-list object. In Fpx lingo, such objects are called "structs". There's an entire [category](#struct) of functions dedicated to them, similar to "object" functions in Lodash.

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

---

### `isArray(value)`

True if `value` inherits from `Array.prototype`.

```js
f.isArray([])
// true
```

---

### `isList(value)`

True if `value` looks array-like, such as:

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

---

### `isRegExp(value)`

```js
f.isRegExp(/blah/)
// true
```

---

### `isDate(value)`

```js
f.isDate(new Date())             // true
f.isDate(new Date().toString())  // false
```

---

### `isValidDate(value)`

```js
f.isDate(new Date())     // true
f.isDate(new Date(NaN))  // false
```

---

### `isInvalidDate(value)`

```js
f.isDate(new Date())     // false
f.isDate(new Date(NaN))  // true
```

---

### `isPromise(value)`

True if the value [quacks](https://en.wikipedia.org/wiki/Duck_test) like an ES2015 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Not limited to built-in promises.

```js
f.isPromise(new Promise(() => {}))
// true

f.isPromise({then() {}, catch() {}})
// true

f.isPromise({then() {}})
// false
```

---

### `isIterator(value)`

True if the value [quacks](https://en.wikipedia.org/wiki/Duck_test) like an ES2015 [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator). _Iterators_, also called _generator objects_, are created by calling a _generator function_.

```js
function* myGenerator() {
  yield 10
  yield 20
  return 30
}

f.isIterator(myGenerator())
// true

f.isIterator(myGenerator)
// false
```

---

### `isNil(value)`

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

---

### `isSomething(value)`

True for everything except `null` and `undefined`.

```js
// Definition
function isSomething(value) {return value != null}

f.isSomething(null)
// false
f.isSomething(undefined)
// false
f.isSomething(false)
// true
```

---

### `isEmpty(value)`

True if `!size(value)`. Only lists and dicts can be non-empty.

```js
f.isEmpty(undefined)
// true

f.isEmpty('blah')
// true

f.isEmpty([10, 20])
// false

f.isEmpty({one: 10, two: 20})
// false
```

---

### `testBy(value, pattern)`

Limited form of pattern testing. Together with ES2015 destructuring, it lets you crudely approximate pattern matching, a feature common in functional languages but missing from JavaScript.

Tests `value` against `pattern`, using the following rules:

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

### `test(pattern)`

Takes a pattern and returns a version of [`testBy`](#testby-value-pattern-) bound to that pattern. See the rules above.

```js
f.test(pattern)
// ≡ function(x) {return f.testBy(x, pattern)}

f.test(pattern)(input)
// ≡ f.testBy(input, pattern)
```

---

## Casts

Type coercions and replacements.

### `onlyString(value)`

Nil-tolerant string assertion. Replaces `null` or `undefined` with `''`, otherwise asserts [`isString`](#isstring-value-) and returns `value`.

```js
f.onlyString()
// ''

f.onlyString('blah')
// 'blah'

f.onlyString(['not string'])
// Error: Expected ["not string"] to satisfy test isString
```

---

### `onlyList(value)`

Nil-tolerant list assertion. Replaces `null` or `undefined` with `[]`, otherwise asserts [`isList`](#islist-value-) and returns `value`. Used internally in [list functions](#list).

```js
f.onlyList()
// []

f.onlyList([10, 20])
// [10, 20]

f.onlyList('not list')
// Error: Expected "not list" to satisfy test isList
```

---

### `onlyDict(value)`

Nil-tolerant dict assertion. Replaces `null` or `undefined` with `{}`, otherwise asserts [`isDict`](#isdict-value-) and returns `value`.

```js
f.onlyDict()
// {}

f.onlyDict({one: 10})
// {one: 10}

f.onlyDict('not dict')
// Error: Expected "not dict" to satisfy test isDict
```

---

### `onlyStruct(value)`

Nil-tolerant struct assertion. Replaces `null` or `undefined` with `{}`, otherwise asserts [`isStruct`](#isstruct-value-) and returns `value`. Used internally in [struct functions](#struct).

```js
f.onlyStruct()
// {}

f.onlyStruct({one: 10})
// {one: 10}

f.onlyStruct('not struct')
// Error: Expected "not struct" to satisfy test isDict
```

---

### `toArray(value)`

Nil-tolerant cast. Converts any array-like into an `Array`. If the input is
already an `Array`, it's returned as-is. Converts `null` and `undefined` to
`[]`.

```js
f.toArray()
// []

f.toArray([10, 20])
// [10, 20]

f.toArray(function args() {}(10, 20))
// [10, 20]
```

---

## List

List manipulation utils.

Common rules:

  * accept `null` and `undefined`, treating them as `[]`
  * accept inputs that satisfy [`isList`](#islist-value-): `arguments`, typed arrays, Node buffers, DOM lists, etc.
  * reject other inputs with an exception
  * don't modify the input; return a new version instead
  * accept [bonus arguments](#bonus-arguments) for the operator function

Note that _strings are not considered lists_.

---

### `each(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Like [`Array.prototype.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach), but works on `null`, `undefined`, and array-likes.

```js
function report(value, index, a, b, c) {
  console.info(value, index, a, b, c)
}

f.each(['one', 'two'], report, 10, 20, 30)
// 'one' 0 10 20 30
// 'two' 1 10 20 30
```

---

### `fold(list, init, fun, a, b, c)`

where `fun: ƒ(accumulator, value, index, a, b, c)`

Like [`Array.prototype.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce), with the following differences:

  * works on `null`, `undefined`, and array-likes
  * the argument order is `list, init, fun` rather than `this=list, fun, init`
  * the init argument is mandatory

```js
f.fold([10, 20], 5, f.add)
// 5 + 10 + 20 = 35
```

---

### `foldRight(list, init, fun, a, b, c)`

where `fun: ƒ(accumulator, value, index, a, b, c)`

Like [`Array.prototype.reduceRight`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight), with the following differences:

  * works on `null`, `undefined`, and array-likes
  * the argument order is `list, init, fun` rather than `this=list, fun, init`
  * the init argument is mandatory

```js
f.foldRight([1, 5, 20], 100, f.sub)
// 100 - 20 - 5 - 1 = 74
```

---

### `map(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Like [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), but works on `null`, `undefined`, and array-likes.

```js
function double(num) {return num * 2}

f.map([10, 20, 30], double)
// [20, 40, 60]
```

Note: coming from Lodash, you might miss the string shortcut:

```js
_.map([{value: 10}, {value: 20}], 'value')
// [10, 20]
```

Fpx considers this a hazardous malpractice. Just use a function:

```js
f.map([{value: 10}, {value: 20}], x => x.value)
```

---

### `flatMap(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Similar to `map`, but flattens any lists returned by `fun` into the output array. Equivalent to `flatten(map(...arguments))`.

```js
f.flatMap([10, [20], [[30]]], x => x)
// [10, 20, [30]]
```

---

### `flatMapDeep(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Similar to `map`, but deeply flattens any lists returned by `fun`, returning a completely flat array. Equivalent to `flattenDeep(map(...arguments))`.

```js
f.flatMapDeep([10, [20], [[[30]]]], x => x)
// [10, 20, 30]
```

---

### `mapFilter(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Similar to `map`, but drops any "falsy" values from the output. Equivalent to `compact(map(...arguments))`.

```js
f.mapFilter([10, 0, 20, 0], x => x * 2)
// [20, 40]
```

---

### `filter(list, test, a, b, c)`

where `test: ƒ(value, index, a, b, c)`

Like [`Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), but works on `null`, `undefined`, and array-likes.

```js
f.filter([10, 20, true, false], f.isBoolean)
// [true, false]
```

Note: coming from Lodash, you might miss the magic pattern shortcut:

```js
_.filter([{val: 10}, {val: 20}], {val: 10})
// [{val: 10}]
```

Fpx provides [`test`](#test-pattern-):

```js
f.filter([{val: 10}, {val: 20}], f.test({val: 10}))
// [{val: 10}]
```

Be wary that it's slower than a hand-coded test.

---

### `reject(list, test, a, b, c)`

where `test: ƒ(value, index, a, b, c)`

Opposite of `filter`: drops elements that don't satisfy `test`.

```js
f.reject([10, 20, true, false], f.isNumber)
// [true, false]
```

---

### `compact(list)`

Returns a version of `list` without any "falsy" elements. Equivalent to `filter(list, id)`.

```js
f.compact([10, 0, 20, NaN, 30, undefined])
// [10, 20, 30]
```

---

### `find(list, test, a, b, c)`

where `test: ƒ(value, index, a, b, c)`

Like [`Array.prototype.find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find), but works on `null`, `undefined`, and array-likes.

```js
f.find([10, true, 20, false, 30], f.isBoolean)
// true
```

---

### `findRight(list, test, a, b, c)`

where `test: ƒ(value, index, a, b, c)`

Like `find`, but iterates from the _end_ of the list. Returns the rightmost element that satisfies `test`, or `undefined` if none do.

```js
f.findRight([10, true, 20, false, 30], f.isBoolean)
// false
```

---

### `findIndex(list, test, a, b, c)`

where `test: ƒ(value, index, a, b, c)`

Like [`Array.prototype.findIndex`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex), but works on `null`, `undefined`, and array-likes.

```js
f.findIndex([10, true, 20, false, 30], f.isBoolean)
// 1
```

---

### `findIndexRight(list, test, a, b, c)`

where `test: ƒ(value, index, a, b, c)`

Like `findIndex`, but iterates from the _end_ of the list. Returns the index of the rightmost element that satisfies `test`, or `-1` if none do.

```js
f.findIndexRight([10, true, 20, false, 30], f.isBoolean)
// 3
```

---

### `indexOf(list, value)`

Like [`Array.prototype.indexOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf), with the following differences:

  * works on `null`, `undefined`, and array-likes
  * uses [`is`](#is-one-other-) rather than `===` and therefore detects `NaN`

```js
f.indexOf([10, NaN, NaN, 20], NaN)
// 1
```

---

### `lastIndexOf(list, value)`

Like [`Array.prototype.lastIndexOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf), with the following differences:

  * works on `null`, `undefined`, and array-likes
  * uses [`is`](#is-one-other-) rather than `===` and therefore detects `NaN`

```js
f.lastIndexOf([10, NaN, NaN, 20], NaN)
// 2
```

---

### `includes(list, value)`

Like [`Array.prototype.includes`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes), but works on `null`, `undefined`, and array-likes.

```js
f.includes([10, 20, 30], NaN)
// false

f.includes([10, 20, NaN], NaN)
// true
```

---

### `procure(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Similar to [`find`](#find-list-test-a-b-c-), but returns the first truthy result of calling `fun`, rather than the corresponding list element.

```js
function double(num) {return num * 2}

f.procure([0, 0, 10, 100], double)
// double(10) = 20
```

---

### `every(list, test, a, b, c)`

where `test: ƒ(value, index, a, b, c)`

Like [`Array.prototype.every`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every), but works on `null`, `undefined`, and array-likes.

```js
f.every([], f.isBoolean)
// true

f.every([true, false], f.isBoolean)
// true

f.every([true, false, 10, 20], f.isBoolean)
// false
```

---

### `some(list, test, a, b, c)`

where `test: ƒ(value, index, a, b, c)`

Like [`Array.prototype.some`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some), but works on `null`, `undefined`, and array-likes.

```js
f.some([], f.isBoolean)
// false

f.some([10, 20], f.isBoolean)
// false

f.some([true, false, 10, 20], f.isBoolean)
// true
```

---

### `slice(list, start, end)`

Like [`Array.prototype.slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice), but also accepts `null` and `undefined`. `start` and `end` can be missing or negative; see the linked documentation.

```js
f.slice([10, 20, 30, 40, 50], 1, -1)
// [20, 30, 40]
```

---

### `append(list, value)`

Returns a version of `list` with `value` appended at the end.

```js
f.append([10, 20], 30)
// [10, 20, 30]
```

---

### `prepend(list, value)`

Returns a version of `list` with `value` prepended at the start.

```js
f.prepend([20, 30], 10)
// [10, 20, 30]
```

---

### `remove(list, value)`

Returns a version of `list` with one occurrence of `value` removed. May return
the original list.

```js
f.remove(['one', 'two', 'three'], 'two')
// ['one', 'three']

f.remove(['one', 'two', 'one'], 'one')
// ['two', 'one']
```

---

### `insertAtIndex(list, index, value)`

Returns a version of `list` with `value` inserted at `index`, moving subsequent elements to the end. `index` must be an integer within list bounds + 1, otherwise throws.

```js
f.insertAtIndex(undefined, 0, 'zero')
// ['zero']

f.insertAtIndex(['zero', 'one', 'two'], 0, 'absolute zero')
// ['absolute zero', 'zero', 'one', 'two']

f.insertAtIndex(['zero', 'one', 'two'], 2, '...')
// ['zero', 'one', '...', 'two']
```

---

### `removeAtIndex(list, index)`

Returns a version of `list` with the value at `index` removed, if within bounds. `index` must be an integer, otherwise throws.

```js
f.removeAtIndex(['zero', 'one', 'two'], 0)
// ['one', 'two']

f.removeAtIndex(['zero', 'one', 'two'], 1)
// ['zero', 'two']

f.removeAtIndex(['zero', 'one', 'two'], 10)
// ['zero', 'one', 'two']
```

---

### `adjoin(list, value)`

Appends `value` to `list`, duplicate-free. Returns the same `list` if it already [`includes`](#includes-list-value-) `value`. Always returns an `Array`, converting the input from a non-array list.

```js
f.adjoin([10, 20], 30)
// [10, 20, 30]

f.adjoin([10, 20, 30], 20)
// [10, 20, 30]
```

---

### `toggle(list, value)`

Appends or removes `value`, depending on whether it's already [`included`](#includes-list-value-).

```js
f.toggle([10, 20], 30)
// [10, 20, 30]

f.toggle([10, 20, 30], 30)
// [10, 20]
```

---

### `concat(...lists)`

Concatenates lists, ignoring non-list arguments.

**Different** from [`Array.prototype.concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) and, by extension, lodash's `_.concat`. They inherited Scheme's hazardous mistake of appending non-list inputs while flattening list inputs. This leads to surprising errors and/or intentional abuse. Fpx's `concat` rejects non-lists, preventing this gotcha.

Note: for individual elements, use [`append`](#append-list-value-) and
[`prepend`](#prepend-list-value-) instead.

```js
f.concat()
// []

f.concat([10], [20], [30])
// [10, 20, 30]

f.concat([10, 20], 30)
// Error: Expected 30 to satisfy test isList
```

---

### `flatten(list)`

Returns a version of `list` flattened one level down.

```js
f.flatten([10, [20], [[30]]])
// [10, 20, [30]]
```

---

### `flattenDeep(list)`

Returns a version of `list` with all nested lists flattened into one result.

```js
f.flattenDeep([10, [20], [[[30]]]])
// [10, 20, 30]
```

---

### `head(list)`

Returns the first element of the given list.

```js
f.head()
// undefined

f.head([10, 20, 30])
// 10
```

---

### `tail(list)`

Returns all but first element of the given list.

```js
f.tail()
// []

f.tail([10, 20, 30])
// [20, 30]
```

---

### `init(list)`

Returns all but last element of the given list.

```js
f.init()
// []

f.init([10, 20, 30])
// [10, 20]
```

---

### `last(list)`

Returns the last element of the given list.

```js
f.last()
// undefined

f.last([10, 20, 30])
// 30
```

---

### `take(list, count)`

Returns a sub-`list` with `count` elements taken from the start. Equivalent to `slice(list, count)`.

```js
f.take(undefined, 0)
// []

f.take([10, 20, 30, 40], 2)
// [10, 20]

f.take([10, 20, 30, 40], Infinity)
// [10, 20, 30, 40]
```

---

### `drop(list, count)`

Returns a sub-`list` with `count` elements removed from the start. Equivalent to `slice(list, 0, count)`.

```js
f.drop(undefined, 0)
// []

f.drop([10, 20, 30, 40], 2)
// [30, 40]

f.drop([10, 20, 30, 40], Infinity)
// []
```

---

### `reverse(list)`

Like [`Array.prototype.reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse), with the following differences:

  * works on `null`, `undefined`, and array-likes
  * returns a new version instead of mutating the list

```js
f.reverse()
// []

f.reverse([10, 20, 30])
// [30, 20, 10]
```

---

### `sort(list, comparator)`

Like [`Array.prototype.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), with the following differences:

  * works on `null`, `undefined`, and array-likes
  * returns a new version instead of mutating the list

```js
// Messed-up default JS sorting
f.sort([3, 22, 111])
// [111, 22, 3]

// Use a custom comparator to sort numbers properly
f.sort([3, 22, 111], f.sub)
// [3, 22, 111]
```

---

### `sortBy(list, fun, a, b, c)`

where `fun: ƒ(value, a, b, c)`

Returns a version of `list` sorted by the order of values returned by `fun`, which is called on every element with the bonus arguments. Kinda like mapping `list` to `fun`, sorting the result, then changing the element order in the original list the same way.

The "virtual elements" are sorted the same way as in `.sort()`, i.e. by the Unicode code order of its stringified elements; see the relevant [part of the spec](https://tc39.github.io/ecma262/#sec-sortcompare). `sortBy` currently doesn't accept a custom comparator, although this could be changed if needed.

Works on array-likes. Note that `fun` doesn't receive an element index.

```js
function getId({id}) {return id}

f.sortBy([{id: 3}, {id: 22}, {id: 111}], getId)
// [{id: 111}, {id: 22}, {id: 3}]
```

---

### `intersection(left, right)`

Returns a list representing a [set intersection](https://en.wikipedia.org/wiki/Set_intersection) of the two lists. It contains only the elements that occur in both lists, tested via [`is`](#is-one-other-), without any duplicates.

```js
f.intersection([10, 20, 20, 30], [20, 30, 30, 40])
// [20, 30]

f.intersection([10, 20], undefined)
// []
```

---

### `keyBy(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Returns a dict where `list`'s values are assigned to the keys created by `fun`.

Major difference from Lodash's `_.keyBy`: keys must pass the [`isKey`](#iskey-value-) test or be ignored. This means they must be primitives, excluding the nonsense values `null`, `undefined`, `NaN` and `±Infinity`. This helps avoid accidental garbage in the output.

```js
function double(value) {return value * 2}

f.keyBy([10, 20, 30], double)
// {20: 10, 40: 20, 60: 30}
```

---

### `groupBy(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Similar to `keyBy`: returns a dict where keys have been created by calling `fun`. Unlike `keyBy`, it groups values into lists, accumulating them for repeating keys instead of overwriting.

Just like `keyBy`, and unlike Lodash's `_.groupBy`, keys must pass the [`isKey`](#iskey-value-) test or be ignored. This helps avoid accidental garbage in the output.

```js
function oddness(value) {return value % 2}

f.groupBy([10, 13, 16, 19], oddness)
// {0: [10, 16], 1: [13, 19]}
```

---

### `uniq(list)`

Returns a version of `list` without duplicate elements, compared via [`is`](#is-one-other-).

```js
f.uniq([10, 20, NaN, 20, NaN, 30])
// [10, 20, NaN, 30]
```

---

### `uniqBy(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Returns a version of `list` where no two elements have produced the same result when `fun` was called on them. The results are compared via [`is`](#is-one-other-).

```js
function isOdd(value) {return Boolean(value % 2)}

f.uniqBy([10, 13, 16, 19], isOdd)
// [10, 13]
```

---

### `partition(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Splits `list` into "accepted" and "rejected" groups. The accepted group contains elements for which `fun` returned something truthy, and the rejected group contains the rest.

```js
function isOdd(value) {return Boolean(value % 2)}

f.partition([10, 13, 16, 19], isOdd)
// [[13, 19], [10, 16]]
```

---

### `sum(list)`

Sums all elements of `list` that satisfy [`isFinite`](#isfinite-value-), ignoring the rest.

```js
f.sum([10, NaN, 20, '5'])
// 30
```

---

### `sumBy(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Calls `fun` on every element of the list and sums the results. Like `sum`, ignores values that don't satisfy [`isFinite`](#isfinite-value-).

```js
f.sumBy([10, undefined, '20'], Number)
// 30
```

---

### `min(list)`

Finds the smallest value in `list` that also satisfies [`isFinite`](#isfinite-value-), or `undefined`. Note that it ignores `±Infinity`.

```js
f.min([])
// undefined

f.min(['10', 20, '30', -Infinity, NaN])
// 20
```

---

### `max(list)`

Finds the largest value in `list` that also satisfies [`isFinite`](#isfinite-value-), or `undefined`. Note that it ignores `±Infinity`.

```js
f.max([])
// undefined

f.max(['10', 20, '30', Infinity, NaN])
// 20
```

---

### `minBy(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Calls `fun` on every element of the list and returns the smallest result, using the same rules as [`min`](#min-list-).

Note a major difference from Lodash's `_.minBy`: this returns the smallest value returned by `fun`, not its corresponding list element. I find this far more intuitive. See `findMinBy` for the counterpart to `_.minBy`.

```js
function getNum({num}) {return num}

f.minBy([{num: 10}, {num: 20}, {num: 30}], getNum)
// 10
```

---

### `maxBy(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Calls `fun` on every element of the list and returns the largest result, using the same rules as [`max`](#max-list-).

Note a major difference from Lodash's `_.maxBy`: this returns the smallest value returned by `fun`, not its corresponding list element. I find this far more intuitive. See `findMaxBy` for the counterpart to `_.maxBy`.

```js
function getNum({num}) {return num}

f.maxBy([{num: 10}, {num: 20}, {num: 30}], getNum)
// 30
```

---

### `findMinBy(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Calls `fun` on every element of the list and returns the element for which `fun` returned the smallest value, using the same rules as [`min`](#min-list-).

Similar to Lodash's `_.minBy`.

```js
function getNum({num}) {return num}

f.findMinBy([{num: 10}, {num: 20}, {num: 30}], getNum)
// {num: 10}
```

---

### `findMaxBy(list, fun, a, b, c)`

where `fun: ƒ(value, index, a, b, c)`

Calls `fun` on every element of the list and returns the element for which `fun` returned the largest value, using the same rules as [`max`](#max-list-).

Similar to Lodash's `_.maxBy`.

```js
function getNum({num}) {return num}

f.findMaxBy([{num: 10}, {num: 20}, {num: 30}], getNum)
// {num: 30}
```

---

### `range(start, end)`

Returns a list of integers from `start` (inclusive) to `end` (exclusive). Both inputs must be natural numbers, with `start <= end`.

```js
f.range(5, 10)
// [5, 6, 7, 8, 9]
```

---

## Struct

Utils for dealing with non-list objects, called "structs" or "dictionaries" in Fpx.

Common rules:

  * accept `null` and `undefined`, treating them as `{}`
  * accept non-list objects; reject lists and all other inputs with an exception
  * don't modify the input; return a new version instead
  * accept [bonus arguments](#bonus-arguments) for the operator function

Property getters `get`, `scan`, `getIn` and `getter` work on _any_ input, even primitives.

---

### `get(value, key)`

Same as `value[key]`, but safe on `null` or `undefined`.

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

---

### `scan(value, ...path)`

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

---

### `getIn(value, path)`

Like `scan` but expects the entire `path` as the second argument. Like `get`, is safe against `null` or `undefined`.

```js
f.getIn(1, [])
// 1

f.getIn({one: {two: 2}}, ['one', 'two'])
// 2
```

---

### `getter(key)`

Delayed `get`. Equivalent to this function: `x => get(x, key)`.

```js
f.map([{value: 10}, {value: 20}], f.getter('value'))
// [10, 20]
```

Convenient, but also a performance malpractice. The "right" way, performance-wise, is to statically define a getter function with a hardcoded property:

```js
function getValue({value}) {return value}

f.map([{value: 10}, {value: 20}], getValue)
// [10, 20]
```

---

### `keys(dict)`

Like `Object.keys`, with the following differences:

  * works on `null` and `undefined`
  * rejects list inputs with an exception

```js
f.keys()
// []

f.keys({one: 10, two: 20})
// ['one', 'two']

f.keys([10, 20])
// Error: Expected [10,20] to satisfy test isStruct
```

---

### `values(dict)`

Like `Object.values`, with the following differences:

  * works on `null` and `undefined`
  * rejects list inputs with an exception

```js
f.values()
// []

f.values({one: 10, two: 20})
// [10, 20]

f.values([10, 20])
// Error: Expected [10,20] to satisfy test isStruct
```

---

### `entries(dict)`

Like `Object.entries`, with the following differences:

  * works on `null` and `undefined`
  * rejects list inputs with an exception

```js
f.entries()
// []

f.entries({one: 10, two: 20})
// [['one', 10], ['two', 20]]

f.entries([10, 20])
// Error: Expected [10,20] to satisfy test isStruct
```

---

### `eachVal(dict, fun, a, b, c)`

where `fun: ƒ(value, key, a, b, c)`

Iterates for side effects, calling `fun` with every property and key. Returns `undefined`.

```js
function report(value, key, a, b, c) {
  console.info(value, key, a, b, c)
}

f.eachVal({one: 10, two: 20}, report, 10, 20, 30)
// 10 'one' 10 20 30
// 20 'two' 10 20 30
```

---

### `foldVals(dict, init, fun, a, b, c)`

where `fun: ƒ(accumulator, value, key, a, b, c)`

Similar to [`fold`](#fold-list-init-fun-a-b-c-), but for dicts. Iterates over each property, updating the accumulator, which is returned in the end.

```js
f.foldVals({one: 10, two: 20}, 5, f.add)
// 5 + 10 + 20 = 35
```

---

### `mapVals(dict, fun, a, b, c)`

where `fun: ƒ(value, key, a, b, c)`

Similar to [`map`](#map-list-fun-a-b-c-), but for dicts. Creates a version of `dict` where values have been replaced by calling `fun`.

```js
function bang(value) {return value + '!'}

f.mapVals({ping: 'ping', pong: 'pong'}, bang)
// {ping: 'ping!', pong: 'pong!'}
```

---

### `mapKeys(dict, fun, a, b, c)`

where `fun: ƒ(key, value, a, b, c)`

Similar to [`mapVals`](#mapvals-dict-fun-a-b-c-), but replaces keys rather than values.

Major difference from Lodash's `_.mapKeys`: keys must pass the [`isKey`](#iskey-value-) test or be ignored. This means they must be primitives, excluding the nonsense values `null`, `undefined`, `NaN` and `±Infinity`. This helps avoid accidental garbage in the output.

Another major difference from Lodash's `_.mapKeys`: the operator receives `key, value, a, b, c` rather than `value, key, dict`.

```js
f.mapKeys({one: 10, two: 20}, f.head)
// {o: 10, t: 20}
```

---

### `mapValsSort(dict, fun, a, b, c)`

where `fun: ƒ(value, key, a, b, c)`

Maps `dict` to a _list_, sorted by key order.

Note the difference: Lodash's `_.map` works on dicts, but since object key/iteration order is unspecified, the output is unsorted and therefore unstable. `mapValsSort` avoids this issue, always producing the same output for a given dict.

```js
f.mapValsSort({3: 'three', 22: 'two', 111: 'one'}, f.id)
// ['one', 'two', 'three']
```

---

### `pickBy(dict, fun, a, b, c)`

where `fun: ƒ(value, key, a, b, c)`

Similar to [`filter`](#filter-list-test-a-b-c-), but for dicts. Returns a version of `dict` with properties for which `fun` returned something truthy.

```js
function isOdd(value) {return Boolean(value % 2)}

f.pickBy({one: 10, two: 13, three: 16, four: 19}, isOdd)
// {two: 13, four: 19}
```

---

### `omitBy(dict, fun, a, b, c)`

where `fun: ƒ(value, key, a, b, c)`

Similar to [`reject`](#reject-list-test-a-b-c-), but for dicts. Returns a version of `dict` without properties for which `fun` returned something truthy.

```js
function isOdd(value) {return Boolean(value % 2)}

f.omitBy({one: 10, two: 13, three: 16, four: 19}, isOdd)
// {one: 10, three: 16}
```

---

### `pickKeys(dict, keys)`

Returns a version of `dict` with only the properties whitelisted in `keys`. The keys must satisfy [`isKey`](#iskey-value-).

Same as Lodash's `_.pick`.

```js
f.pickKeys({one: 10, two: 20}, ['one'])
// {one: 10}
```

---

### `omitKeys(dict, keys)`

Returns a version of `dict` without any properties blacklisted in `keys`. The keys must satisfy [`isKey`](#iskey-value-).

Same as Lodash's `_.omit`.

```js
f.omitKeys({one: 10, two: 20}, ['one'])
// {two: 20}
```

---

### `findVal(dict, fun, a, b, c)`

where `fun: ƒ(value, key, a, b, c)`

Similar to [`find`](#find-list-test-a-b-c-), but for dicts. Returns the first value for which `fun` returned something truthy.

```js
function isOdd(value) {return Boolean(value % 2)}

f.findVal({one: 10, two: 13}, isOdd)
// 13
```

---

### `findKey(dict, fun, a, b, c)`

where `fun: ƒ(value, key, a, b, c)`

Similar to [`findIndex`](#findindex-list-test-a-b-c-), but for dicts. Returns the first key for which `fun` returned something truthy.

```js
function isOdd(value) {return Boolean(value % 2)}

f.findKey({one: 10, two: 13}, isOdd)
// 'two'
```

---

### `everyVal(dict, fun, a, b, c)`

where `fun: ƒ(value, key, a, b, c)`

Similar to [`every`](#every-list-test-a-b-c-), but for dict values:

```js
f.everyVal({}, f.isBoolean)
// true

f.everyVal({one: true, two: false}, f.isBoolean)
// true

f.everyVal({one: true, two: false, three: 10}, f.isBoolean)
// false
```

---

### `someVal(dict, fun, a, b, c)`

where `fun: ƒ(value, key, a, b, c)`

Similar to [`some`](#some-list-test-a-b-c-), but for dict values:

```js
f.someVal({}, f.isBoolean)
// false

f.someVal({one: 10, two: 20}, f.isBoolean)
// false

f.someVal({one: true, two: false, three: 10}, f.isBoolean)
// true
```

---

### `invert(dict)`

Returns a version of `dict` with keys and values swapped. Values must satisfy [`isKey`](#iskey-value-) to become keys; ones that don't are silently dropped from the output.

```js
f.invert({one: 10, two: 20})
// {10: 'one', 20: 'two'}
```

---

### `invertBy(dict, fun, a, b, c)`

where `fun: ƒ(value, key, a, b, c)`

Similar to `invert`, but calls `fun` on each value to produce a key. The resulting keys must satisfy [`isKey`](#iskey-value-) or be silently dropped from the output.

```js
function double(value) {return value * 2}

f.invertBy({one: 10, two: 20}, double)
// {20: 'one', 40: 'two'}
```

---

## Coll

Functions that work on both lists and dicts.

---

### `size(value)`

Collection size:

  * [`isList`](#islist-value-) → length
  * [`isObject`](#isobject-value-) → number of [`keys`](#keys-dict-)
  * primitive or function → `0`

Note that since strings are not considered collections, this function returns `0` for a string.

```js
f.size([10, 20])
// 2

f.size({one: 10, two: 20})
// 2

f.size('string')
// 0

f.size()
// 0

f.size(f.size)
// 0
```

Also see [`isEmpty`](#isempty-value-) for a pure boolean version.

---

### `vacate(value)`

If `size(value) > 0`, returns `value` unchanged, otherwise returns `undefined`.

```js
f.vacate([])
// undefined

f.vacate([10, 20])
// [10, 20]

f.vacate({})
// undefined

f.vacate({one: 10, two: 20})
// {one: 10, two: 20}
```

---

## Ops

Operator-style functions. Sometimes useful with higher-order functions. Like with regular JS operators, beware of implicit type coercions.

---

### `add(a, b)`

Same as `+`.

```js
f.add(10, 20)
// 10 + 20 = 30
```

---

### `sub(a, b)`

Same as `-`.

```js
f.sub(20, 10)
// 20 - 10 = 10
```

---

### `mul(a, b)`

Same as `*`.

```js
f.mul(10, 20)
// 10 * 20 = 200
```

---

### `div(a, b)`

Same as `/`.

```js
f.div(10, 20)
// 10 / 20 = 0.5
```

---

### `rem(a, b)`

Same as `%`.

```js
f.rem(2.5, 1)
// 2.5 % 1 = 0.5
```

---

### `lt(a, b)`

Same as `<`.

```js
f.lt(10, 20)
// 10 < 20 = true
```

---

### `gt(a, b)`

Same as `>`.

```js
f.gt(10, 20)
// 10 > 20 = false
```

---

### `lte(a, b)`

Same as `<=`.

```js
f.lte(10, 20)
// 10 <= 20 = true
f.lte(10, 10)
// 10 <= 10 = true
```

---

### `gte(a, b)`

Same as `>=`.

```js
f.gte(10, 20)
// 10 >= 20 = false
f.gte(10, 10)
// 10 >= 10 = true
```

---

### `inc(num)`

Increments by `1`.

```js
f.inc(1)
// 1 + 1 = 2
```

---

### `dec(num)`

Decrements by `1`.

```js
f.dec(2)
// 2 - 1 = 1
```

---

## Misc

Uncategorised utils.

---

### `global`

The global object for the current environment:

  * Node → `global`
  * browser → `window`
  * service worker, web worker, extension script → `self`
  * ??? → ???

---

### `id(value)`

Identity function: returns its first argument unchanged. Sometimes useful with higher-order functions.

```js
f.id('first', 'second', 'third')
// 'first'
```

---

### `di(_, value)`

Returns its _second_ argument unchanged. Sometimes useful with higher-order functions.

```js
f.di('first', 'second', 'third')
// 'second'
```

---

### `val(value)`

"Constant" function. Returns a function that always returns the original value. Useful for dealing with functional APIs when values are known in advance.

```js
const one = f.val(1)

one()
// 1

one(100)
// 1
```

---

### `noop`

Empty function. Functional equivalent of `;` or `undefined`. Sometimes useful with higher-order functions.

```js
f.noop()
// undefined
```

---

### `rethrow(value)`

Same as `throw` but can be used as an expression. Also sometimes useful with higher-order functions.

```js
// Can be used where the regular `throw` can't
const x = someTest ? someValue : f.rethrow(Error('unreachable'))
```

---

### `assign(target, ...sources)`

Like [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign), but stricter:

  * `target` must be a mutable object
  * each source must be a non-list object, `null`, or `undefined`
  * returns `undefined`

```js
const target = {}
f.assign(target, {one: 10}, {two: 20})
target
// {one: 10, two: 20}
```

---

### `maskBy(value, pattern)`

Overlays `pattern` on `value`, using the following rules:

```js
// Function pattern: call as-is

f.maskBy(x, f.inc)  ≡  f.inc(x)

// Primitive pattern: replace input

f.maskBy(x, null)   ≡  null
f.maskBy(x, 10)     ≡  10
f.maskBy(x, NaN)    ≡  NaN

// Regexp pattern:
//   input must be nil or string
//   call `.match(regexp)`

f.maskBy(x, /blah/)  ≡  f.onlyString(x).match(/blah/)

// List pattern:
//   input must be nil or list
//   recursively apply sub-patterns

f.maskBy(x, [])             ≡  f.onlyList(x)
f.maskBy(x, [/blah/])       ≡  [f.maskBy(x[0], /blah/)]
f.maskBy(x, [/blah/, 'c'])  ≡  [f.maskBy(x[0], /blah/), f.maskBy(x[1], 'c')]

// Struct pattern:
//   input must be nil or struct
//   recursively apply sub-patterns

f.maskBy(x, {})             ≡  f.onlyStruct(x)
f.maskBy(x, {one: /blah/})  ≡  {one: f.maskBy(x.one, /blah/)}
f.maskBy(x, {a: {b: 'c'}})  ≡  {a: f.maskBy(x.a, {b: 'c'})}
```

### `mask(pattern)`

Takes a pattern and returns a version of [`maskBy`](#maskby-value-pattern-) bound to that pattern. See the rules above.

```js
f.mask(pattern)
// ≡ function(x) {return f.maskBy(x, pattern)}

f.mask(pattern)(input)
// ≡ f.maskBy(input, pattern)

```

---

### `validate(value, test)`

where `test: ƒ(value) -> boolean`

Minification-friendly assertion. If `!test(value)`, throws an exception with a message including `value` and the name of the test function.

Since the assertion doesn't contain any strings, it can be minified to just a few characters.

```js
f.validate({}, f.isObject)
//

f.validate('blah', f.isFunction)
// Uncaught Error: Expected blah to satisfy test isFunction
```

---

### `validateEach(list, test)`

Same as `validate` but asserts each value in the provided `list`. Includes the list index in the error message.

```js
f.validateEach([f.isFunction], f.isFunction)
//

f.validateEach(['blah'], f.isFunction)
// Uncaught Error: Expected blah at index 0 to satisfy test isFunction
```

---

### `validateInstance(object, Class)`

Asserts that `object` is an instance of the given class. Useful for writing ES5-style classes.

```js
function Queue() {
  f.validateInstance(this, Queue)
}
```

---

### `show(value)`

Returns a string describing the value. Prints plain data as JSON to avoid the dreaded `[object Object]`. Prints functions as their names or source code. Convenient for interpolating things into error messages. Used internally in [`validate`](#validate-value-test-).

```js
f.show(10)
// '10'

f.show(f.show)
// 'show'

f.show({one: 10, two: 20})
// '{"one":10,"two":20}'
```

---

## Miscellaneous

I'm receptive to suggestions. If this library _almost_ satisfies you but needs changes, open an issue on [GitHub](https://github.com/mitranim/fpx/issues) or chat me up. Contacts: https://mitranim.com/#contacts.
