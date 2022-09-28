// empty around comma

const test = require('tap').test
const CronExpression = require('cron-parser/lib/expression')

const options = {
  utc: true,
}

test('both empty around comma', function (t) {
  t.throws(function () {
    CronExpression.parse('*/10 * * * * ,', options)
  }, new Error('Invalid list value format'))
  t.end()
})

test('one side empty around comma', function (t) {
  t.throws(function () {
    CronExpression.parse('*/10 * * * * ,2', options)
  }, new Error('Invalid list value format'))
  t.end()
})
