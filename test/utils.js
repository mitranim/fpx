'use strict'

const {AssertionError} = require('assert')
const {equal} = require('emerge')

exports.eq = eq
function eq(actual, expected) {
  if (!equal(actual, expected)) {
    throw new AssertionError({
      actual,
      expected,
      operator: `equals`, stackStartFunction: eq,
    })
  }
}
