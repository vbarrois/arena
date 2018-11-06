const R = require('ramda')

const trim = R.pipe(R.defaultTo(''), R.trim)

const leftTrim = R.replace(/^\s+/, '')

const toLower = a => R.pipe(
  R.ifElse(
    isString,
    R.identity,
    R.toString
  ),
  R.toLower,
)(a)

const contains = (a = '', b = '') => R.contains(toLower(a), toLower(b))

const isBlank = R.pipe(trim, R.isEmpty)

const isNotBlank = R.pipe(isBlank, R.not)

const isString = R.is(String)

module.exports = {
  trim,
  leftTrim,
  toLower,
  contains,

  isBlank,
  isNotBlank,

  isString,
}