const util = require('node:util')

const test = require('tap').test
const expression = require('cron-parser/lib/expression')

test('leap year', function (t) {
  try {
    const interval = expression.parse('0 0 29 2 *')
    let i
    let d
    for (i = 0; i < 20; ++i) {
      d = interval.next()
    }
    t.end()
  } catch (err) {
    t.error(err, 'Interval parse error')
  }
})
