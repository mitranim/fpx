# Implementation notes

## Structure

Fpx is a single file that exports plain, statically defined functions, with no module-level initialization. Because of this, Fpx is compatible with tree shaking / dead code elimination / live code inclusion, and has practically no impact on application startup time. Fpx is WAY smaller than Lodash, so you're not impacting your users nearly as much.

## Size

I care A LOT about code size, both human-readable and minified. Fpx is a balance of size vs performance.

In a browser, you don't want to deploy 10 MiB of well-written, specialized, monomorphic code designed to get the most out of a JIT. You want to deploy 10-100 KiB of okay code, because it will be faster in the end.

NPM has led to the explosion of redundant dependencies, dramatically increasing the total amount of code your application has to load. Again, size matters here. Fpx impacts Node startup time way less than, say, Lodash.

While Fpx has a LOT of functions, each individual function attempts to be as small as reasonably possible while being as fast as reasonably possible, balancing the two requirements.

## Performance observations

Iteration tends to be cheaper than allocation.

In my testing (done a while ago), in a HOF such as `each`, defining the argument function statically and passing additional arguments through the HOF tends to be way cheaper than allocating a local closure to hold those arguments. Closures may be optimized away in microbenchmarks, but we shouldn't count on that.

HOF/FCF indirection may cause significant deoptimization and should be internally avoided where possible without significant code bloat. We have to balance performance and code size on this front.

Example of HOF/FCF deoptimization in V8. In an iteration function like `groupBy`, we branch on `isList` into `each` or `eachVal`. Branching into direct calls rather than assigning `each` or `eachVal` to a shared variable and calling it appears to run slightly faster, but costs us 18 bytes in the minified version. I'm not sure if it's actually faster in real code rather than microbenchmarks.

## `flat` / `flatDeep`

Could be made more efficient for very large and deep lists by precalculating the length and allocating the result all at once. Unfortunately this requires quite a bit of extra code and would be slower for relatively small lists. It would also be faster to use native array concat, but it requires spread, subject to the implementation-defined argument size limit.

## `mapKeys`

There's no corresponding `mapKeysMut`. The point of in-place mapping is efficiency. In this case, the possibility of key collisions would require an additional temporary structure for book-keeping, negating any possible gains.

## `for .. of`

While normally `for .. of` is horribly inefficient, V8 seems able to perform it efficiently over `...args` in local scope, possibly because the type is guaranteed to be an array, and we wouldn't modify it during iteration. We still avoid it though.
