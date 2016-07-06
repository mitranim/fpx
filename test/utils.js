'use strict'

/**
 * Testing Microframework
 */

const {isFunction, inspect} = require('util')
const {deepEqual} = require('emerge')

// type Details = {args, predicate, meta, fun, error}
// type Context = [Details]
// type Report  = [[Context], Bool]
// type Test a  = a -> Report

exports.report = report
function report (ok, context) {
  return [ok ? [] : [context], !!ok]
}

// fnTest :: [Arg] -> Predicate -> Test (&a -> a)
exports.fnTest = fnTest
function fnTest (args, predicate) {
  const meta = getMeta({stackOffset: 1})

  return fun => {
    if (!isFunction(fun)) {
      return report(false, {
        error: `Expected a ${blue('function')}, got: ${red(show(fun))}`
      })
    }

    const value = fun(...args)
    const sub = runPredicate(predicate, value)
    const sup = report(sub[1], {error:
`Function   ${red(show(fun))} failed test ${blue(show(predicate))}
Arguments: ${blue(show(args))}
File:      ${formatMeta(meta)}`})

    return join(sup, sub)
  }
}

// tests :: &Test -> Test
exports.tests = tests
function tests (...tests) {
  return val => runWith(val, ...tests)
}

exports.runWith = runWith
function runWith (val, ...tests) {
  return tests.map(test => test(val)).reduce(join)
}

exports.runReports = runReports
function runReports (reports) {
  const [contexts, ok] = reports.reduce(join)
  if (!ok) {
    process.stderr.write(format(contexts))
    process.exitCode = 1
  }
}

// runPredicate :: Predicate -> Value -> Report
function runPredicate (predicate, value) {
  // Trust predicate to be a `Test`.
  if (isFunction(predicate)) return predicate(value)

  return report(
    deepEqual(predicate, value),
    {error:
`Expected: ${blue(show(predicate))}
Got:      ${red(show(value))}`}
  )
}

function join ([c0, v0], [c1, v1]) {
  return [appendC(c0, c1), appendV(v0, v1)]
}

function appendC (a, b) {
  return a.concat(b)
}

function appendV (a, b) {
  return a && b
}

exports.getMeta = getMeta
function getMeta ({stackOffset = 0} = {}) {
  const {stack} = Error()
  const lines = stack.split(/\n/g)
  const line = lines[lines.findIndex(x => /at getMeta /.test(x)) + stackOffset + 1]
  const [, name, filename, row, col] = line.match(/at (\S+).*?([^/(]+):(\d+):(\d+)/)
  return {name, filename, row, col}
}

function getError ({error}) {return error}

exports.format = format
function format (contexts) {
  return '\n' + contexts.map(getError).filter(Boolean).join('\n\n') + '\n\n'
}

exports.formatMeta = formatMeta
function formatMeta ({filename, row, col}) {
  return `${blue(filename)}, row ${blue(row)}, column ${blue(col)}`
}

const BLUE = '\x1b[34m'
const RED = '\x1b[31m'
const RESET = '\x1b[39m'

exports.blue = blue
function blue (msg) {
  return `${BLUE}${msg}${RESET}`
}

exports.red = red
function red (msg) {
  return `${RED}${msg}${RESET}`
}

exports.show = show
function show (value) {
  return inspect(value, {depth: null})
}
