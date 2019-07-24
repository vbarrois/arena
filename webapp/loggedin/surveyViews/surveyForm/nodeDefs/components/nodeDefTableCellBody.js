import './nodeDefTableCellBody.scss'

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import * as R from 'ramda'

import NodeDefMultipleEditDialog from './nodeDefMultipleEditDialog'
import useI18n from '../../../../../commonComponents/useI18n'

import Survey from '../../../../../../common/survey/survey'
import NodeDef from '../../../../../../common/survey/nodeDef'
import CategoryItem from '../../../../../../common/survey/categoryItem'
import Node from '../../../../../../common/record/node'
import NodeRefData from '../../../../../../common/record/nodeRefData'

import * as NodeDefUiProps from '../nodeDefUIProps'
import NodeDefErrorBadge from './nodeDefErrorBadge'

const getNodeValues = (surveyInfo, nodeDef, nodes, lang) => {
  const getNodeValue = node => {
    if (NodeDef.isCode(nodeDef)) {
      const item = NodeRefData.getCategoryItem(node)
      const label = CategoryItem.getLabel(lang)(item)
      return label || CategoryItem.getCode(item)
    } else if (NodeDef.isFile(nodeDef)) {
      return Node.getFileName(node)
    } else {
      return Node.getValue(node)
    }
  }

  return R.pipe(
    R.reject(n => Node.isPlaceholder(n) || Node.isValueBlank(n)),
    R.map(getNodeValue),
    R.join(', ')
  )(nodes)

}

const NodeDefMultipleTableCell = props => {

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [nodeValues, setNodeValues] = useState([])

  const { surveyInfo, nodeDef, nodes, lang, canEditRecord } = props

  useEffect(() => {
    const nodeValuesUpdate = getNodeValues(surveyInfo, nodeDef, nodes, lang)
    setNodeValues(nodeValuesUpdate)
  }, [nodes])

  return showEditDialog
    ? (
      ReactDOM.createPortal(
        <NodeDefMultipleEditDialog
          {...props}
          onClose={() => setShowEditDialog(false)}
        />,
        document.body
      )
    )
    : (
      <div className="survey-form__node-def-table-cell-body-multiple">
          <span className="values-summary">
            {nodeValues}
          </span>
        <button className="btn-s"
                onClick={() => setShowEditDialog(true)}>
          <span className={`icon icon-12px ${canEditRecord ? 'icon-pencil2' : 'icon-eye'}`}/>
        </button>
      </div>
    )
}

const NodeDefTableCellBody = props => {
  const {
    surveyInfo, nodeDef,
    parentNode, nodes, edit,
  } = props
  const surveyLanguage = Survey.getLanguage(useI18n().lang)(surveyInfo)

  return (
    <NodeDefErrorBadge
      nodeDef={nodeDef}
      parentNode={parentNode}
      nodes={nodes}
      edit={edit}>

      {
        NodeDef.isMultiple(nodeDef) || NodeDef.isCode(nodeDef)
          ? (
            <NodeDefMultipleTableCell
              {...props}
              lang={surveyLanguage}
            />
          )
          : (
            React.createElement(NodeDefUiProps.getNodeDefComponent(nodeDef), { ...props })
          )
      }

    </NodeDefErrorBadge>
  )

}

export default NodeDefTableCellBody
