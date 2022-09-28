const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
const timezone = require('dayjs/plugin/timezone')
const utc = require('dayjs/plugin/utc')

dayjs.extend(advancedFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

class CronDate {
  constructor(timestamp, tz) {
    this._date =
      timestamp instanceof CronDate ? timestamp._date : dayjs(timestamp)

    if (!this._date || !this._date.isValid()) {
      throw new Error(
        'CronDate: unhandled timestamp: ' + JSON.stringify(timestamp),
      )
    }

    if (tz) {
      this._date = dayjs.tz(timestamp, tz)
    }
  }

  addYear() {
    this._date = this._date.add(1, 'year')
  }

  addMonth() {
    this._date = this._date.add(1, 'month').startOf('month')
  }

  addDay() {
    this._date = this._date.add(1, 'day').startOf('day')
  }

  addHour() {
    this._date = this._date.add(1, 'hour').startOf('hour')
  }

  addMinute() {
    this._date = this._date.add(1, 'minute').startOf('minute')
  }

  addSecond() {
    this._date = this._date.add(1, 'second').startOf('second')
  }

  subtractYear() {
    this._date = this._date.subtract(1, 'year')
  }

  subtractMonth() {
    this._date = this._date.subtract(1, 'month').endOf('month')
  }

  subtractDay() {
    this._date = this._date.subtract(1, 'day').endOf('day')
  }

  subtractHour() {
    this._date = this._date.subtract(1, 'hour').endOf('hour')
  }

  subtractMinute() {
    this._date = this._date.subtract(1, 'minute').endOf('minute')
  }

  subtractSecond() {
    this._date = this._date.subtract(1, 'second').startOf('second')
  }

  getDate() {
    return this._date.date()
  }

  getFullYear() {
    return this._date.year()
  }

  getDay() {
    return this._date.day()
  }

  getMonth() {
    return this._date.month()
  }

  getHours() {
    return this._date.hour()
  }

  getMinutes() {
    return this._date.minute()
  }

  getSeconds() {
    return this._date.second()
  }

  getMilliseconds() {
    return this._date.millisecond()
  }

  getTime() {
    return this._date.valueOf()
  }

  _getUTC() {
    return this._date.utc()
  }

  getUTCDate() {
    return this._getUTC().date()
  }

  getUTCFullYear() {
    return this._getUTC().year()
  }

  getUTCDay() {
    return this._getUTC().day()
  }

  getUTCMonth() {
    return this._getUTC().month()
  }

  getUTCHours() {
    return this._getUTC().hour()
  }

  getUTCMinutes() {
    return this._getUTC().minute()
  }

  getUTCSeconds() {
    return this._getUTC().second()
  }

  toISOString() {
    return this._date.toISOString()
  }

  toJSON() {
    return this._date.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
  }

  setDate(d) {
    this._date = this._date.date(d)
  }

  setFullYear(y) {
    this._date = this._date.year(y)
  }

  setDay(d) {
    if (this._date.day() === 0) {
      this._date = this._date.subtract(1, 'week')
    }
    this._date = this._date.day(d)
  }

  setMonth(m) {
    this._date = this._date.month(m)
  }

  setHours(h) {
    this._date = this._date.hour(h)
  }

  setMinutes(m) {
    this._date = this._date.minute(m)
  }

  setSeconds(s) {
    this._date = this._date.second(s)
  }

  setMilliseconds(s) {
    this._date = this._date.millisecond(s)
  }

  toString() {
    return this.toDate().toString()
  }

  toDate() {
    return this._date.toDate()
  }

  isLastDayOfMonth() {
    // next day
    const newDate = this._date.clone().add(1, 'day').startOf('day')
    return !newDate.isSame(this._date, 'month')
  }

  isLastWeekdayOfMonth() {
    // Check this by adding 7 days to the current date and seeing if it's
    // a different month
    const newDate = this._date.clone().add(7, 'day').startOf('day')
    return !newDate.isSame(this._date, 'month')
  }
}

module.exports = CronDate
