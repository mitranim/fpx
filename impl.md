# Implementation notes


## Structure

Fpx exports plain, statically defined functions. There's no module-level initialization. Because of this, Fpx is compatible with tree shaking / dead code elimination / live code inclusion, and has no impact on application startup time.

Fpx is written as a single file, which is great for performance and overall size. Its modularity comes from ES2015 exports, which allow a bundler to tree-shake/DCE/LCI it. At the moment of writing, this tends to not work in real application bundles; in the meantime, Fpx is also WAY smaller than, say, Lodash, so you can include it without much guilt.


## Size

I care A LOT about code size, both human-readable and minified. Fpx is a balance of size vs performance because size leads to performance.

In a browser, you don't want to deploy 10 MiB of well-written, specialized, monomorphic code designed to get the most out of a JIT. You want to deploy 10-100 KiB of okay code, because it will be faster in the end.

In Node, the "lockfile" trend has led to the explosion of redundant dependencies, dramatically increasing the total amount of code your application has to load. Again, size matters here. Fpx impacts Node startup time way less than, say, Lodash. Well, maybe it wasn't the lockfiles, just a culture problem. I don't know.

While Fpx has a LOT of functions, each individual function attempts to be as small as reasonably possible while being as fast as reasonably possible, balancing the two requirements.


## Performance observations

Iteration tends to be cheaper than allocation.

In my experience, in a HOF such as `each`, defining the argument function statically and passing additional arguments through the HOF tends to be way cheaper than allocating a local closure to hold those arguments. Closures may be optimized away in microbenchmarks, but we shouldn't count on that.

HOF/FCF indirection may cause significant deoptimization and should be internally avoided where possible without significant code bloat. We have to balance performance and code size on this front.

Example of HOF/FCF deoptimization in V8. In an iteration function like `groupBy`, we branch on `isList` into `each` or `eachVal`. Branching into direct calls rather than assigning `each` or `eachVal` to a shared variable and calling it appears to run slightly faster, but costs us 18 bytes in the minified version. I'm not sure if it's actually faster in real code rather than microbenchmarks.

In modern JS engines, `.apply(nil, arguments)` is often said to be "special" and equivalent to directly calling the function with the arguments. There are cases where this doesn't hold, at least in V8. Fpx has a few functions, such as `flatMap` or `mapFilter`, where using `.apply` is significantly slower than passing arguments directly.
