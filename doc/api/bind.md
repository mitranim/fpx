Like [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), but instead of taking `this` as an argument, takes it contextually. By default `this` is `undefined`. To set it, use `f.bind.call`.

Returns a new function that represents [partial application](https://en.wikipedia.org/wiki/Partial_application) of the given function, a common tool in functional programming. When called, it joins arguments from both calls and invokes the original function. Think of it like splitting a function call in two, or more. Performance is inferior to closures; avoid in hotspots.

```js
const inc = f.bind(f.add, 1)

inc(2)
// 3
```

Note: Fpx no longer provides facilities for currying. Experience has shown it to be extremely error prone. Currying, as seen in purely functional languages such as Haskell, tends to care about the amount of arguments. Calling a curried function may either create a new function, or call the underlying function (possibly side-effectful). This approach works reasonably well in statically typed languages, but not in JS where all functions are variadic and it's conventional to sometimes pass extra utility arguments "just in case", which the callee may or may not care about. `bind` is different because the created function will always call the original function, regardless of how many arguments were passed.
