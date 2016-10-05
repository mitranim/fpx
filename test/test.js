'use strict'

const {runReports} = require('./utils')

runReports([
  ...require('./test-bool'),
  ...require('./test-coll'),
  ...require('./test-dict'),
  ...require('./test-fun'),
  ...require('./test-list'),
  ...require('./test-misc'),
  ...require('./test-ops')
])
