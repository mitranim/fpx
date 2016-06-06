## Overview

`fpx` — **f**unctional **p**rogramming **e**xtensions for JavaScript. Source:
<a href="https://github.com/Mitranim/fpx/blob/master/lib/fpx.js" target="_blank">
`fpx.js` <span class="fa fa-github"></span>
</a>

Similar to `lodash`, but more lightweight and specialised. Differences:

* One small file (5 KB minified, compare with 67 KB in lodash 4.0)
* Richer functional programming utils
* Poorer data manipulation utils (complement this with <a href="https://github.com/Mitranim/emerge" target="_blank">Emerge</a>)
* Emphasis on simplicity of source code
* Not a kitchen sink for everything

All examples on this page imply an import:

```js
const {someFunction} = require('fpx')
```

## TOC

* [Fun](#fun)
* [Bool](#bool)
* [List](#list)
* [Object](#object)
* [Misc](#misc)

{{include('partials/fun.md')}}
{{include('partials/bool.md')}}
{{include('partials/list.md')}}
{{include('partials/object.md')}}
{{include('partials/misc.md')}}
