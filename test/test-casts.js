'use strict'

const {eq, is} = require('./utils')
const f = require('../dist/fpx')

function args() {return arguments}

eq(f.onlyString(), '')
eq(f.onlyString(10), '')
eq(f.onlyString('blah'), 'blah')
eq(f.onlyString(true), '')
eq(f.onlyString({}), '')

eq(f.onlyList(), [])
eq(f.onlyList({one: 10}), [])
eq(f.onlyList('blah'), [])
{
  const input = [10, 20, 30]
  is(f.onlyList(input), input)
}
{
  const input = args(10, 20, 30)
  is(f.onlyList(input), input)
}

eq(f.onlyDict(), {})
eq(f.onlyDict([10]), {})
eq(f.onlyDict({one: 10}), {one: 10})
{
  const input = {one: 10}
  is(f.onlyDict(input), input)
}
eq(f.onlyDict(Object.create(null)), {})
eq(f.onlyDict(Object.create({one: 1})), {})

eq(f.toArray(), [])
eq(f.toArray({one: 10}), [])
eq(f.toArray('blah'), [])
{
  const input = [10, 20, 30]
  is(f.toArray(input), input)
}
// Converts args to array
eq(f.toArray(args(10, 20, 30)), [10, 20, 30])
