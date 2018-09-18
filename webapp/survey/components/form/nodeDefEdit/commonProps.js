import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { FormItem, Input } from '../../../../commonComponents/form/input'
import Checkbox from '../../../../commonComponents/form/checkbox'
import LabelsEditor from '../../labelsEditor'
import CodeListProps from './codeListProps'
import CodeListEdit from '../../../codeList/components/codeListEdit'

import { getFieldValidation, getValidation } from './../../../../../common/validation/validator'

import {
  canNodeDefBeMultiple,
  getNodeDefDescriptions,
  getNodeDefLabels,
  getNodeDefName,
  isNodeDefCodeList,
  isNodeDefEntity,
  isNodeDefKey,
  isNodeDefMultiple,
} from '../../../../../common/survey/nodeDef'
import { isRenderTable, } from '../../../../../common/survey/nodeDefLayout'

import { putNodeDefProp } from '../../../nodeDef/actions'
import { addCodeList } from '../../../codeList/actions'

import { normalizeName } from './../../../../../common/survey/surveyUtils'

class CommonProps extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      addingNewCodeList: false,
      newCodeListUUID: null,
      showingCodeListsManager: false,
    }
  }

  onPropLabelsChange (nodeDef, labelItem, key, currentValue) {
    this.props.putNodeDefProp(nodeDef, key, R.assoc(labelItem.lang, labelItem.label, currentValue))
  }

  render () {
    const {survey, nodeDef, putNodeDefProp} = this.props

    const validation = getValidation(nodeDef)

    const isCodeList = isNodeDefCodeList(nodeDef)

    return (
      this.state.editingCodeList
        ? <CodeListEdit/>
        : <React.Fragment>
          <FormItem label={'name'}>
            <Input value={getNodeDefName(nodeDef)}
                   validation={getFieldValidation('name')(validation)}
                   onChange={e => putNodeDefProp(nodeDef, 'name', normalizeName(e.target.value))}/>
          </FormItem>

          <FormItem label={'type'}>
            <label>{nodeDef.type}</label>
          </FormItem>

          <LabelsEditor labels={getNodeDefLabels(nodeDef)}
                        onChange={(labelItem) => this.onPropLabelsChange(nodeDef, labelItem, 'labels', getNodeDefLabels(nodeDef))}/>

          <LabelsEditor formLabel="Description(s)"
                        labels={getNodeDefDescriptions(nodeDef)}
                        onChange={(labelItem) => this.onPropLabelsChange(nodeDef, labelItem, 'descriptions', getNodeDefDescriptions(nodeDef))}/>

          {
            isCodeList
              ? <CodeListProps {...this.props} onCodeListEdit={(editing) => this.setState({editingCodeList: editing})}/>
              : null
          }

          {
            isNodeDefEntity(nodeDef)
              ? null
              : <FormItem label={'key'}>
                <Checkbox checked={isNodeDefKey(nodeDef)}
                          onChange={(checked) => putNodeDefProp(nodeDef, 'key', checked)}/>
              </FormItem>
          }

          {
            canNodeDefBeMultiple(nodeDef)
              ? <FormItem label={'multiple'}>
                <Checkbox checked={isNodeDefMultiple(nodeDef)}
                          disabled={isRenderTable(nodeDef)}
                          onChange={(checked) => putNodeDefProp(nodeDef, 'multiple', checked)}/>
              </FormItem>
              : null
          }

        </React.Fragment>
    )
  }
}

export default connect(null, {putNodeDefProp, addCodeList})(CommonProps)