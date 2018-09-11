import '../react-grid-layout.scss'

import React from 'react'
import * as R from 'ramda'

import { Responsive, WidthProvider } from 'react-grid-layout'
import NodeDefSwitch from '../nodeDefSwitch'

const ResponsiveGridLayout = WidthProvider(Responsive)

import { nodeDefRenderType } from '../../../../../common/survey/nodeDefLayout'

import { getNodeDefFieldsCount } from '../nodeDefSystemProps'
import { elementOffset } from '../../../../appUtils/domUtils'

const rowHeight = 50

const EntityTableRow = (props) => {

  const {
    nodeDef, edit, childDefs, node,
    renderType, label,
    removeNode,
  } = props

  const childDefsLayout = R.reduce(
    (layout, childDef) => {
      const count = getNodeDefFieldsCount(childDef)
      const {columns} = layout
      return R.pipe(
        R.assoc('columns', columns + count),
        R.assoc(
          childDef.uuid,
          {i: childDef.uuid, w: count, x: columns, y: 0, h: 1,}
        )
      )(layout)
    },
    {columns: 0},
    childDefs
  )
  const {columns} = childDefsLayout

  return (
    <React.Fragment>
      {
        renderType === nodeDefRenderType.tableHeader ?
          <div className="form-label node-def__table-header">
            {label}
          </div>
          : null
      }

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 40px'
      }}>

        <ResponsiveGridLayout breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                              autoSize={false}
                              rowHeight={rowHeight -1}
                              cols={{
                                lg: columns || 1,
                                md: columns || 1,
                                sm: columns || 1,
                                xs: 1,
                                xxs: 1
                              }}
                              containerPadding={[0, 0]}
          // layouts={{}}
          //                     onLayoutChange={this.onLayoutChange}
          //                     isDraggable={edit && !locked}
                              isDraggable={false}
                              isResizable={false}
                              compactType={'horizontal'}
                              margin={[0, 0]}>
          {
            childDefs
              .map((childDef, i) => {
                  const childDefLayout = R.prop(childDef.uuid, childDefsLayout)

                  return <div key={childDef.uuid} data-grid={{...childDefLayout}}>
                    <NodeDefSwitch key={i}
                                   {...props}
                                   node={null}
                                   nodeDef={childDef}
                                   parentNode={node}
                                   renderType={renderType}/>
                  </div>
                }
              )
          }

        </ResponsiveGridLayout>

        {
          renderType === nodeDefRenderType.tableBody && !node.placeholder ?
            <button className="btn btn-s btn-of-light-xs"
                    style={{
                      alignSelf: 'center',
                      justifySelf: 'center',
                    }}
                    onClick={() =>
                      window.confirm('Are you sure you want to delete this entity?')
                        ? removeNode(nodeDef, node)
                        : null
                    }>
              <span className="icon icon-bin icon-12px"/>
            </button>

            : null
        }
      </div>

    </React.Fragment>
  )

}

class NodeDefEntityTable extends React.Component {

  render () {
    const {
      entry,
      nodes,
      nodeDef,
    } = this.props

    const domElem = document.getElementById(nodeDef.uuid)
    const {height} = domElem ? elementOffset(domElem) : {height: 80}

    return (
      <div className="node-def__entity-table">

        <EntityTableRow {...this.props}
                        node={null}
                        renderType={nodeDefRenderType.tableHeader}/>

        {
          entry ?
            <div className="node-def__entity-table-data-rows"
                 style={{
                   gridTemplateRows: `repeat(${nodes.length}, ${rowHeight}px)`,
                   maxHeight: height - 80,
                 }}>
              {
                nodes.map((node, i) =>
                  <EntityTableRow key={i}
                                  {...this.props}
                                  node={node}
                                  nodes={null}
                                  renderType={nodeDefRenderType.tableBody}/>
                )
              }
            </div>
            : null
        }

      </div>
    )
  }
}

export default NodeDefEntityTable