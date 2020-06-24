import * as A from '@core/arena'

import { keys, modes, displayTypes } from './keys'
import { defaults } from './defaults'

// ====== CREATE
export const create = ({ entityDefUuid = null } = {}) => ({
  ...defaults,
  [keys.entityDefUuid]: entityDefUuid,
})

// ====== READ
export { displayTypes }
export const getMode = A.prop(keys.mode)
export const getDisplayType = A.prop(keys.displayType)
export const getFilter = A.prop(keys.filter)
export const getSort = A.prop(keys.sort)
export const getEntityDefUuid = A.prop(keys.entityDefUuid)
export const getAttributeDefUuids = A.prop(keys.attributeDefUuids)
export const getDimensions = A.prop(keys.dimensions)
export const getMeasures = A.prop(keys.measures)

// mode
const isMode = (mode) => (query) => getMode(query) === mode
export const isModeAggregate = isMode(modes.aggregate)
export const isModeRawEdit = isMode(modes.rawEdit)

// utils
export const hasSelection = (query) =>
  !A.isEmpty(getEntityDefUuid(query)) &&
  (isModeAggregate(query)
    ? !A.isEmpty(getMeasures(query)) && !A.isEmpty(getDimensions(query))
    : !A.isEmpty(getAttributeDefUuids(query)))

// ====== UPDATE
export const assocAttributeDefUuids = A.assoc(keys.attributeDefUuids)
export const assocDimensions = A.assoc(keys.dimensions)
export const assocMeasures = A.assoc(keys.measures)

// mode
export const toggleModeAggregate = (query) => ({
  ...create({ entityDefUuid: getEntityDefUuid(query) }),
  [keys.mode]: isModeAggregate(query) ? modes.raw : modes.aggregate,
})
export const toggleModeEdit = (query) => ({
  ...query,
  [keys.mode]: isModeRawEdit(query) ? modes.raw : modes.rawEdit,
})
