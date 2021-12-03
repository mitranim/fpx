Same as `typeof val === 'number'`. True if the value is a primitive number, _including_ `NaN` and `±Infinity`. In most cases you should use `isFin` instead.

```js
f.isNum(1)
// true
f.isNum('1')
// false
f.isNum(NaN)
// true <-- WTF
```
