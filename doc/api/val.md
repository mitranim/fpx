Takes a value and creates a function that always returns that value. Sometimes useful with higher order functions.

```js
const constant = f.val(1)

constant()
// 1

constant(`this input is ignored`)
// 1
```
