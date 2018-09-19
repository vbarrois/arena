const R = require('ramda')

// naming utils
const leftTrim = R.replace(/^\s+/, '')

const normalizeName = R.pipe(
  leftTrim,
  R.toLower,
  R.replace(/[^a-z0-9]/g, '_'),
  R.slice(0, 60),
)

/**
 * NodeDef and Survey common PROPS UTILS
 */

// READ
const getProps = R.pipe(
  R.prop('props'),
  R.defaultTo({}),
)

const getProp = (prop, defaultTo = null) => R.pipe(
  getProps,
  R.prop(prop),
  R.defaultTo(defaultTo),
)

const getLabels = getProp('labels', {})

//UPDATE
const setProp = (key, value) => R.assocPath(['props', key], value)

const toUUIDIndexedObj = array => R.reduce((acc, item) => R.assoc(item.uuid, item)(acc), {})(array)

module.exports = {
  normalizeName,
  toUUIDIndexedObj,

  // PROPS
  getProps,
  getProp,
  getLabels,

  setProp,
}
