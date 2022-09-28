const test = require('tap').test
const CronParser = require('cron-parser/lib/parser')

test('parse cron with last day in a month', function (t) {
  const options = {
    currentDate: new Date(2014, 0, 1),
    endDate: new Date(2014, 10, 1),
  }

  try {
    const interval = CronParser.parseExpression('0 0 L * *', options)
    t.equal(interval.hasNext(), true)

    for (let i = 0; i < 10; ++i) {
      const next = interval.next()
      t.ok(next, 'has a date')
    }
  } catch (err) {
    t.error(err, 'Parse read error')
  }

  t.end()
})

test('parse cron with last day in feb', function (t) {
  const options = {
    currentDate: new Date(2016, 0, 1),
    endDate: new Date(2016, 10, 1),
  }

  try {
    const interval = CronParser.parseExpression('0 0 6-20/2,L 2 *', options)
    t.equal(interval.hasNext(), true)
    let next = null
    const items = 9
    let i = 0
    while (interval.hasNext()) {
      next = interval.next()
      i += 1
      t.ok(next, 'has a date')
    }
    // leap year
    t.equal(next.getDate(), 29)
    t.equal(i, items)
  } catch (err) {
    t.error(err, 'Parse read error')
  }

  t.end()
})

test('parse cron with last day in feb', function (t) {
  const options = {
    currentDate: new Date(2014, 0, 1),
    endDate: new Date(2014, 10, 1),
  }

  try {
    const interval = CronParser.parseExpression('0 0 1,3,6-10,L 2 *', options)
    t.equal(interval.hasNext(), true)
    let next = null
    while (interval.hasNext()) {
      next = interval.next()
      t.ok(next, 'has a date')
    }
    // common year
    t.equal(next.getDate(), 28)
  } catch (err) {
    t.error(err, 'Parse read error')
  }

  t.end()
})

test('parse cron with last weekday of the month', function (t) {
  const options = {
    currentDate: new Date(2021, 8, 1),
    endDate: new Date(2021, 11, 1),
  }

  const testCases = [
    { expression: '0 0 0 * * 1L', expectedDate: 27 },
    { expression: '0 0 0 * * 2L', expectedDate: 28 },
    { expression: '0 0 0 * * 3L', expectedDate: 29 },
    { expression: '0 0 0 * * 4L', expectedDate: 30 },
    { expression: '0 0 0 * * 5L', expectedDate: 24 },
    { expression: '0 0 0 * * 6L', expectedDate: 25 },
    { expression: '0 0 0 * * 0L', expectedDate: 26 },
    { expression: '0 0 0 * * 7L', expectedDate: 26 },
  ]

  for (const { expression, expectedDate } of testCases) {
    t.test(expression, function (t) {
      try {
        const interval = CronParser.parseExpression(expression, options)

        t.equal(interval.hasNext(), true)

        const next = interval.next()

        t.equal(next.getDate(), expectedDate)
      } catch (err) {
        t.error(err, 'Parse read error')
      }

      t.end()
    })
  }

  t.end()
})

test('parses expression that runs on both last monday and friday of the month', function (t) {
  const options = {
    currentDate: new Date(2021, 8, 1),
    endDate: new Date(2021, 11, 1),
  }

  try {
    const interval = CronParser.parseExpression('0 0 0 * * 1L,5L', options)

    t.equal(interval.next().getDate(), 24)
    t.equal(interval.next().getDate(), 27)
  } catch (err) {
    t.error(err, 'Parse read error')
  }

  t.end()
})

test('parses expression that runs on both every monday and last friday of mont', function (t) {
  const options = {
    currentDate: new Date(2021, 8, 1),
    endDate: new Date(2021, 8, 30),
  }

  try {
    const interval = CronParser.parseExpression('0 0 0 * * 1,5L', options)

    const dates = []

    while (true) {
      try {
        dates.push(interval.next().getDate())
      } catch (e) {
        if (e.message !== 'Out of the timespan range') {
          throw e
        }

        break
      }
    }

    t.same(dates, [6, 13, 20, 24, 27])
  } catch (err) {
    t.error(err, 'Parse read error')
  }

  t.end()
})

test('fails to parse for invalid last weekday of month expression', function (t) {
  t.throws(function () {
    const interval = CronParser.parseExpression('0 0 0 * * L')
    interval.next()
  })

  t.end()
})
