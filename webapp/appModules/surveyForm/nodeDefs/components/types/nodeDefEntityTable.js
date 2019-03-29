import '../../../style/react-grid-layout.scss'

import React from 'react'
import * as R from 'ramda'

import NodeDefSwitch from '../../nodeDefSwitch'
import NodeDeleteButton from '../nodeDeleteButton'

import { nodeDefRenderType } from '../../../../../../common/survey/nodeDefLayout'
import { getNodeDefFormFields } from '../../nodeDefSystemProps'

import NodeDef from '../../../../../../common/survey/nodeDef'
import Node from '../../../../../../common/record/node'

const EntityTableRow = (props) => {

  const {
    nodeDef, childDefs, node,
    renderType,
    removeNode,
    i = 'header',
    canEditRecord,
  } = props

  const className = `node-def__table-row` +
    (renderType === nodeDefRenderType.tableHeader ? '-header' : '')

  return (
    <div className={className}
         id={`${NodeDef.getUuid(nodeDef)}_${i}`}>

      {
        childDefs
          .map((childDef, i) => {
              const { length } = getNodeDefFormFields(childDef)

              return (
                <div key={NodeDef.getUuid(childDef)} className="react-grid-item" style={{ width: 160 * length + 'px' }}>
                  <NodeDefSwitch key={i}
                                 {...props}
                                 node={null}
                                 nodeDef={childDef}
                                 parentNode={node}
                                 renderType={renderType}/>
                </div>
              )
            }
          )
      }

      {
        renderType === nodeDefRenderType.tableBody && canEditRecord &&
        <NodeDeleteButton nodeDef={nodeDef}
                          node={node}
                          removeNode={removeNode}/>
      }

    </div>
  )

}

class NodeDefEntityTable extends React.Component {

  componentDidUpdate (prevProps) {
    const { nodes, nodeDef } = this.props
    const { nodes: prevNodes } = prevProps

    if (nodes && !R.isEmpty(nodes) && nodes.length !== prevNodes.length) {
      const element = document.getElementById(`${NodeDef.getUuid(nodeDef)}_${nodes.length - 1}`)
      element.scrollIntoView()
    }
  }

  render () {
    const {
      entry,
      edit,
      nodeDef,
      nodes,
      parentNode,
      label,
      updateNode,
      canEditRecord,
      canAddNode,
    } = this.props

    return (
      <div className="node-def__table">

        <div className="node-def__table-header">
          <div>{label}</div>
          {
            entry && canEditRecord
              ? <button className="btn btn-s btn-of-light-xs"
                        style={{ marginLeft: '10px' }}
                        onClick={() => {
                          const entity = Node.newNodePlaceholder(nodeDef, parentNode)
                          updateNode(nodeDef, entity)
                        }}
                        aria-disabled={!canAddNode}>
                <span className="icon icon-plus icon-12px icon-left"/>
                ADD
              </button>
              : null
          }
        </div>


        <div className="node-def__table-rows">
          {
            edit || !R.isEmpty(nodes) ?

              <EntityTableRow {...this.props}
                              node={null}
                              renderType={nodeDefRenderType.tableHeader}/>
              : null
          }

          {
            entry ?
              R.isEmpty(nodes)
                ? <h5><i>No data added</i></h5>
                : (
                  <div className="node-def__table-data-rows">
                    {nodes.map((node, i) =>
                      <EntityTableRow key={i}
                                      i={i}
                                      {...this.props}
                                      node={node}
                                      nodes={null}
                                      renderType={nodeDefRenderType.tableBody}/>
                    )}
                  </div>
                )
              : null
          }
        </div>
      </div>
    )
  }
}

export default NodeDefEntityTable