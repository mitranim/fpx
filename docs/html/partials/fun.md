## Fun

Various higher-order functions.

---

### `call(fun, ...args)`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call" target="_blank">`Function.prototype.call`</a>. Sometimes useful with higher-order functions.

```js
call(add, 1, 2)
// 3

// equivalent:
// add(1, 2)
// call(add, 1, 2)
// add.call(null, 1, 2)
```

---

### `apply(fun, args)`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply" target="_blank">`Function.prototype.apply`</a>. Sometimes useful with higher-order functions.

```js
apply(add, [1, 2])
// 3

// equivalent:
// add(1, 2)
// add(...[1, 2])
// apply(add, [1, 2])
// add.apply(null, [1, 2])
```

---

### `bind(fun, ...args)`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind" target="_blank">`Function.prototype.bind`</a>, with implicit `this = undefined`.

Returns a new function that represents
<a href="https://en.wikipedia.org/wiki/Partial_application" target="_blank">partial application</a>
of the given function, a common tool in functional programming. When called, it
joins arguments from both calls and invokes the original function. Think of it
like splitting a function call in two, or more.

Roughly equivalent to lodash's `_.partial`.

```js
const inc = bind(add, 1)

inc(2)
// 3

const incMany = bind(map, inc)

incMany([1, 2, 3])
// [2, 3, 4]

// equivalent:
// bind(map, inc) = map.bind(null, inc)
```

---

### `and(...funs)`

Represents the `&&` operation in terms of functions rather than expressions.
Returns a new function that `&&`s calls to the given functions, passing all
arguments to each.

Like `&&`, it's lazy and aborts early when a function returns a falsy value.

```js
function isPositive (value) {return value > 0}

// this:
const isPosNum = and(isNumber, isPositive)

// is equivalent to:
function isPosNum () {
  return isNumber(...arguments) && isPositive(...arguments)
}

isPosNum(1)
// isNumber(1) && isPositive(1) = true

isPosNum('1')
// isNumber('1') = false
```

---

### `or(...funs)`

Represents the `||` operation in terms of functions rather than expressions.
Returns a new function that `||`s calls to the given functions, passing all
arguments to each.

Like `||`, it's lazy and aborts early when a function returns a truthy value.

```js
// this:
const isPrintable = or(isNumber, isString)

// is equivalent to:
function isPrintable () {
  return isNumber(...arguments) || isString(...arguments)
}

isPrintable(NaN)
// isNumber(NaN) = true

isPrintable([])
// isNumber([]) || isString([]) = false
```

---

### `not(fun)`

Represents the `!` operation in function terms. Returns a new function that
negates the result of the given function.

```js
function eq (a, b) {return a === b}

// this:
const different = not(eq)

// is equivalent to:
function different () {
  return !eq(...arguments)
}

different(1, 2)
// !eq(1, 2) = true
```

---

### `ifelse(test, left, right)`

Represents the ternary boolean operation  `_ ? _ : _` in terms of functions rather than expressions. Returns a new function that calls `left` if `test` succeeds and `right` otherwise, passing all arguments to each.

```js
function bang (a) {return a + '!'}

// this:
const oneone11 = ifelse(isNumber, inc, bang)


// is equivalent to:
function oneone11 () {
  return (isNumber(...arguments) ? inc : bang)(...arguments)
}

oneone11(1)
// isNumber(1) ? inc(1) : _ = 2

oneone11('1')
// isNumber('1') ? _ : bang('1') = '1!'
```

---

### `ifthen(test, fun)`

Like `ifelse` without the `else` clause.

```js
// this:
ifthen(test, fun)

// is equivalent to:
ifelse(test, fun, () => undefined)

const x = ifthen(isNumber, inc)

x(1)
// inc(1) = 2

x('1')
// undefined
```

---

### `ifonly(test, fun)`

Like `ifelse` but returns the first argument when `test` fails.

```js
ifonly(test, fun)
// = ifelse(test, fun, x => x)

const x = ifonly(isNumber, inc)

x(1)
// inc(1) = 2

x('1')
// '1'
```

---

### `ifexists(fun)`

Like `ifthen` with an implicit `id` predicate. The resulting function calls
`fun` when the first argument is truthy, and returns `undefined` otherwise.

```js
// definition
const ifexists = bind(ifthen, id)

ifexists(fun)
// = ifthen(id, fun)

const x = ifexists(inc)

x(1)
// inc(1) = 2

x(0)
// undefined
```

---

### `cond(...funs)`

Represents the Lisp-style
<a href="https://clojuredocs.org/clojure.core/cond" target="_blank">`cond`</a>
operation in terms of functions rather than expressions. It's basically a
supercharged `ifelse` that accepts from 0 to ∞ functions.

Takes any number of functions and divides them into predicate/operator pairs,
forming "if/then/else" clauses. The last odd argument becomes a catch-all "else"
clause. When given an even number of args, "else" is a no-op that returns
`undefined`.

The resulting function finds an operator by testing arguments against
predicates, and returns the operator's result.

In these examples, all arguments to `cond` are functions. Comments show
equivalent versions expressed with `ifelse/ifthen`.

```js
cond()
// = noop

cond(isNumber)
// = isNumber

cond(isNumber, dec)
// = ifthen(isNumber, dec)

cond(isNumber, dec, inc)
// = ifelse(isNumber, dec, inc)

const x = cond(
  isNumber,  inc,
  isBoolean, no
)
// = ifelse(isNumber, inc, ifelse(isBoolean, no, noop))

x(1)
// inc(1) = 2

x(true)
// no(true) = false

x([])
// noop() = undefined
```

---

### `pipe(...funs)`

Combines `funs` left-to-right. The resulting function will pass all arguments to the first `fun`, the returned value to the second, and so on.

Note the left-to-right flow. See [`comp`](#-comp-funs-) for the opposite direction.

Equivalent to lodash's `_.flow`.

```js
// Equivalent
pipe(a, b, c)(...args)
c(b(a(...args)))

const double = bind(mul, 2)
const x = pipe(add, double)
x(1, 2)
// 6
// Same as: double(add(1, 2))
```

---

### `comp(...funs)`

Combines `funs` right-to-left, similar to nested function calls. The resulting function will pass all arguments to the last `fun`, the returned value to the second-last, and so on.

Note the right-to-left flow. See [`pipe`](#-pipe-funs-) for the opposite direction.

```js
// Equivalent
comp(c, b, a)(...args)
c(b(a(...args)))

const double = bind(mul, 2)
const x = comp(double, add)
x(1, 2)
// 6
// Same as: double(add(1, 2))
```

---

### `seq(...funs)`

Represents the
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator" target="_blank">comma operator</a> in terms of functions rather than expressions.

Returns a new function that runs the given functions in order, passing the same original arguments to each, returning the result of the last function. Useful for combining side-effectful functions.

```js
function first (a, b) {
  console.log('first:', a, b)
}

function second (a, b) {
  console.log('second:', a, b)
}

const x = seq(first, second, add)

x(1, 2)
// prints 'first: 1 2'
// prints 'second: 1 2'
// 3
```

---

### `pipeAnd(...funs)`

Same as [`pipe`](#-pipe-funs-) but inserts `&&` between function calls. If one of the chained functions returns a falsy value, the others are not invoked. Useful for composing functions that expect truthy values.

```js
function getOne (a) {return a.one}
function getTwo (a) {return a.two}

const x = pipeAnd(getOne, getTwo)

x({one: {two: 2}})
// 2

x({one: NaN})
// NaN
```

---

### `compAnd(...funs)`

Same as [`comp`](#-comp-funs-) but inserts `&&` between function calls. If one of the chained functions returns a falsy value, the others are not invoked. Useful for composing functions that expect truthy values.

```js
function getOne (a) {return a.one}
function getTwo (a) {return a.two}

const x = compAnd(getTwo, getOne)

x({one: {two: 2}})
// 2

x({one: NaN})
// NaN
```

---

### `juxt(...funs)`

Returns a function that calls all `funs`, passing the same arguments, returning the results as a list.

Name taken from Clojure's version: <a href="https://clojuredocs.org/clojure.core/juxt" target="_blank">`clojure.core/juxt`</a>. Short for "juxtapose". Equivalent to lodash's `_.over`.

```js
const x = juxt(add, sub)

x(1, 2)
// [3, -1]
```

---

### `rest(fun)`

Returns a function that collects its arguments and passes them to `fun` as a single argument. Opposite of `spread`.

```js
rest(id)(1, 2, 3)
// [1, 2, 3]

// same without rest:
id([1, 2, 3])
// [1, 2, 3]
```

---

### `spread(fun)`

Returns a function that takes a single list and spreads it over `fun` as multiple arguments. Opposite of `rest`.

```js
function sum () {
  return foldl(arguments, 0, add)
}

spread(sum)([1, 2, 3])
// 6

// same without spread:
sum(1, 2, 3)
// 6
```

---

### `alter(fun, ...args)`

Spiritual complement of [`bind`](#-bind-fun-args-): binds arguments _after_ the first, leaving the first spot open. Returns a function that takes one argument and calls `fun` with it and `...args`, ignoring additional arguments. Useful for transforms where arguments `1..N` are known in advance.

```js
function sum(vals) {
  return foldl(vals, 0, add)
}

const x = alter(sum, 10, 20)

x(1)
// sum(1, 10, 20) = 31

x(1, 'ignored arg')
// sum(1, 10, 20) = 31
```

---
