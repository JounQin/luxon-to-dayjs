const luxon = require('luxon')
const test = require('tap').test

const CronDate = require('../lib/date')

test('parse cron date formats with local timezone', t => {
  // Some tests need the local offset to be compatible without invoking timezone management.
  // Local offset is dependent on what the system being tested on is
  const offset = new Date().getTimezoneOffset()
  const offsetHours = Math.abs(Math.floor(offset / 60))
  const offsetMinutes = offset % 60
  const offsetSign = offset < 0 ? '-' : '+'

  const expectedTime = new Date(2021, 0, 4, 10, 0, 0).toString()

  test('undefined date', t => {
    const realDate = new Date()
    const d = new CronDate()

    t.equal(d.toDate().toString(), realDate.toString())

    t.end()
  })

  test('JS Date', t => {
    const d = new CronDate(new Date(2021, 0, 4, 10, 0, 0))
    t.equal(d.toDate().toString(), expectedTime)

    t.end()
  })

  test('ISO 8601', t => {
    const d = new CronDate('2021-01-04T10:00:00')
    t.equal(d.toDate().toString(), expectedTime)

    t.end()
  })

  test('ISO 8601 date', t => {
    const d = new CronDate('2021-01-04')
    const expectedTime = new Date(2021, 0, 4, 0, 0, 0).toString()

    t.equal(d.toDate().toString(), expectedTime)

    t.end()
  })

  test('RFC2822', t => {
    const offsetString =
      offsetSign +
      String(offsetHours).padStart(2, 0) +
      String(offsetMinutes).padStart(2, 0)

    const d = new CronDate('Mon, 4 Jan 2021 10:00:00 ' + offsetString)
    t.equal(d.toDate().toString(), expectedTime)

    t.end()
  })

  test('RFC2822-like without timezone offset', t => {
    const d = new CronDate('Mon, 4 Jan 2021 10:00:00')
    t.equal(d.toDate().toString(), expectedTime)

    t.end()
  })

  test('SQL', t => {
    const d = new CronDate('2021-01-04 10:00:00')
    t.equal(d.toDate().toString(), expectedTime)

    t.end()
  })

  test('milliseconds', t => {
    const d = new CronDate(new Date('2021-01-04 10:00:00').valueOf())
    t.equal(d.toDate().toString(), expectedTime)

    t.end()
  })

  test('CronDate', t => {
    const date = new CronDate('Mon, 4 Jan 2021 10:00:00')
    const d = new CronDate(date)
    t.equal(d.toDate().toString(), expectedTime)

    t.end()
  })

  test('invalid', t => {
    t.throws(() => {
      const d = new CronDate('some invalid string')
    })

    t.end()
  })

  t.end()
})

test('parse cron date formats with another timezone', t => {
  test('ISO 8601 without offset', t => {
    // implies format already in timezone
    const d = new CronDate('2021-01-04T10:00:00', 'Europe/Athens')
    t.equal(d.toISOString(), '2021-01-04T08:00:00.000Z')

    t.end()
  })

  test('ISO 8601 with non-local offset', t => {
    const d = new CronDate('2021-01-04T10:00:00+01:00', 'Europe/Athens')
    t.equal(d.toISOString(), '2021-01-04T09:00:00.000Z')

    t.end()
  })

  test('RFC2822 with non-local offset', t => {
    const d = new CronDate('Mon, 4 Jan 2021 10:00:00 +0100', 'Europe/Athens')
    t.equal(d.toISOString(), '2021-01-04T09:00:00.000Z')

    t.end()
  })

  test('milliseconds', t => {
    const date = luxon.DateTime.fromISO(
      '2021-01-04T11:00:00.000+02:00',
    ).valueOf()
    const d = new CronDate(date, 'Europe/Athens')
    t.equal(d.toISOString(), '2021-01-04T09:00:00.000Z')

    t.end()
  })

  test('CronDate with same timezone', t => {
    const date = new CronDate('Mon, 4 Jan 2021 10:00:00', 'Europe/Athens')
    const d = new CronDate(date)
    t.equal(d.toISOString(), '2021-01-04T08:00:00.000Z')

    t.end()
  })

  test('CronDate with different timezone', t => {
    const date = new CronDate('Mon, 4 Jan 2021 10:00:00', 'America/New_York')
    const d = new CronDate(date, 'Europe/Athens')
    t.equal(d.toISOString(), '2021-01-04T15:00:00.000Z')

    t.end()
  })

  t.end('crondate input should')
})
