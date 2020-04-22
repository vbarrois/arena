import * as R from 'ramda'

import * as NodeDef from '@core/survey/nodeDef'

// ====== UPDATE

export const assocNodeDef = (nodeDef) => R.assoc(NodeDef.getUuid(nodeDef), nodeDef)

export const mergeNodeDefs = R.mergeLeft

// ====== DELETE

export const dissocNodeDef = (nodeDef) => (nodeDefsState) => {
  // Delete the given node def from state
  let stateUpdated = R.dissoc(NodeDef.getUuid(nodeDef), nodeDefsState)

  // Delete descendant node defs from state
  Object.values(stateUpdated).forEach((nodeDefCurrent) => {
    if (NodeDef.isDescendantOf(nodeDef)(nodeDefCurrent)) {
      stateUpdated = R.dissoc(NodeDef.getUuid(nodeDefCurrent), stateUpdated)
    }
  })

  return stateUpdated
}

export const dissocNodeDefs = (nodeDefUuids) => (state) =>
  R.reduce((accState, nodeDefUuid) => R.dissoc(nodeDefUuid, accState), state, nodeDefUuids)
