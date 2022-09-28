// empty around comma

const test = require('tap').test

const CronDate = require('../lib/date')

test('is the last weekday of the month', function (t) {
  // Last monday of september
  var date = new CronDate(new Date(2021, 8, 27))
  t.equal(date.isLastWeekdayOfMonth(), true)

  // Second-to-last monday of september
  var date = new CronDate(new Date(2021, 8, 20))
  t.equal(date.isLastWeekdayOfMonth(), false)

  t.end()
})
