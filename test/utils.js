'use strict'

const {inspect} = require('util')
const {deepEqual} = require('emerge')
const {slice} = Array.prototype

exports.test = test
function test (fun) {
  if (typeof fun !== 'function') {
    throw Error(`Expected a function, got: ${fun}`)
  }

  for (const {in: args, test: testArgs, out} of slice.call(arguments, 1)) {
    if (!Array.isArray(args)) {
      throw Error(`Expected \`in\` to be an array, got: ${args}`)
    }

    const result = fun(...args)

    if (testArgs) {
      test(result, ...testArgs)
    } else if (!deepEqual(result, out)) {
      throw Error(`Function:\n  ${blue(show(fun))}\n` +
                  `Arguments:\n  ${blue(show(args))}\n` +
                  `Expected:\n  ${blue(show(out))}\n` +
                  `Got:\n  ${red(show(result))}`)
    }
  }
}

const BLUE = '\x1b[34m'
const RED = '\x1b[31m'
const RESET = '\x1b[0m'

exports.blue = blue
function blue (msg) {
  return `${BLUE}${msg}${RESET}`
}

exports.red = red
function red (msg) {
  return `${RED}${msg}${RESET}`
}

function show (value) {
  return inspect(value, {depth: null})
}
