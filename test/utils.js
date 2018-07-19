'use strict'

const {AssertionError} = require('assert')
const {equal} = require('emerge')

exports.eq = eq
function eq(actual, expected) {
  if (!equal(actual, expected)) {
    throw new AssertionError({
      actual,
      expected,
      operator: `equal`,
      stackStartFunction: eq,
    })
  }
}

exports.is = is
function is(actual, expected) {
  if (!Object.is(actual, expected)) {
    throw new AssertionError({
      actual,
      expected,
      operator: `Object.is`,
      stackStartFunction: is,
    })
  }
}

exports.throws = throws
function throws(fun, ...args) {
  if (typeof fun !== 'function') {
    throw Error(`Expected a function, got ${fun}`)
  }

  try {
    fun(...args)
  }
  catch (_err) {
    return
  }

  throw Error(`Expected function "${fun.name || fun}" to throw`)
}
