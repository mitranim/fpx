## List

List manipulation utils. Like all other `fpx` functions, they treat their
arguments as immutables and never modify them.

Note that in `fpx`, **strings are not lists** and are treated as `undefined` or `[]`. To operate on a list of "characters", [`slice`](#-slice-value-start-end-) a string first.

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

### `foldl(list, init, fun)`

where `fun = ƒ(accumulator: any, value: any, index: number) -> any`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce" target="_blank">`Array.prototype.reduce`</a>, with the following differences:

  * works on any list
  * safe to call on non-lists; returns `init`
  * the argument order is `list, init, fun` rather than `this=list, fun, init`
  * the init argument is mandatory

```js
foldl([1, 2, 3], 10, (a, b) => a + b)
// 10 + 1 + 2 + 3 = 16
```

---

### `foldr(list, init, fun)`

where `fun = ƒ(accumulator: any, value: any, index: number) -> any`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight" target="_blank">`Array.prototype.reduceRight`</a>, with the following differences:

  * works on any list
  * safe to call on non-lists; returns `init`
  * the argument order is `list, init, fun` rather than `this=list, fun, init`
  * the init argument is mandatory

```js
foldr([1, 5, 20], 100, (a, b) => a - b)
// 100 - 20 - 5 - 1 = 74
```

---

### `map(list, fun)`

where `fun = ƒ(value: any, index: number) -> any`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map" target="_blank">`Array.prototype.map`</a>, with the following differences:

  * works on any list
  * safe to call on non-lists; returns `[]`

```js
function double(num) {return num * 2}

map([1, 2, 3], double)
// [2, 4, 6]
// Same as: [2, 4, 6].map(double)
```

---

### `filter(list, test)`

where `test = ƒ(value: any, index: number) -> boolean`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter" target="_blank">`Array.prototype.filter`</a>, with the following differences:

  * works on any list
  * safe to call on non-lists; returns `[]`

```js
filter([1, 2, true, false], isBoolean)
// [true, false]

filter([{val: 0}, null, {val: 1}], test({val: id}))
// [{val: 1}]
```

---

### `find(list, test)`

where `test = ƒ(value: any, index: number) -> boolean`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find" target="_blank">`Array.prototype.find`</a>, with the following differences:

  * works on any list
  * safe to call on non-lists; returns `undefined`

```js
find([1, 2, true, false], isBoolean)
// true

find([{val: 0}, null, {val: 1}], test({val: id}))
// {val: 1}
```

---

### `every(list, test)`

where `test = ƒ(value: any, index: number) -> boolean`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every" target="_blank">`Array.prototype.every`</a>, with the following differences:

  * works on any list
  * safe to call on non-lists; returns `true`

```js
every([], isBoolean)
// true

every([true, false], isBoolean)
// true

every([true, false, 10, 20], isBoolean)
// false
```

---

### `some(list, test)`

where `test = ƒ(value: any, index: number) -> boolean`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some" target="_blank">`Array.prototype.some`</a>, with the following differences:

  * works on any list
  * safe to call on non-lists; returns `false`

```js
some([], isBoolean)
// false

some([10, 20], isBoolean)
// false

some([true, false, 10, 20], isBoolean)
// true
```

---

### `procure(list, fun)`

where `fun = ƒ(value: any, index: number) -> any`

Similar to [`find`](#-find-list-test-), but returns the result of `fun` rather
than the element it was called on.

```js
function double(num) {return num * 2}

procure([0, 0, 10, 100], double)
// double(10) = 20
```

### `includes(list, value)`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes" target="_blank">`Array.prototype.includes`</a>, with the following differences:

  * works on any list
  * safe to call on non-lists; returns `false`

```js
includes([3, 2, 1], NaN)
// false

includes([3, 2, NaN], NaN)
// true

includes()
// false
```

---

### `indexOf(list, value)`

Like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf" target="_blank">`Array.prototype.indexOf`</a>, with the following differences:

  * works on any list
  * safe to call on non-lists; returns `-1`
  * uses [`is`](#-is-one-other-) rather than `===` and therefore detects `NaN`

```js
indexOf([3, 2, 1], 1)
// 2

indexOf([3, 2, NaN], NaN)
// 2
```

---

### `slice(value, [start], [end])`

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice" target="_blank">`Array.prototype.slice`</a>,
but with the sliceable as the first argument.

This is the only list function in `fpx` that works on strings.

```js
slice([1, 2, 3], 2)
// [3]

slice('hello world', 3, 5)
// ['l', 'o']
```

---

### `append(list, value)`

Returns a version of `list` with `value` appended at the end. Treats a non-list argument as `[]`.

```js
append([1, 2], 3)
// [1, 2, 3]
```

---

### `prepend(list, value)`

Returns a version of `list` with `value` prepended at the start. Treats a non-list argument as `[]`.

```js
prepend([2, 3], 1)
// [1, 2, 3]
```

---

### `remove(list, value)`

Returns a version of `list` with one occurrence of `value` removed. May return
the original list. Treats a non-list argument as `[]`.

```js
remove(['one', 'two', 'three'], 'two')
// ['one', 'three']

remove(['one', 'two', 'one'], 'one')
// ['two', 'one']
```

---

### `insertAtIndex(list, index, value)`

Returns a version of `list` with `value` inserted at `index`, moving subsequent elements to the end. Treats a non-list argument as `[]`. `index` must be an integer within list bounds + 1, otherwise throws.

```js
insertAtIndex(undefined, 0, 'zero')
// ['zero']

insertAtIndex(['zero', 'one', 'two'], 0, 'absolute zero')
// ['absolute zero', 'zero', 'one', 'two']

insertAtIndex(['zero', 'one', 'two'], 2, '...')
// ['zero', 'one', '...', 'two']
```

---

### `removeAtIndex(list, index)`

Returns a version of `list` with the value at `index` removed, if within bounds. Treats a non-list argument as `[]`. `index` must be an integer, otherwise throws.

```js
removeAtIndex(['zero', 'one', 'two'], 0)
// ['one', 'two']

removeAtIndex(['zero', 'one', 'two'], 1)
// ['zero', 'two']

removeAtIndex(['zero', 'one', 'two'], 10)
// ['zero', 'one', 'two']
```

---

### `adjoin(list, value)`

Appends `value` to `list`, duplicate-free. Returns the same `list` if it already [`includes`](#-includes-list-value-) `value`. Treats a non-list argument as `[]`.

```js
adjoin([10, 20], 30)
// [10, 20, 30]

adjoin([10, 20, 30], 20)
// [10, 20, 30]
```

---

### `toggle(list, value)`

Appends or removes `value`, depending on whether it's already included. Treats a non-list argument as `[]`.

```js
toggle([10, 20], 30)
// [10, 20, 30]

toggle([10, 20, 30], 30)
// [10, 20]
```

---

### `concat(...lists)`

Concatenates lists, ignoring non-list arguments.

This is intentionally **different** from <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat" target="_blank">`Array.prototype.concat`</a> and, by extension, lodash's `_.concat`. They inherited Scheme's hazardous mistake of appending non-list values. This leads to surprising errors and/or intentional abuse. `fpx`'s `concat` ignores non-lists, preventing this gotcha.

**Note**: for individual elements, use [`append`](#-append-list-value-) and
[`prepend`](#-prepend-list-value-) instead.

```js
concat()
// []

concat([10], [20], [30])
// [10, 20, 30]

concat([10, 20], 30)
// [10, 20]
// non-list argument is ignored
```

---

### `flat(list)`

Deeply flattens the given list. Safe to call on non-lists: returns `[]`.

```js
flat([1, [2], [[3]]])
// [1, 2, 3]
```

---

### `head(list)`

Returns the first element of the given list. Safe to call on non-lists: returns `undefined`.

```js
head()
// undefined

head([1, 2, 3])
// 1

head('string')
// undefined
```

---

### `tail(list)`

Returns all but first element of the given list. Safe to call on non-lists: returns `[]`.

```js
tail()
// []

tail([1, 2, 3])
// [2, 3]

tail('string')
// []
```

---

### `init(list)`

Returns all but last element of the given list. Safe to call on non-lists: returns `[]`.

```js
init()
// []

init([1, 2, 3])
// [1, 2]

init('string')
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

last('string')
// undefined
```

---

### `take(list, count)`

Returns a sub-`list` with `count` elements taken from the start. Equivalent to `slice(list, count)`. Safe to call on non-lists: returns `[]`.

```js
take(undefined, 0)
// []

take([10, 20, 30, 40], 2)
// [10, 20]

take([10, 20, 30, 40], Infinity)
// [10, 20, 30, 40]
```

---

### `drop(list, count)`

Returns a sub-`list` with `count` elements removed from the start. Equivalent to `slice(list, 0, count)`. Safe to call on non-lists: returns `[]`.

```js
drop(undefined, 0)
// []

drop([10, 20, 30, 40], 2)
// [30, 40]

drop([10, 20, 30, 40], Infinity)
// []
```

---

### `reverse(list)`

Returns a version of `list` with the elements reversed. Safe to call on non-lists: returns `[]`.

```js
reverse()
// []

reverse([10, 20, 30])
// [30, 20, 10]

reverse('string')
// []
```

---
