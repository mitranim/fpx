## Overview

`fpx`: **f**unctional **p**rogramming e**x**tensions for JavaScript. Source: <a href="https://github.com/Mitranim/fpx/blob/master/src/fpx.js" target="_blank">https://github.com/Mitranim/fpx</a>

Similar to Lodash, but more lightweight and specialised. Differences:

* One small file (9 KB minified, compare with 67 KB in Lodash 4.0)
* Extremely simple source code
* Space-efficient, minifies well
* Richer higher-order-function utils
* Fewer data manipulation utils (partially relegated to Emerge, see below)

Written with ES2015 imports/exports. Webpack 4+ or Rollup, in combination with UglifyJS, should strip out the unused parts, leaving only what you actually use.

See sibling libraries:

  * Emerge: <a href="https://github.com/Mitranim/emerge" target="_blank">https://github.com/Mitranim/emerge</a>. Efficient patching and merging of plain JS data.
  * Espo: <a href="https://mitranim.com/espo/" target="_blank">https://mitranim.com/espo/</a>. Reactive and stateful programming: observables, implicit reactivity, automatic resource cleanup.

Install with `npm`. Current version: `{{VERSION}}`.

```sh
npm i --save fpx
```

All examples imply an import:

```js
const {someFunction} = require('fpx')
```

On this page, all `fpx` words are exported into global scope. You can run the examples in the browser console.

---
