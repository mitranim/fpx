Same as `throw` but an expression rather than a statement. Also sometimes useful with higher-order functions.

```js
const x = someTest ? someValue : f.panic(Error(`unreachable`))
```
