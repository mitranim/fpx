True if value is "composite" / "compound" / "complex". Opposite of [#`isPrim`](#function-isprim). Definition:

```js
function isComp(val) {return isObj(val) || isFun(val)}
```
