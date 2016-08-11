---

## Fun

Various higher-order functions.

---

### `call(fun, ...args)`

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call" target="_blank">`Function#call`</a>,
but with the function as the first argument and an implicit `this = undefined`.
Sometimes useful in function composition contexts.

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

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply" target="_blank">`Function#apply`</a>,
but with the function as the first argument and an implicit `this = undefined`.

```js
apply(add, [1, 2])
// 3

// equivalent:
// apply(add, [1, 2])
// add.apply(null, [1, 2])
```

---

### `bind(fun, ...args)`

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind" target="_blank">`Function#bind`</a>,
but with the function as the first argument and an implicit `this = undefined`.

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

### `flip(fun)`

Returns a function that passes its arguments to `fun` in reverse.

```js
function add3 (a, b, c) {return a + b + c}

add3('left', '-', 'right')
// 'left-right'

flip(add3)('left', '-', 'right')
// 'right-left'
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

Represents the `_ ? _ : _` operation in terms of functions rather than
expressions. Returns a new function that calls `left` if `test` succeeds and
`right` otherwise, passing all arguments to each.

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
// this:
ifonly(test, fun)

// is equivalent to:
ifelse(test, fun, x => x)

const x = ifonly(isNumber, inc)

x(1)
// inc(1) = 2

x('1')
// '1'
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

In these examples, all arguments to `cond` are functions. See the equivalent
versions expressed with `ifelse/ifthen`.

```js
cond()
// () => undefined

cond(isPositive)
// isPositive

cond(isPositive, dec)
// ifthen(isPositive, dec)

cond(isPositive, dec, inc)
// ifelse(isPositive, dec, inc)

const x = cond(
  isNumber,  inc,
  isBoolean, no,
  noop
)
// ifelse(isNumber, inc, ifelse(isBoolean, no, noop))

x(1)
// inc(1) = 2

x(true)
// no(true) = false

x([])
// noop() = undefined
```

---

### `pipe(...funs)`

Returns a new function that represents
<a href="https://en.wikipedia.org/wiki/Function_composition_(computer_science)" target="_blank">composition</a>
of the given functions, a common tool in functional programming. When called, it
passes all arguments to the first function, and pipes the output through the
rest.

Flows values left-to-right, in the direction of reading. See
[`comp`](#-comp-funs-) for the opposite direction.

Equivalent to lodash's `_.flow`.

```js
function double (a) {return a * 2}

const x = pipe(add, double)

x(1, 2)
// 6
// Same as double(add(1, 2))
```

---

### `comp(...funs)`

Returns a new function that represents
<a href="https://en.wikipedia.org/wiki/Function_composition_(computer_science)" target="_blank">composition</a>
of the given functions.

Flows values right-to-left, symmetrical to normal nested function calls. See
[`pipe`](#-pipe-funs-) for the opposite direction.

```js
function double (a) {return a * 2}

const x = comp(double, add)

x(1, 2)
// 6
// Same as double(add(1, 2))
```

---

### `seq(...funs)`

Returns a new function that runs the given functions independently from each
other, passing all arguments to each and returning the result of the last one.
Useful for combining operations that have side effects.

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

Same as [`pipe`](#-pipe-funs-) but inserts `&&` between function calls. If one
of the chained functions returns a falsy value, other functions are not invoked.
Useful for composing functions that expect truthy values.

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

Same as [`comp`](#-comp-funs-) but inserts `&&` between function calls. If one
of the chained functions returns a falsy value, other functions are not invoked.
Useful for composing functions that expect truthy values.

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

Returns a function that calls all `funs`, returning the results as a list. It
passes the same arguments to each fun.

Name taken from a similar
<a href="https://clojuredocs.org/clojure.core/juxt" target="_blank">function</a>
in Clojure. Short for "juxtapose". Equivalent to lodash's `_.over`.

```js
const x = juxt(add, sub)

x(1, 2)
// [3, -1]
```

---

### `defer(fun, ...args)`

Similar to
<a href="https://en.wikipedia.org/wiki/Currying" target="_blank">curry</a>,
but the original function is invoked after exactly two calls, regardless of
how many arguments were passed. Extra arguments passed to `defer` are prepended
to the rest.

Note this is completely different from lodash's `_.defer` (which is basically
`setTimeout`).

```js
function add3 (a, b, c) {return a + b + c}

const addf = defer(add3)

// is equivalent to:
function addf () {
  return bind(add3, ...arguments)
}

addf(1, 2, 3)()
// 6

addf(1, 2)(3)
// 6

addf(1)(2, 3)
// 6

// with curry, this would have returned an intermediary function
// with defer, two calls always reach the original
addf(1)(2)
// NaN
```

---

### `rest(fun)`

Returns a function that collects its arguments and passes them to `fun` as the
first argument. An opposite of `spread`.

```js
rest(id)(1, 2, 3)
// [1, 2, 3]

// same without rest:
id([1, 2, 3])
// [1, 2, 3]
```

---

### `spread(fun)`

Returns a function that takes arguments as one list-like value and spreads it
over `fun` as multiple arguments. An opposite of `rest`.

```js
function sum () {
  return foldl(add, 0, arguments)
}

spread(sum)([1, 2, 3])
// 6

// same without spread:
sum(1, 2, 3)
// 6
```
