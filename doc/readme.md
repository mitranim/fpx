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
{{apiToc}}
* [#License](#license)
* [#Misc](#misc)

## Usage

In browsers and Deno, import by URL:

```js
import * as f from 'https://cdn.jsdelivr.net/npm/fpx@{{version}}/fpx.mjs'
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

{{api}}

## License

https://unlicense.org

## Misc

I'm receptive to suggestions. If this library _almost_ satisfies you but needs changes, open an issue or chat me up. Contacts: https://mitranim.com/#contacts
