/*
TODO: programmatically analyze results, auto-detect regressions.
*/

import 'https://cdn.jsdelivr.net/npm/@mitranim/test@0.1.2/emptty.mjs'
import * as t from 'https://cdn.jsdelivr.net/npm/@mitranim/test@0.1.2/test.mjs'
import * as l from 'https://cdn.jsdelivr.net/npm/lodash-es/lodash.js'
import * as f from '../fpx.mjs'

const cli = t.Args.os()
t.conf.benchFilterFrom(cli.get(`run`))
t.conf.verb = cli.bool(`v`)
t.conf.benchRep = t.ConsoleAvgReporter.with(t.tsNano)

/* Globals */

const size = 1024
const numList = makeNumList(size)
const dictList = makeDictList(numList)
const mapList = makeMapList(numList)
const numDict = makeNumDict(size)
const numSet = new Set(numList)
const numMap = makeNumMap(size)
const numArgs = function() {return arguments}(...numList)
const knownKeys = Object.keys(numList.slice(0, numList.length/2))
const numEntries = Object.entries(numDict)
const prom = Promise.resolve()

/* Bench */

// Indicates benchmark accuracy. Should be single digit nanoseconds.
t.bench(function bench_baseline() {})

deoptSeqHof(f.arr)
t.bench(function bench_arr_spread_native() {reqArr([...numArgs])})
t.bench(function bench_arr_gen_spread_native() {reqArr([...gen(numArgs)])})
t.bench(function bench_arr_f_arr_from_array_nums() {f.arr(numList)})
t.bench(function bench_arr_f_arr_from_array_dicts() {f.arr(dictList)})
t.bench(function bench_arr_f_arr_from_arguments() {f.arr(numArgs)})
t.bench(function bench_arr_f_arr_from_gen() {f.arr(gen(numArgs))})

deoptSeqHof(f.keys)
t.bench(function bench_keys_array_native_spread() {reqArr([...numList.keys()])})
t.bench(function bench_keys_array_native_f_arr() {f.arr(numList.keys())})
t.bench(function bench_keys_array_f_keys() {reqArr(f.keys(numList))})
t.bench(function bench_keys_array_lodash() {reqArr(l.keys(numList))})
t.bench(function bench_keys_dict_native() {reqArr(Object.keys(numDict))})
t.bench(function bench_keys_dict_by_for_in() {reqArr(structKeysByForIn(numDict))})
t.bench(function bench_keys_dict_f_keys() {reqArr(f.keys(numDict))})
t.bench(function bench_keys_dict_lodash() {reqArr(l.keys(numDict))})
t.bench(function bench_keys_set_native() {reqArr([...numSet.keys()])})
t.bench(function bench_keys_set_f_keys() {reqArr(f.keys(numSet))})
t.bench(function bench_keys_map_native() {reqArr([...numMap.keys()])})
t.bench(function bench_keys_map_f_keys() {reqArr(f.keys(numMap))})

deoptSeqHof(f.values)
t.bench(function bench_values_array_native() {f.arr(numList.values())})
t.bench(function bench_values_array_f_values() {reqArr(f.values(numList))})
t.bench(function bench_values_array_lodash() {reqArr(l.values(numList))})
t.bench(function bench_values_dict_native() {reqArr(Object.values(numDict))})
t.bench(function bench_values_dict_by_for_in() {reqArr(structValuesByForIn(numDict))})
t.bench(function bench_values_dict_by_key_list() {reqArr(structValuesByKeyList(numDict))})
t.bench(function bench_values_dict_f_values() {reqArr(f.values(numDict))})
t.bench(function bench_values_dict_lodash() {reqArr(l.values(numDict))})
t.bench(function bench_values_set_native() {f.arr(numSet.values())})
t.bench(function bench_values_set_specialized() {reqArr(valuesFromSetSpecialized(numSet))})
t.bench(function bench_values_set_f_values() {reqArr(f.values(numSet))})
t.bench(function bench_values_map_native() {f.arr(numMap.values())})
t.bench(function bench_values_map_specialized() {reqArr(valuesFromMapSpecialized(numMap))})
t.bench(function bench_values_map_f_values() {reqArr(f.values(numMap))})

t.bench(function bench_values_walk_array_as_is() {for (const val of numList) f.nop(val)})
t.bench(function bench_values_walk_array_values_native() {for (const val of numList.values()) f.nop(val)})
t.bench(function bench_values_walk_dict_by_for_in() {for (const key in numDict) f.nop(numDict[key])})
t.bench(function bench_values_walk_map_values_native() {for (const val of numMap.values()) f.nop(val)})

// Note: the behavior below is not entirely equivalent; lodash uses string keys.
deoptSeqHof(f.entries)
deoptSeqHof(l.entries)
t.bench(function bench_entries_array_native() {f.arr(numList.entries())})
t.bench(function bench_entries_array_f_entries() {reqArr(f.entries(numList))})
t.bench(function bench_entries_array_lodash() {reqArr(l.entries(numList))})
t.bench(function bench_entries_dict_native() {reqArr(Object.entries(numDict))})
t.bench(function bench_entries_dict_f_entries() {reqArr(f.entries(numDict))})
t.bench(function bench_entries_dict_dumb() {reqArr(structEntriesDumb(numDict))})
t.bench(function bench_entries_dict_lodash() {reqArr(l.entries(numDict))})
t.bench(function bench_entries_set_native() {f.arr(numSet.entries())})
t.bench(function bench_entries_set_f_entries() {reqArr(f.entries(numSet))})
t.bench(function bench_entries_map_native() {f.arr(numMap.entries())})
t.bench(function bench_entries_map_f_entries() {reqArr(f.entries(numMap))})

t.bench(function bench_entries_walk_array_inline() {
  let ind = -1
  while (++ind < numList.length) f.nop(ind, numList[ind])
})

t.bench(function bench_entries_walk_array_entries_native() {for (const [key, val] of numList.entries()) f.nop(key, val)})
t.bench(function bench_entries_walk_dict_by_for_in() {for (const key in numDict) f.nop(key, numDict[key])})
t.bench(function bench_entries_walk_map_entries_native() {for (const [key, val] of numMap.entries()) f.nop(key, val)})

// TODO deopt `f.slice` and `l.slice`.
t.bench(function bench_slice_array_native() {reqArr(numList.slice())})
t.bench(function bench_slice_array_f_slice() {reqArr(f.slice(numList))})
t.bench(function bench_slice_array_l_slice() {reqArr(l.slice(numList))})
t.bench(function bench_slice_set_native_spread() {reqArr([...numSet])})
t.bench(function bench_slice_set_f_slice() {reqArr(f.slice(numSet))})

t.bench(function bench_indexOf_ours() {reqNat(f.indexOf(numList, 701))})
t.bench(function bench_indexOf_lodash() {reqNat(l.indexOf(numList, 701))})
t.bench(function bench_indexOf_native() {reqNat(numList.indexOf(701))})
t.bench(function bench_includes_f_includes() {reqBool(f.includes(numList, 701))})
t.bench(function bench_includes_index_of() {reqBool(includesWithIndexOf(numList, 701))})
t.bench(function bench_includes_native() {reqBool(numList.includes(701))})
t.bench(function bench_includes_lodash() {reqBool(l.includes(numList, 701))})
t.bench(function bench_concat_array_ours() {reqArr(f.concat(numList, dictList))})
t.bench(function bench_concat_array_native() {reqArr(numList.concat(dictList))})
t.bench(function bench_concat_array_lodash() {reqArr(l.concat(numList, dictList))})
t.bench(function bench_concat_spread_arr() {reqArr(concatSpreadArr(numList, dictList))})
t.bench(function bench_concat_spread_values() {reqArr(concatSpreadValues(numList, dictList))})
t.bench(function bench_append() {reqArr(f.append(numList, 10))})
t.bench(function bench_append_spread_arr() {reqArr(appendSpreadArr(numList, 10))})
t.bench(function bench_append_spread_values() {reqArr(appendSpreadValues(numList, 10))})
t.bench(function bench_prepend() {reqArr(f.prepend(numList, 10))})
t.bench(function bench_prepend_spread_arr() {reqArr(prependSpreadArr(numList, 10))})
t.bench(function bench_prepend_spread_values() {reqArr(prependSpreadValues(numList, 10))})

deoptWith(fun => reqInt(numList.reduce(fun, 0)))
deoptWith(fun => reqInt(foldArrayDumb(numList, 0, fun)))
deoptWith(fun => reqInt(f.fold(numList, 0, fun)))
deoptWith(fun => reqInt(l.reduce(numList, fun, 0)))
deoptWith(fun => reqInt(foldForOfWithValues(numList, 0, fun)))
deoptWith(fun => reqInt(foldForOfNaive(numList, 0, fun)))
deoptWith(fun => reqInt(foldDictDumb(numDict, 0, fun)))
deoptWith(fun => reqInt(f.fold(numDict, 0, fun)))
deoptWith(fun => reqInt(l.reduce(numDict, fun, 0)))
t.bench(function bench_fold_array_native() {reqInt(numList.reduce(f.add, 0))})
t.bench(function bench_fold_array_dumb() {reqInt(foldArrayDumb(numList, 0, f.add))})
t.bench(function bench_fold_array_f_fold() {reqInt(f.fold(numList, 0, f.add))})
t.bench(function bench_fold_array_lodash() {reqInt(l.reduce(numList, f.add, 0))})
t.bench(function bench_fold_array_with_for_of_f_values() {reqInt(foldForOfWithValues(numList, 0, f.add))})
t.bench(function bench_fold_array_with_for_of_naive() {reqInt(foldForOfNaive(numList, 0, f.add))})
t.bench(function bench_fold_dict_dumb() {reqInt(foldDictDumb(numDict, 0, f.add))})
t.bench(function bench_fold_dict_f_fold() {reqInt(f.fold(numDict, 0, f.add))})
t.bench(function bench_fold_dict_lodash() {reqInt(l.reduce(numDict, f.add, 0))})

deoptNativeListHof(numList.find)
deoptCollHof(f.find)
deoptSeqHof(l.find)
deoptSeqHof(findForOfNaive)
t.bench(function bench_find_array_native() {reqInt(numList.find(val => val === 501))})
t.bench(function bench_find_array_f_find() {reqInt(f.find(numList, val => val === 501))})
t.bench(function bench_find_array_lodash() {reqInt(l.find(numList, val => val === 501))})
t.bench(function bench_find_array_for_of_naive() {reqInt(findForOfNaive(numList, val => val === 501))})

deoptNativeListHof(numList.map)
deoptSeqHof(mapDumb)
deoptListHof(mapWithMapMutSpecialized)
deoptListHof(mapWithMapMutShared)
deoptCollHof(f.map)
deoptSeqHof(l.map)
deoptDictHof(mapDictValuesSpecialized)
t.bench(function bench_map_array_native() {reqArr(numList.map(f.inc))})
t.bench(function bench_map_array_dumb() {reqArr(mapDumb(numList, f.inc))})
t.bench(function bench_map_array_map_mut_specialized() {reqArr(mapWithMapMutSpecialized(numList, f.inc))})
t.bench(function bench_map_array_map_mut_shared() {reqArr(mapWithMapMutShared(numList, f.inc))})
t.bench(function bench_map_array_f_map() {reqArr(f.map(numList, f.inc))})
t.bench(function bench_map_array_lodash() {reqArr(l.map(numList, f.inc))})
t.bench(function bench_map_dict_values_specialized() {reqArr(mapDictValuesSpecialized(numDict, f.inc))})
t.bench(function bench_map_dict_values_f_map() {reqArr(f.map(numDict, f.inc))})
t.bench(function bench_map_set_with_f_map() {reqArr(f.map(numSet, f.inc))})

deoptSeqHof(mapCompactDumb)
deoptSeqHof(f.mapCompact)
t.bench(function bench_mapCompact_dumb() {reqArr(mapCompactDumb(numList, f.id))})
t.bench(function bench_mapCompact_with_f_mapCompact() {reqArr(f.mapCompact(numList, f.id))})
t.bench(function bench_mapCompact_with_native_map_and_filter() {reqArr(numList.map(f.id).filter(f.id))})
t.bench(function bench_mapCompact_with_lodash_map_and_compact() {reqArr(l.compact(l.map(numList, f.id)))})
t.bench(function bench_mapCompact_with_lodash_chain() {reqArr(l.chain(numList).map(f.id).compact().value())})

deoptNativeListHof(numList.filter)
deoptSeqHof(genFilter)
deoptSeqHof(filterDumb)
deoptCollHof(f.filter)
deoptSeqHof(l.filter)
t.bench(function bench_filter_nums_native() {reqArr(numList.filter(f.id))})
t.bench(function bench_filter_nums_gen() {f.arr(genFilter(numList, f.id))})
t.bench(function bench_filter_nums_dumb() {reqArr(filterDumb(numList, f.id))})
t.bench(function bench_filter_nums_f_filter() {reqArr(f.filter(numList, f.id))})
t.bench(function bench_filter_nums_lodash() {reqArr(l.filter(numList, f.id))})

deoptSeqHof(genFilter)
t.bench(function bench_filter_dicts_with_gen() {
  f.arr(genFilter(dictList, val => val.val === 0))
})

deoptCollHof(f.filter)
t.bench(function bench_filter_dicts_with_f_filter() {
  reqArr(f.filter(dictList, val => val.val === 0))
})

deoptNativeListHof(dictList.filter)
t.bench(function bench_filter_dicts_with_native_filter() {
  reqArr(dictList.filter(val => val.val === 0))
})

deoptSeqHof(l.filter)
t.bench(function bench_filter_dicts_with_lodash_filter() {
  reqArr(l.filter(dictList, val => val.val === 0))
})

deoptSeqHof(genFilter)
t.bench(function bench_filter_maps_with_gen() {
  f.arr(genFilter(mapList, val => val.get(`val`) === 0))
})

deoptCollHof(f.filter)
t.bench(function bench_filter_maps_with_f_filter() {
  reqArr(f.filter(mapList, val => val.get(`val`) === 0))
})

deoptNativeListHof(mapList.filter)
t.bench(function bench_filter_maps_with_native_filter() {
  reqArr(mapList.filter(val => val.get(`val`) === 0))
})

deoptSeqHof(filterDumb)
t.bench(function bench_filter_maps_with_dumb_filter() {
  reqArr(filterDumb(mapList, val => val.get(`val`) === 0))
})

deoptSeqHof(l.filter)
t.bench(function bench_filter_maps_with_lodash_filter() {
  reqArr(l.filter(mapList, val => val.get(`val`) === 0))
})

t.bench(function bench_compact_dumb() {reqArr(compactDumb(numList))})
t.bench(function bench_compact_f_compact() {reqArr(f.compact(numList))})
t.bench(function bench_compact_f_filter() {reqArr(f.filter(numList, f.id))})
t.bench(function bench_compact_lodash_compact() {reqArr(l.compact(numList))})
t.bench(function bench_compact_native_filter() {reqArr(numList.filter(f.id))})

t.bench(function bench_map_and_fold_nums_with_gen() {
  reqInt(f.fold(genMap(numList, f.inc), 0, f.add))
})

t.bench(function bench_map_and_fold_nums_with_f_map() {
  reqInt(f.fold(f.map(numList, f.inc), 0, f.add))
})

t.bench(function bench_filter_and_map_and_fold_nums_with_f() {
  reqInt(f.fold(f.map(f.filter(numList, f.id), f.inc), 0, f.add))
})

t.bench(function bench_filter_and_map_and_fold_nums_with_native() {
  reqInt(numList.filter(f.id).map(f.inc).reduce(f.add, 0))
})

t.bench(function bench_filter_and_map_and_fold_nums_with_lodash_eager() {
  reqInt(l.reduce(l.map(l.filter(numList, f.id), f.inc), f.add, 0))
})

t.bench(function bench_filter_and_map_and_fold_nums_with_lodash_lazy() {
  reqInt(l.chain(numList).filter(f.id).map(f.inc).reduce(f.add, 0).value())
})

t.bench(function bench_array_from_simple_native() {reqArr(Array.from(numList))})
t.bench(function bench_array_from_simple_f() {reqArr(f.arrCopy(numList))})
t.bench(function bench_array_from_mapped_native() {reqArr(Array.from(numList, f.inc))})
t.bench(function bench_array_from_mapped_f() {reqArr(f.map(numList, f.inc))})

t.bench(function bench_array_fill_native() {reqArr(Array(size).fill(123))})
t.bench(function bench_array_fill_repeat() {reqArr(repeat(size, 123))})

deoptNativeListHof(numList.forEach)
deoptListHof(arrayEachDumb)
deoptCollHof(f.each)
deoptCollHof(l.each)
t.bench(function bench_each_array_forEach() {numList.forEach(f.nop)})
t.bench(function bench_each_array_f_each() {f.each(numList, f.nop)})
t.bench(function bench_each_array_dumb() {arrayEachDumb(numList, f.nop)})
t.bench(function bench_each_array_lodash_each() {l.each(numList, f.nop)})
t.bench(function bench_each_dict_inline() {for (const key in numDict) f.nop(key, numDict[key])})
t.bench(function bench_each_dict_f_each() {f.each(numDict, f.nop)})
t.bench(function bench_each_dict_lodash_each() {l.each(numDict, f.nop)})
t.bench(function bench_each_set_inline() {for (const val of numSet.values()) f.nop(val)})
t.bench(function bench_each_set_f_each() {f.each(numSet, f.nop)})
t.bench(function bench_each_map_inline() {for (const val of numMap.values()) f.nop(val)})
t.bench(function bench_each_map_f_each() {f.each(numMap, f.nop)})

t.bench(function bench_assign_Object_assign() {reqDict(Object.assign(Object.create(null), numDict))})
t.bench(function bench_assign_f_mut() {reqDict(f.mut(Object.create(null), numDict))})
t.bench(function bench_assign_lodash_assign() {reqDict(l.assign(Object.create(null), numDict))})

deoptDictHof(f.mapDict)
deoptDictHof(l.mapValues)
deoptDictHof(f.pick)
deoptDictHof(l.pickBy)
deoptDictHof(f.omit)
deoptDictHof(l.omitBy)
t.bench(function bench_map_dict_f_mapDict() {reqDict(f.mapDict(numDict, f.inc))})
t.bench(function bench_map_dict_lodash_mapValues() {reqDict(l.mapValues(numDict, f.inc))})
t.bench(function bench_pick_f_pick() {reqDict(f.pick(numDict, isEven))})
t.bench(function bench_pick_lodash_pickBy() {reqDict(l.pickBy(numDict, isEven))})
t.bench(function bench_omit_f_omit() {reqDict(f.omit(numDict, isEven))})
t.bench(function bench_omit_lodash_omitBy() {reqDict(l.omitBy(numDict, isEven))})

t.bench(function bench_pickKeys_f_pickKeys() {reqDict(f.pickKeys(numDict, knownKeys))})
t.bench(function bench_pickKeys_lodash_pick() {reqDict(l.pick(numDict, knownKeys))})
t.bench(function bench_omitKeys_f_omitKeys() {reqDict(f.omitKeys(numDict, knownKeys))})
t.bench(function bench_omitKeys_lodash_omit() {reqDict(l.omit(numDict, knownKeys))})

deoptCollHof(f.index)
deoptSeqHof(l.keyBy)
deoptCollHof(f.group)
deoptSeqHof(l.groupBy)
t.bench(function bench_index_with_f_index() {reqDict(f.index(numList, f.id))})
t.bench(function bench_index_with_l_keyBy() {reqDict(l.keyBy(numList, f.id))})
t.bench(function bench_group_with_f_group() {reqDict(f.group(numList, f.id))})
t.bench(function bench_group_with_l_groupBy() {reqDict(l.groupBy(numList, f.id))})

t.bench(function bench_long_transform0_with_f_eager() {
  reqArr(f.compact(f.map(f.map(f.map(numList, f.inc), f.dec), double)))
})

t.bench(function bench_long_transform0_with_native() {
  reqArr(numList.map(f.inc).map(f.dec).map(double).filter(f.id))
})

t.bench(function bench_long_transform0_with_lodash_eager() {
  reqArr(l.compact(l.map(l.map(l.map(numList, f.inc), f.dec), double)))
})

t.bench(function bench_long_transform0_with_lodash_chain() {
  reqArr(l.chain(numList).map(f.inc).map(f.dec).map(double).compact().value())
})

t.bench(function bench_long_transform1_with_f_eager() {
  reqArr(f.map(f.filter(f.entries(f.map(f.compact(f.map(numList, double)), String)), isEntryKeyEven), entryVal))
})

t.bench(function bench_long_transform1_with_native() {
  reqArr(numList.map(double).filter(f.id).map(String).filter(isKeyEven))
})

t.bench(function bench_long_transform1_with_lodash_eager() {
  reqArr(l.filter(l.map(l.compact(l.map(numList, double)), String), isKeyEven))
})

t.bench(function bench_long_transform1_with_lodash_chain() {
  reqArr(l.chain(numList).map(double).compact().map(String).filter(isKeyEven).value())
})

t.bench(function bench_isInst_checked() {
  f.nop(isInstChecked(prom, Promise))
  f.nop(isInstChecked(prom, Array))
  f.nop(isInstChecked(undefined, Promise))
  f.nop(isInstChecked(undefined, Array))
})

t.bench(function bench_isInst_unchecked() {
  f.nop(isInstUnchecked(prom, Promise))
  f.nop(isInstUnchecked(prom, Array))
  f.nop(isInstUnchecked(undefined, Promise))
  f.nop(isInstUnchecked(undefined, Array))
})

t.bench(function bench_isInst_inline() {
  f.nop(prom instanceof Promise)
  f.nop(prom instanceof Array)
  f.nop(undefined instanceof Promise)
  f.nop(undefined instanceof Array)
})

// Seems slow.
t.bench(function bench_isPromise_with_f() {
  f.nop(f.isPromise(prom))
  f.nop(f.isPromise(numList))
  f.nop(f.isPromise())
})

t.bench(function bench_isPromise_dumb() {
  f.nop(isPromiseDumb(prom))
  f.nop(isPromiseDumb(numList))
  f.nop(isPromiseDumb())
})

t.bench(function bench_isArr_miss() {f.nop(f.isArr(prom))})
t.bench(function bench_isArr_hit() {f.nop(f.isArr(numList))})
t.bench(function bench_isArr_inline() {f.nop(numList instanceof Array)})
t.bench(function bench_isArr_Array_isArray() {f.nop(Array.isArray(numList))})

t.bench(function bench_isList_miss() {f.nop(f.isList(prom))})
t.bench(function bench_isList_hit() {f.nop(f.isList(numList))})

t.bench(function bench_count_loop_inline_asc() {
  let ind = -1
  while (++ind <= size) f.nop(ind)
})

t.bench(function bench_count_loop_inline_desc() {
  let rem = size
  while (--rem > 0) f.nop(rem)
})

t.bench(function bench_count_loop_span_gen() {for (const val of genSpan(size)) f.nop(val)})
t.bench(function bench_count_loop_span_dumb() {for (const val of spanDumb(size)) f.nop(val)})
t.bench(function bench_count_loop_span_f_span() {for (const val of f.span(size)) f.nop(val)})

t.bench(function bench_zip_with_f() {reqDict(f.zip(numEntries))})
t.bench(function bench_zip_with_native() {reqDict(Object.fromEntries(numEntries))})

const emptyDict = {}
const emptyArr = []
const emptyGen = gen()
t.bench(function bench_show_dict() {reqStr(f.show(emptyDict))})
t.bench(function bench_show_arr() {reqStr(f.show(emptyArr))})
t.bench(function bench_show_gen() {reqStr(f.show(emptyGen))})
t.bench(function bench_show_prom() {reqStr(f.show(prom))})
t.bench(function bench_show_prim() {reqStr(f.show(10))})
t.bench(function bench_show_fun() {reqStr(f.show(nop))})

t.deopt()
t.benches()

/* Util */

function* gen(iter) {if (iter) for (const val of iter) yield val}

function makeNumList(len) {
  const out = Array(len)
  for (let i = 0; i < out.length; i++) out[i] = (i % 2) * i
  return out
}

function makeDictList(vals) {
  const out = Array(vals.length)
  for (let i = 0; i < vals.length; i++) out[i] = {val: vals[i]}
  return out
}

function makeMapList(vals) {
  const out = Array(vals.length)
  for (let i = 0; i < vals.length; i++) out[i] = new Map().set(`val`, vals[i])
  return out
}

function makeNumDict(len) {
  const out = Object.create(null)
  for (let i = 0; i < len; i++) out[i] = (i % 2) * i
  return out
}

function makeNumMap(len) {
  const out = new Map()
  for (let i = 0; i < len; i++) out.set(i, (i % 2) * i)
  return out
}

function foldArrayDumb(val, acc, fun) {
  for (let i = 0; i < val.length; i++) acc = fun(acc, val[i])
  return acc
}

function foldDictDumb(val, acc, fun) {
  for (const key in val) acc = fun(acc, val[key])
  return acc
}

function foldForOfWithValues(val, acc, fun) {
  for (const elem of f.values(val)) acc = fun(acc, elem)
  return acc
}

function foldForOfNaive(val, acc, fun) {
  for (const elem of val) acc = fun(acc, elem)
  return acc
}

function findForOfNaive(val, fun) {
  for (const elem of val) if (fun(elem)) return elem
  return undefined
}

function mapCompactDumb(val, fun) {
  val = f.arr(val)
  f.req(fun, f.isFun)

  const out = []
  let ind = -1
  while (++ind < val.length) {
    const elem = fun(val[ind])
    if (elem) out.push(elem)
  }
  return out
}

function* genFilter(vals, fun, ...args) {
  f.req(fun, f.isFun)
  for (const val of f.values(vals)) if (fun(val, ...args)) yield val
}

function* genMap(vals, fun, ...args) {
  f.req(fun, f.isFun)
  for (const val of f.values(vals)) yield fun(val, ...args)
}

function* genSpan(size) {
  f.req(size, f.isNat)
  let i = -1
  while (++i < size) yield i
}

function filterDumb(val, fun) {
  val = f.arr(val)
  f.req(fun, f.isFun)
  const out = []
  for (let i = 0; i < val.length; i++) {
    const elem = val[i]
    if (fun(elem)) out.push(elem)
  }
  return out
}

function mapDumb(val, fun) {
  val = f.slice(val)
  f.req(fun, f.isFun)
  for (let i = 0; i < val.length; i++) val[i] = fun(val[i])
  return val
}

function mapWithMapMutSpecialized(val, fun) {
  return mapMutSpecialized(val.slice(), fun)
}

function mapWithMapMutShared(val, fun) {
  return f.mapMut(f.slice(val), fun)
}

function mapMutSpecialized(val, fun) {
  f.req(val, f.isList)
  f.req(fun, f.isFun)
  for (let i = 0; i < val.length; i++) val[i] = fun(val[i])
  return val
}

function mapDictValuesSpecialized(val, fun) {
  f.req(val, f.isDict)
  f.req(fun, f.isFun)
  const buf = Object.keys(val)
  for (let i = 0; i < buf.length; i++) buf[i] = fun(val[buf[i]])
  return buf
}

function compactDumb(val) {
  f.req(val, f.isList)
  const out = []
  let ind = -1
  while (++ind < val.length) {
    const elem = val[ind]
    if (elem) out.push(elem)
  }
  return out
}

function includesWithIndexOf(val, elem) {return f.indexOf(val, elem) >= 0}

function structKeysByForIn(src) {
  const out = []
  for (const key in src) out.push(key)
  return out
}

function structValuesByKeyList(src) {
  const buf = Object.keys(src)
  for (let i = 0; i < buf.length; i++) buf[i] = src[buf[i]]
  return buf
}

function structValuesByForIn(src) {
  const out = []
  for (const key in src) out.push(src[key])
  return out
}

function structEntriesDumb(src) {
  const buf = Object.keys(src)
  for (let i = 0; i < buf.length; i++) {
    const key = buf[i]
    buf[i] = [key, src[key]]
  }
  return buf
}

function spanDumb(size) {
  f.req(size, f.isNat)
  const out = Array(size)
  for (let i = 0; i < out.length; i++) out[i] = i
  return out
}

function arrayEachDumb(src, fun) {
  f.req(src, f.isList)
  for (let i = 0; i < src.length; i++) fun(src[i])
}

function concatSpreadArr (one, two) {return [...f.arr(one), ...f.arr(two)]}
function concatSpreadValues (one, two) {return [...f.values(one), ...f.values(two)]}
function appendSpreadArr (val, elem) {return [...f.arr(val), elem]}
function appendSpreadValues (val, elem) {return [...f.values(val), elem]}
function prependSpreadArr (val, elem) {return [elem, ...f.arr(val)]}
function prependSpreadValues (val, elem) {return [elem, ...f.values(val)]}

function isEven(val) {return !(val % 2)}
function isKeyEven(_, key) {return !(key % 2)}
function isEntryKeyEven(val) {return !(val[0] % 2)}
function entryVal(val) {return val[1]}
function double(val) {return val * 2}
function isInstChecked(val, cls) {return val != null && typeof val === `object` && val instanceof cls}
function isInstUnchecked(val, cls) {return val instanceof cls}
function nop() {}
function reqArr(val) {return f.req(val, f.isArr)}
function reqStr(val) {return f.req(val, f.isStr)}
function reqDict(val) {return f.req(val, f.isDict)}
function reqNat(val) {return f.req(val, f.isNat)}
function reqInt(val) {return f.req(val, f.isInt)}
function reqBool(val) {return f.req(val, f.isBool)}

function isPromiseDumb(val) {
  return (
    val != null &&
    typeof val === `object` &&
    `then` in val &&
    typeof val.then === `function`
  )
}

function valuesFromSetSpecialized(src) {
  f.reqInst(src, Set)
  const out = Array(src.size)
  let ind = -1
  for (const val of src.values()) out[++ind] = val
  return out
}

function valuesFromMapSpecialized(src) {
  f.reqInst(src, Map)
  const out = Array(src.size)
  let ind = -1
  for (const val of src.values()) out[++ind] = val
  return out
}

function repeat(len, val) {
  const buf = f.alloc(len)
  let ind = -1
  while (++ind < buf.length) buf[ind] = val
  return buf
}

function deoptDictHof(fun) {
  f.reify(fun(numDict, f.nop))
  f.reify(fun(numDict, nop))
  f.reify(fun({}, f.nop))
  f.reify(fun({}, nop))
}

function deoptListHof(fun) {
  f.reify(fun(numList, f.nop))
  f.reify(fun(numList, nop))
}

function deoptSeqHof(fun) {
  deoptListHof(fun)
  f.reify(fun(numList.values(), f.nop))
  f.reify(fun(numList.values(), nop))
  f.reify(fun(numList.keys(), f.nop))
  f.reify(fun(numList.keys(), nop))
  f.reify(fun(gen(), f.nop))
  f.reify(fun(gen(), nop))
}

function deoptCollHof(fun) {
  deoptSeqHof(fun)
  f.reify(fun(numDict, f.nop))
  f.reify(fun(numDict, nop))
  f.reify(fun(numMap, f.nop))
  f.reify(fun(numMap, nop))
  f.reify(fun(numMap.values(), f.nop))
  f.reify(fun(numMap.values(), nop))
  f.reify(fun(numMap.keys(), f.nop))
  f.reify(fun(numMap.keys(), nop))
  f.reify(fun(numMap.entries(), f.nop))
  f.reify(fun(numMap.entries(), nop))
}

function deoptNativeListHof(fun) {
  fun.call(numList, f.nop)
  fun.call(numList, nop)
  fun.call(dictList, f.nop)
  fun.call(dictList, nop)
  fun.call(knownKeys, f.nop)
  fun.call(knownKeys, nop)
}

function deoptWith(fun) {
  f.reify(fun(f.add))
  f.reify(fun(f.sub))
}
