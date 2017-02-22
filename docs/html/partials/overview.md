## Overview

`fpx`: **f**unctional **p**rogramming e**x**tensions for JavaScript.
<a href="https://github.com/Mitranim/fpx/blob/master/lib/fpx.js" target="_blank">Source <span class="fa fa-github"></span></a>

See the sibling library
<a href="http://mitranim.com/espo/" target="_blank">`espo`</a>
for stateful programming utils.

Similar to `lodash`, but more lightweight and specialised. Differences:

* One small file (7 KB minified, compare with 67 KB in lodash 4.0)
* Richer higher order function utils
* Fewer data manipulation utils (relegated to <a href="https://github.com/Mitranim/emerge" target="_blank">Emerge <span class="fa fa-github"></span></a>)
* Emphasis on simplicity of source code

Install with `npm`:

```sh
npm i --save fpx
```

All examples imply an import:

```js
const {someFunction} = require('fpx')
```

On this page, all `fpx` words are exported into global scope. You can run
examples in the browser console.

----
