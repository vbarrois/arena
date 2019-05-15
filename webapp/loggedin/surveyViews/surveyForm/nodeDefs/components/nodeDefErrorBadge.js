import React from 'react'
import { connect } from 'react-redux'

import * as R from 'ramda'

import ErrorBadge from '../../../../../commonComponents/errorBadge'

import NodeDef from '../../../../../../common/survey/nodeDef'
import Record from '../../../../../../common/record/record'
import RecordValidation from '../../../../../../common/record/recordValidation'
import Validator from '../../../../../../common/validation/validator'

import * as RecordState from '../../../record/recordState'

const NodeDefErrorBadge = props => {
  const { edit, nodeDef, validation, container } = props

  // update parent container invalid class
  const containerEl = container.current

  const canToggleClass = NodeDef.isAttribute(nodeDef) && containerEl
  if (canToggleClass) {
    if (Validator.isValidationValid(validation)) {
      containerEl.parentNode.classList.remove('node-def__invalid')
    } else {
      containerEl.parentNode.classList.add('node-def__invalid')
    }
  }

  return <ErrorBadge validation={validation} showLabel={edit}/>
}

const mapStateToProps = (state, props) => {
  const {nodeDef, parentNode, nodes, node, edit} = props

  const record = RecordState.getRecord(state)

  let validation = Validator.validValidation

  if (edit) {
    validation = Validator.getValidation(nodeDef)
  } else {
    const recordValidation = Record.getValidation(record)

    if (NodeDef.isSingle(nodeDef)) {
      //TODO : DON't the two following conditions return the same? : if !R.isEmpty(nodes) then you have node or not?
      if (!R.isEmpty(nodes))
        validation = RecordValidation.getNodeValidation(nodes[0])(recordValidation)
    } else if (node) {
      // "node" will be available only for multiple attributes
      validation = RecordValidation.getNodeValidation(node)(recordValidation)
    } else {
      validation = RecordValidation.getMultipleNodesValidation(parentNode, nodeDef)(recordValidation)
    }
  }

  return {
    validation
  }
}

NodeDefErrorBadge.defaultProps = {
  nodes: null,
  node: null,
}

export default connect(
  mapStateToProps,
)(NodeDefErrorBadge)