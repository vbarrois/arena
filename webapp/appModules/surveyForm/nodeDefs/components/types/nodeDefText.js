import React from 'react'
import * as R from 'ramda'

import { Input } from '../../../../../commonComponents/form/input'
import NodeDeleteButton from '../nodeDeleteButton'
import * as NodeDefUI from '../../nodeDefSystemProps'

import NodeDef from '../../../../../../common/survey/nodeDef'

import Node from '../../../../../../common/record/node'

const TextInput = ({nodeDef, node, edit, updateNode, canEditRecord}) => (
  <div>
    <Input aria-disabled={edit || !canEditRecord}
           {...NodeDefUI.getNodeDefInputTextProps(nodeDef)}
           value={Node.getNodeValue(node, '')}
           onChange={value => updateNode(nodeDef, node, value)}
    />
  </div>
)

const MultipleTextInput = props => {
  const {nodeDef, nodes, removeNode, canEditRecord} = props

  return <div className="node-def__entry-multiple">
    <div className="nodes">
      {
        nodes.map(n =>
          (!n.placeholder || canEditRecord) &&
          <div key={`nodeDefTextInput_${n.uuid}`}
               className="node-def__text-multiple-text-input-wrapper">

            <TextInput {...props}
                       node={n}/>

            {!n.placeholder && NodeDef.isNodeDefMultiple(nodeDef) && canEditRecord &&
            <NodeDeleteButton nodeDef={nodeDef}
                              node={n}
                              disabled={R.isEmpty(Node.getNodeValue(n))}
                              showConfirm={true}
                              removeNode={removeNode}/>
            }

          </div>
        )
      }
    </div>
  </div>
}

const NodeDefText = props =>
  props.edit
    ? <TextInput {...props}/>
    : NodeDef.isNodeDefMultiple(props.nodeDef)
    ? <MultipleTextInput {...props} />
    : <TextInput {...props} node={props.nodes[0]}/>

export default NodeDefText
