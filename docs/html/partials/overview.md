## Overview

`fpx` — **f**unctional **p**rogramming e**x**tensions for JavaScript. Source:
<a href="https://github.com/Mitranim/fpx/blob/master/lib/fpx.js" target="_blank">
`fpx.js` <span class="fa fa-github"></span>
</a>

Similar to `lodash`, but more lightweight and specialised. Differences:

* One small file (5 KB minified, compare with 67 KB in lodash 4.0)
* Richer functional programming utils
* Poorer data manipulation utils (complement this with <a href="https://github.com/Mitranim/emerge" target="_blank">Emerge <span class="fa fa-github"></span></a>)
* Emphasis on simplicity of source code
* Not a kitchen sink for everything

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
