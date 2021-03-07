import {AssertionError} from 'assert'
import {equal} from 'emerge'

export function eq(actual, expected) {
  if (!equal(actual, expected)) {
    throw new AssertionError({
      actual,
      expected,
      operator: `equal`,
      stackStartFunction: eq,
    })
  }
}

export function is(actual, expected) {
  if (!Object.is(actual, expected)) {
    throw new AssertionError({
      actual,
      expected,
      operator: `Object.is`,
      stackStartFunction: is,
    })
  }
}

export function throws(fun, ...args) {
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
