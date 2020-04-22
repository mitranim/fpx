## Overview

`fpx`: **f**unctional **p**rogramming e**x**tensions for JavaScript. Lightweight replacement for Lodash: ≈ 12 KiB minified.

Uses ES2015 exports, compatible with tree shaking.

Documentation: https://mitranim.com/fpx/.

## Installation and Usage

```sh
npm i -E fpx
```

```js
const f = require('fpx')
// or
import * as f from 'fpx'
```

See the API reference: https://mitranim.com/fpx/.

## Changelog

### 0.7.3

Renamed the source file from `fpx.js` to `fpx.mjs` to support some obscure uses.

### 0.7.2

Insignificant micro-improvements.

### 0.7.1

New functions:

  * `everyVal`: same as `every` but for struct values
  * `someVal`: same as `some` but for struct values

### 0.7.0

New term: non-list objects are now called "structs". All object-related functions in Fpx validate their inputs via `onlyStruct`.

New functions:

  * `isStruct`
  * `onlyStruct`
  * `entries`

Breaking: `keys` and `values` are stricter; they're now consistent with all other object-related functions.

  * `keys` now accepts only `null`, `undefined`, and non-list objects, rejecting other inputs with an exception
  * `values` now accepts only `null`, `undefined`, and non-list objects, rejecting other inputs with an exception

Breaking: cast functions now serve as nil-tolerant assertions.

  * `onlyString` now accepts only `null`, `undefined`, and strings, rejecting other inputs with an exception
  * `onlyList` now accepts only `null`, `undefined`, and lists, rejecting other inputs with an exception
  * `onlyDict` now accepts only `null`, `undefined`, and dicts, rejecting other inputs with an exception

Breaking `testBy` changes:

  * function pattern: always convert result to boolean
  * regexp pattern: apply only to string input; no implicit conversion
  * object pattern: apply only to non-list object; ignore list and function inputs

Breaking `maskBy` changes:

  * regexp pattern: use `onlyString` to validate input
  * regexp pattern: use `String.prototype.match` instead of `RegExp.prototype.test`
  * list pattern: use `onlyList` to validate input
  * object pattern: use `onlyStruct` to validate input

Breaking: `take` and `drop` now accept only natural numbers as the second argument, rejecting negative integers and other inputs.

### 0.6.0

Breaking change: strictness.

* List functions accept `null`, `undefined`, and lists, rejecting other arguments with an exception. This includes list-specific getters such as `head` and `tail`.

* Dict functions accept `null`, `undefined`, and non-list objects, rejecting other arguments with an exception.

This change does not affect generic getters such as `get` and `size`.

### 0.5.1

`show` now adds quotes around a string.

### 0.5.0

Massive rework that makes Fpx a realistic replacement for Lodash. Breaking.

  * removed 22 functions and 1 alias
  * added 51 functions
  * renamed 3 functions
  * greatly improved performance
  * size went from 9 KiB to 12 KiB

Removed most weyrd-ass function transforms like `and`, `or`, `juxt`, `alter`, etc. Years of practice have revealed major drawbacks and questionable value. The best way to compose functions is to write functions that call functions. It's that simple.

Added tons of new list and dict functions. See the documentation.

All "iteration" functions now accept additional arguments for the operator.

Breaking changes in existing functions:

  * `flat` → `flattenDeep`
  * `foldl` → `fold`
  * `foldr` → `foldRight`
  * removed the `isPlainObject` alias for `isDict`
  * `keys` and `values` now only work on dicts
  * removed handling of `this`; just pass it as an additional operator argument

Approximate diff of the exports:

```diff
-alter
-and
+assign
-comp
-compAnd
+compact
-cond
+each
+eachVal
+findIndex
+findIndexRight
+findKey
+findMaxBy
+findMinBy
+findRight
+findVal
-flat
-foldl
-foldr
+flatMap
+flatMapDeep
+flatten
+flattenDeep
+fold
+foldRight
+foldVals
-getAt
+getter
+global
+groupBy
-ifelse
-ifexists
-ifonly
-ifthen
+intersection
+invert
+invertBy
+isEmpty
+isKey
-isPlainObject
+isSomething
-juxt
+keyBy
-list
+lastIndexOf
+mapFilter
+mapValsSort
+max
+maxBy
+min
+minBy
-or
-pipe
-pipeAnd
+omitBy
+omitKeys
+onlyDict
+onlyList
+onlyString
+partition
+pickBy
+pickKeys
+range
+reject
-rest
-seq
-spread
+sort
+sortBy
+sum
+sumBy
-testAnd
-testArgsAnd
-testArgsOr
-testOr
+toArray
+uniq
+uniqBy
+vacate
+validateInstance
```

### 0.4.5

Added `isIterator`, published `show`.

### 0.4.2

Added `lt`, `gt`, `lte`, `gte`.

### 0.4.1

* added `isInfinity`
* `isList` is faster
* `isInteger` is faster

### 0.4.0

`0.4.0` has massive breaking changes. It removes a few functions and changes the argument order in 15 functions. It should basically be treated as a different library under the same name. Migrating an existing application is likely to cause subtle breakage, and existing dependents should probably remain on `0.3.1`.

Functions added:

  * `insertAtIndex`

Functions removed:

  * `applyBind`
    * tends to be unused, side effect of how `bind` was defined
  * `curry1`
    * leads to shorter but harder to understand code, not worth the tradeoff
  * `flip`
    * hazardous due to JS's unpredictable argument count
  * `revise`
    * leads to code that is both extremely short and extremely hard to understand; not worth the tradeoff
  * `fanout`
  * `funnel`
    * not any better than regular imperative code with variable reassignment

Functions changed:

  * `testBy`: changed arguments to `(operand, pattern)`
  * `foldl`: changed arguments to `(list, init, fun)`
  * `foldr`: changed arguments to `(list, init, fun)`
  * `map`: changed arguments to `(list, fun)`
  * `filter`: changed arguments to `(list, fun)`
  * `find`: changed arguments to `(list, fun)`
  * `every`: changed arguments to `(list, fun)`
  * `some`: changed arguments to `(list, fun)`
  * `procure`: changed arguments to `(list, fun)`
  * `take`: changed arguments to `(list, count)`
  * `drop`: changed arguments to `(list, count)`
  * `mapVals`
    * changed arguments to `(dict, fun)`
    * removed `mapDict` alias; use `mapVals` instead
  * `mapKeys`
    * changed arguments to `(dict, fun)`
    * changed arguments in mapping function to `(key, value)`
  * `maskBy`
    * changed arguments to `(operand, pattern)`
  * `validate`
    * changed arguments to `(operand, validator)`

Rule/mnemonic for argument order: primary operand first. Motivation:

  * operator-last is more syntactically convenient when the operator is an inline function, especially if multiline
  * consistent operand-first is easier to remember
  * the original motivation for operator-first, currying, tends to be inconvenient and/or hazardous in JS

In list functions, the argument order is now similar to `Array.prototype` built-ins.

Removed the preservation of `this` from all higher-order functions that create a new function: `bind`, `and`, `or`, `not`, `ifelse`, `ifthen`, `ifonly`, `ifexists`, `cond`, `pipe`, `comp`, `seq`, `pipeAnd`, `juxt`, `rest`. Motivation: too implicit to rely on, tends to be unused, no tests.

## Misc

I'm receptive to suggestions. If this library _almost_ satisfies you but needs changes, open an issue or chat me up. Contacts: https://mitranim.com/#contacts
