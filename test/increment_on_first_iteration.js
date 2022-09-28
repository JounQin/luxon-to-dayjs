const util = require('node:util')

const sinon = require('sinon')
const test = require('tap').test
const CronExpression = require('cron-parser/lib/expression')

test('increment_on_first_itereation', function (t) {
  try {
    const clock = sinon.useFakeTimers()
    const fake_now = new Date('Tue Feb 21 2017 16:45:00')
    clock.tick(fake_now.getTime())
    const interval = CronExpression.parse('* * * * *')
    t.ok(interval, 'Interval parsed')
    const next = interval.next()
    t.ok(next, 'Found next scheduled interval')
    // Make sure next has incremented in 1 minute
    t.equal(fake_now.getTime() + 60_000, next.getTime())
    clock.restore()
    t.end()
  } catch (err) {
    t.error(err, 'Interval parse error')
  }
})
