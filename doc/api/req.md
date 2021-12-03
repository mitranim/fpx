Signature: `(val, test) => val` where `test: val => bool`.

Short for "require". Minification-friendly assertion. If `!test(val)`, throws an informative `TypeError`. Otherwise, returns `val` as-is.

```js
f.req({one: `two`}, f.isObj)
// {one: `two`}

f.req('str', f.isFun)
// uncaught TypeError: expected "str" to satisfy test isFun
```
