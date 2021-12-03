Signature: `(any, typeof A) => A`.

Idempotently converts an arbitrary input to a given class:

  * If `isInst(val, cls)`, returns `val` as-is.
  * Otherwise returns `new cls(val)`.

```js
const newInst = f.inst([10, 20, 30], Set)
// Set{10, 20, 30}

const oldInst = f.inst(newInst, Set)
// Set{10, 20, 30}

newInst === oldInst
// true
```
