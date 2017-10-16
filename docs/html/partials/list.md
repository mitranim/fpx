## List

List manipulation utils. Like all other `fpx` functions, they treat their
arguments as immutables and never modify them.

---

### `list(...values)`

Same as ES2015's
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of" target="_blank">`Array.of`</a>. Returns its arguments as an `Array`.

```js
list()
// []

list(1)
// [1]

list(1, [2])
// [1, [2]]
```

### `foldl(fun, accumulator, list)`

where `fun = ƒ(accumulator: any, value: any): any`

Similar to
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce" target="_blank">`Array#reduce`</a>,
but with an FP-friendly argument order, more suitable for currying and partial
application. The accumulator argument is mandatory.

```js
foldl(add, 10, [1, 2, 3])
// 10 + 1 + 2 + 3 = 16
```

---

### `foldr(fun, accumulator, list)`

where `fun = ƒ(accumulator: any, value: any, index: number): any`

Similar to
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight" target="_blank">`Array#reduceRight`</a>,
but with an FP-friendly argument order. The accumulator argument is mandatory.

```js
foldr(sub, 100, [1, 5, 20])
// 100 - 20 - 5 - 1 = 74
```

---

### `map(fun, list)`

where `fun = ƒ(value: any, index: number): any`

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map" target="_blank">`Array#map`</a>,
but with an FP-friendly argument order.

```js
const double = bind(mul, 2)

map(double, [1, 2, 3])
// [2, 4, 6]
```

---

### `filter(fun, list)`

where `fun = ƒ(value: any, index: number): boolean`

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter" target="_blank">`Array#filter`</a>,
but with an FP-friendly argument order.

```js
filter(isBoolean, [1, 2, true, false])
// [true, false]

filter(test({val: id}), [{val: 0}, null, {val: 1}])
// [{val: 1}]
```

---

### `find(test, list)`

where `fun = ƒ(value: any, index: number): boolean`

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find" target="_blank">`Array#find`</a>,
but with an FP-friendly argument order.

```js
find(isBoolean, [1, 2, true, false])
// true

find(test({val: id}), [{val: 0}, null, {val: 1}])
// {val: 1}
```

---

### `every(test, list)`

where `fun = ƒ(value: any, index: number): boolean`

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every" target="_blank">`Array#every`</a>,
but with an FP-friendly argument order.

```js
every(isBoolean, [])
// true

every(isBoolean, [true, false])
// true

every(isBoolean, [true, false, 10, 20])
// false
```

---

### `some(test, list)`

where `fun = ƒ(value: any, index: number): boolean`

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some" target="_blank">`Array#some`</a>,
but with an FP-friendly argument order.

```js
some(isBoolean, [])
// false

some(isBoolean, [10, 20])
// false

some(isBoolean, [true, false, 10, 20])
// true
```

---

### `procure(fun, list)`

where `fun = ƒ(value: any, index: number): any`

Similar to [`find`](#-find-test-list-), but returns the result of `fun` rather
than the element it was called on.

```js
const double = bind(mul, 2)

procure(double, [0, 0, 10, 100])
// double(10) = 20
```

### `includes(list, value)`

Similar to ES2015's
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes" target="_blank">`Array#includes`</a>.

```js
includes([3, 2, 1], NaN)
// false

includes([3, 2, NaN], NaN)
// true
```

---

### `indexOf(list, value)`

Similar to
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf" target="_blank">`Array#indexOf`</a>. Unlike `Array#indexOf`, it detects `NaN`.

```js
indexOf([3, 2, 1], 1)
// 2

indexOf([3, 2, NaN], NaN)
// 2
```

---

### `slice(value, [start], [end])`

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice" target="_blank">`Array#slice`</a>,
but with the sliceable as the first argument.

```js
slice([1, 2, 3], 2)
// [3]

slice('hello world', 3, 5)
// ['l', 'o']
```

---

### `append(list, value)`

Returns a version of `list` with `value` appended at the end.

```js
append([1, 2], 3)
// [1, 2, 3]
```

---

### `prepend(list, value)`

Returns a version of `list` with `value` prepended at the start.

```js
prepend([2, 3], 1)
// [1, 2, 3]
```

---

### `remove(list, value)`

Returns a version of `list` with one occurrence of `value` removed. May return
the original list.

```js
remove(['one', 'two', 'three'], 'two')
// ['one', 'three']

remove(['one', 'two', 'one'], 'one')
// ['two', 'one']
```

---

### `removeAtIndex(list, index)`

Returns a version of `list` with the value at `index` removed _if and only if_
`index` is a natural integer within the bounds of `list`. With any other input,
returns the `list` argument, coercing it to a list if necessary.

```js
remove(['one', 'two', 'three'], 0)
// ['two', 'three']

remove(['one', 'two', 'three'], 1)
// ['one', 'three']

remove(['one', 'two', 'three'], 10)
// ['one', 'two', 'three']
```

---

### `adjoin(list, value)`

Appends `value` to `list`, duplicate-free. Returns the same `list` if it already
[`includes`](#-includes-list-value-) `value`.

```js
adjoin([10, 20], 30)
// [10, 20, 30]

adjoin([10, 20, 30], 20)
// [10, 20, 30]
```

---

### `toggle(list, value)`

Appends or removes `value`, depending on whether it's already included.

```js
toggle([10, 20], 30)
// [10, 20, 30]

toggle([10, 20, 30], 30)
// [10, 20]
```

---

### `concat(...lists)`

Concatenates the given lists into one list. Ignores non-list arguments.

This is intentionally **different** from
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat" target="_blank">`Array#concat`</a> and, by extension, lodash's `_.concat`. They inherited
Scheme's mistakes and are hazardous. They accept both list and non-list
arguments, concatenating lists and appending other values. This often leads to
surprising results.

fpx's `concat` is more intuitive and therefore safer to use.

**Note**: for individual elements, use [`append`](#-append-list-value-) and
[`prepend`](#-prepend-list-value-) instead.

```js
concat()
// []

concat([10], [20], [30])
// [10, 20, 30]

concat([10, 20], 30)
// [10, 20]
```

---

### `flat(list)`

Deeply flattens the given list.

```js
flat([1, [2], [[3]]])
// [1, 2, 3]
```

---

### `head(list)`

Returns the first element of the given list.

```js
head()
// undefined

head([1, 2, 3])
// 1

head('str')
// undefined
```

---

### `tail(list)`

Returns all but first element of the given list.

```js
tail()
// []

tail([1, 2, 3])
// [2, 3]

tail('str')
// []
```

---

### `init(list)`

Returns all but last element of the given list.

```js
init()
// []

init([1, 2, 3])
// [1, 2]

init('str')
// []
```

---

### `last(list)`

Returns the last element of the given list.

```js
last()
// undefined

last([1, 2, 3])
// 3

last('str')
// undefined
```

---

### `take(count, list)`

Returns a sublist with `count` elements taken from the start. Equivalent to
`slice(list, count)`.

```js
take(0, undefined)
// []

take(2, [10, 20, 30, 40])
// [10, 20]

take(Infinity, [10, 20, 30, 40])
// [10, 20, 30, 40]
```

---

### `drop(count, list)`

Returns a sublist with `count` elements removed from the start. Equivalent to
`slice(list, 0, count)`.

```js
drop(0, undefined)
// []

drop(2, [10, 20, 30, 40])
// [30, 40]

drop(Infinity, [10, 20, 30, 40])
// []
```

---

### `reverse(list)`

Returns a version of `list` with the elements reversed end-to-start. If called
with a non-list, returns an empty list.

```js
reverse()
// []

reverse([10, 20, 30])
// [30, 20, 10]

reverse('str')
// []
```

---
