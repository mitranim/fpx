import 'https://cdn.jsdelivr.net/npm/@mitranim/test@0.1.2/emptty.mjs'
import * as f from '../fpx.mjs'
import * as d from './doc.mjs'

const setOld = new Set([`global`, `truthy`, `falsy`, `is`, `isNil`, `isSome`, `isBool`, `isNum`, `isFin`, `isInt`, `isNat`, `isNatPos`, `isNaN`, `isInf`, `isStr`, `isKey`, `isPrim`, `isComp`, `isFun`, `isObj`, `isStruct`, `isArr`, `isReg`, `isSym`, `isDate`, `isValidDate`, `isInvalidDate`, `isPromise`, `isCls`, `isInst`, `isDict`, `isList`, `isIter`, `isOpt`, `isListOf`, `isDictOf`, `hasOwn`, `testBy`, `test`, `prim`, `bool`, `num`, `fin`, `int`, `nat`, `natPos`, `str`, `list`, `arr`, `dict`, `struct`, `comp`, `toStr`, `toArr`, `req`, `opt`, `reqInst`, `optInst`, `reqEach`, `reqEachVal`, `call`, `apply`, `bind`, `not`, `cwk`, `len`, `hasLen`, `vacate`, `each`, `map`, `mapMut`, `mapFlat`, `mapFlatDeep`, `mapFilter`, `filter`, `reject`, `fold`, `foldRight`, `fold1`, `compact`, `find`, `findRight`, `findIndex`, `findIndexRight`, `indexOf`, `lastIndexOf`, `includes`, `procure`, `every`, `some`, `slice`, `append`, `prepend`, `remove`, `adjoin`, `toggle`, `insertAt`, `replaceAt`, `removeAt`, `concat`, `flat`, `flatDeep`, `head`, `tail`, `init`, `last`, `take`, `takeWhile`, `drop`, `dropWhile`, `count`, `countWhile`, `times`, `reverse`, `sort`, `sortBy`, `sortCompare`, `intersect`, `keyBy`, `groupBy`, `uniq`, `uniqBy`, `partition`, `sum`, `sumBy`, `min`, `max`, `minBy`, `maxBy`, `findMinBy`, `findMaxBy`, `range`, `zip`, `size`, `keys`, `vals`, `entries`, `hasSize`, `eachVal`, `foldVals`, `mapVals`, `mapValsMut`, `mapKeys`, `mapValsSort`, `pick`, `omit`, `pickKeys`, `omitKeys`, `findVal`, `findKey`, `everyVal`, `someVal`, `invert`, `invertBy`, `neg`, `add`, `sub`, `mul`, `div`, `rem`, `lt`, `gt`, `lte`, `gte`, `inc`, `dec`, `nop`, `True`, `False`, `vac`, `id`, `di`, `val`, `rethrow`, `get`, `scan`, `getIn`, `getter`, `assign`, `show`])
const setNew = new Set(f.map(d.dat.exp, val => val.name))

function main() {
  const removed = setSub(setOld, setNew)
  const added = setSub(setNew, setOld)

  for (const val of removed) console.log(`-`, val)
  for (const val of added) console.log(`+`, val)
}

function setSub(src, sub) {
  const out = new Set(f.values(src))
  for (const elem of f.values(sub)) out.delete(elem)
  return out
}

if (import.meta.main) main()
