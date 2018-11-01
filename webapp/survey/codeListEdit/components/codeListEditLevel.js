import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'

import { FormItem, Input } from '../../../commonComponents/form/input'
import CodeListEditItem from './codeListEditItem'

import { normalizeName } from '../../../../common/survey/surveyUtils'
import {
  getSurveyDefaultLanguage,
  getNodeDefsByCodeListUUID,
  getNodeDefCodeListLevelIndex,
} from '../../../../common/survey/survey'
import {
  getCodeListLevelName,
  getCodeListLevelValidation,
  isCodeListLevelDeleteAllowed
} from '../../../../common/survey/codeList'
import { getFieldValidation } from '../../../../common/validation/validator'

import {
  createCodeListItem,
} from '../actions'
import { getSurvey } from '../../surveyState'
import {
  getCodeListEditLevelActiveItem,
  getCodeListEditCodeList,
  getCodeListEditLevelItemsArray,
} from '../codeListEditState'
import { putCodeListItemProp, putCodeListLevelProp } from '../actions'
import { deleteCodeListItem, deleteCodeListLevel, setCodeListItemForEdit } from '../actions'

class CodeListEditLevel extends React.Component {

  handleDelete () {
    const {survey, codeList, level, deleteCodeListLevel} = this.props

    const codeListDefs = getNodeDefsByCodeListUUID(codeList.uuid)(survey)
    if (R.any(def => getNodeDefCodeListLevelIndex(def)(survey) >= level.index)(codeListDefs)) {
      alert('This code list level is used by some node definitions and cannot be removed')
    } else if (confirm('Delete the level with all items? This operation cannot be undone')) {
      deleteCodeListLevel(codeList, level)
    }
  }

  render () {
    const {
      codeList, level, parentItem, items, activeItemUUID, canAddItem,
      canBeDeleted, language,
      createCodeListItem, putCodeListLevelProp, putCodeListItemProp, setCodeListItemForEdit, deleteCodeListItem,
    } = this.props

    const validation = getCodeListLevelValidation(level.index)(codeList)

    return <div className="code-lists__edit-level">

      <div className="code-lists__edit-level-header">
        <h4 className="label">Level {level.index + 1}</h4>
        <button className="btn btn-s btn-of-light-xs"
                onClick={() => this.handleDelete()}
                aria-disabled={!canBeDeleted}>
          <span className="icon icon-bin2 icon-12px"/>
        </button>
      </div>

      <FormItem label={'name'}>
        <Input value={getCodeListLevelName(level)}
               validation={getFieldValidation('name')(validation)}
               onChange={e => putCodeListLevelProp(codeList, level, 'name', normalizeName(e.target.value))}/>
      </FormItem>

      <div className="code-lists__edit-level-items-header">
        <h5 className="label">Items</h5>

        <button className="btn btn-s btn-of-light-xs btn-add-item"
                aria-disabled={!canAddItem}
                onClick={() => createCodeListItem(codeList, level, parentItem)}>
          <span className="icon icon-plus icon-12px icon-left"/>
          ADD
        </button>
      </div>

      <div className="code-lists__edit-level-items">
        {
          items.map(item =>
            <CodeListEditItem key={item.uuid}
                              language={language}
                              codeList={codeList}
                              level={level}
                              item={item}
                              active={item.uuid === activeItemUUID}
                              putCodeListItemProp={putCodeListItemProp}
                              setCodeListItemForEdit={setCodeListItemForEdit}
                              deleteCodeListItem={deleteCodeListItem}/>
          )
        }
      </div>
    </div>
  }
}

const mapStateToProps = (state, props) => {
  const {level} = props
  const {index} = level

  const survey = getSurvey(state)
  const language = getSurveyDefaultLanguage(survey)

  const codeList = getCodeListEditCodeList(survey)
  const activeItem = getCodeListEditLevelActiveItem(index)(survey)
  const parentItem = getCodeListEditLevelActiveItem(index - 1)(survey)

  const canAddItem = index === 0 || parentItem
  const items = canAddItem ? getCodeListEditLevelItemsArray(index)(survey) : []
  const canBeDeleted = isCodeListLevelDeleteAllowed(level)(codeList)

  return {
    language,
    codeList,
    items,
    activeItemUUID: activeItem ? activeItem.uuid : null,
    parentItem,
    canAddItem,
    canBeDeleted,
  }
}

export default connect(mapStateToProps, {
  createCodeListItem,
  putCodeListLevelProp,
  putCodeListItemProp,
  deleteCodeListLevel,
  setCodeListItemForEdit,
  deleteCodeListItem,
})(CodeListEditLevel)
