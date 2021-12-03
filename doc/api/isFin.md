Same as ES2015's [`Number.isFinite`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite). True if `val` is a primitive number and is _not_ `NaN` or `±Infinity`. In most cases you should prefer `isFin` over `isNum`.

```js
f.isFin(1)
// true
f.isFin('1')
// false
f.isFin(NaN)
// false
```
