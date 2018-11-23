const R = require('ramda')
const camelize = require('camelize')

/**
 * NodeDef and Survey common PROPS UTILS
 */
//DB Utils
const mergeProps = def => {
  const {props, propsDraft} = def
  const propsMerged = R.mergeDeepRight(props, propsDraft, def)

  return R.pipe(
    R.assoc('props', propsMerged),
    R.dissoc('propsDraft'),
  )(def)
}

const propsToCamelCase = obj => {
  const result = camelize(obj)
  R.forEach(prop => {
    if (R.endsWith('Uuid', prop)) {
      result[R.take(prop.length - 4) + 'UUID'] = result[prop]
      delete result[prop]
    }
  }, R.keys(result))

  return result
}

const defDbTransformCallback = (def, draft = false) => def
  ? R.pipe(
    propsToCamelCase,
    def => draft
      ? mergeProps(def, draft)
      : R.omit(['propsDraft'], def),
  )(def)
  : null

// READ
const getProps = R.propOr({}, 'props')

const getProp = (prop, defaultTo = null) => R.pipe(getProps, R.propOr(defaultTo, prop))

const getLabels = getProp('labels', {})

//UPDATE
const setProp = (key, value) => R.assocPath(['props', key], value)

// UTILS
const toIndexedObj = (array, prop) => R.reduce((acc, item) => R.assoc(R.prop(prop)(item), item)(acc), {})(array)

const toUUIDIndexedObj = R.partialRight(toIndexedObj, ['uuid'])

module.exports = {
  toIndexedObj,
  toUUIDIndexedObj,

  // PROPS
  defDbTransformCallback,

  getProps,
  getProp,
  getLabels,

  setProp,
}
