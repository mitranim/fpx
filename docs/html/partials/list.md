---

## List

List manipulation utils.

---

### `foldl(fun, accumulator, list)`

Similar to
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce" target="_blank">`Array#reduce`</a>,
but with an FP-friendly argument order (more suitable for currying and partial
application).

```js
function add (a, b) {
  return a + b
}

foldl(add, 10, [1, 2, 3])
// 10 + 1 + 2 + 3 = 16
```

---

### `foldr(fun, accumulator, list)`

Similar to
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight" target="_blank">`Array#reduceRight`</a>,
but with an FP-friendly argument order.

```js
function sub (a, b) {
  return a - b
}

foldr(sub, 100, [1, 5, 20])
// 100 - 20 - 5 - 1 = 74
```

---

### `map(fun, list)`

Like
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map" target="_blank">`Array#map`</a>,
but with an FP-friendly argument order.

```js
function double (a) {
  return a * 2
}

map(double, [1, 2, 3])
// [2, 4, 6]
```

---

### `filter(test, list)`

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

### `includes(list, value)`

Similar to
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

Returns a copy of `list` with `value` appended at the end.

```js
append([1, 2], 3)
// [1, 2, 3]
```

---

### `prepend(list, value)`

Returns a copy of `list` with `value` prepended at the start.

```js
prepend([2, 3], 1)
// [1, 2, 3]
```

---

### `remove(list, value)`

Returns a new list with all occurrences of `value` removed. Doesn't change the
original list.

```js
remove(['one', 'two', 'three'], 'two')
// ['one', 'three']
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
