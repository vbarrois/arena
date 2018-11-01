import React from 'react'
import { connect } from 'react-redux'

import { getNodeDefChildren, getSurveyDefaultLanguage, getRootNodeDef } from '../../../../common/survey/survey'
import { isNodeDefRoot, getNodeDefLabel } from '../../../../common/survey/nodeDef'
import { filterOuterPageChildren } from '../../../../common/survey/nodeDefLayout'

import { getSurvey } from '../../surveyState'

import { setFormActivePage } from '../actions'
import { getFormPageParentNode, isNodeDefFormActivePage } from '../surveyFormState'

const FormNavigationItem = (props) => {
  const {
    nodeDef,
    childDefs,
    edit,

    label,
    level,
    active,
    enabled,

    setFormActivePage,
  } = props

  const outerPageChildDefs = childDefs ? filterOuterPageChildren(childDefs) : []

  return (
    <React.Fragment>

      <button className={`btn btn-of-light${active ? ' active' : ''}`}
              onClick={() => setFormActivePage(nodeDef)}
              style={{height: `${100 - level * 10}%`}}
              aria-disabled={!enabled}>
        {label}
      </button>

      {
        outerPageChildDefs.map((child, i) =>
          <FormNavigationItemConnect key={child.uuid}
                                     level={level + 1}
                                     nodeDef={child}
                                     edit={edit}
          />
        )
      }

    </React.Fragment>
  )
}

const mapStateToProps = (state, props) => {
  const survey = getSurvey(state)
  const rootNodeDef = getRootNodeDef(survey)

  const {edit, nodeDef = rootNodeDef} = props
  const parentNode = getFormPageParentNode(nodeDef)(survey)

  return {
    childDefs: getNodeDefChildren(nodeDef)(survey),
    label: getNodeDefLabel(nodeDef, getSurveyDefaultLanguage(survey)),

    active: isNodeDefFormActivePage(nodeDef)(survey),
    enabled: edit || isNodeDefRoot(nodeDef) || rootNodeDef.id === nodeDef.parentId || parentNode,
  }
}

const FormNavigationItemConnect = connect(
  mapStateToProps,
  {setFormActivePage}
)(FormNavigationItem)

const FormNavigation = ({edit}) => {

  return (
    <div className="survey-form__nav" style={{
      display: 'flex',
      alignItems: 'flex-end',
    }}>
      <FormNavigationItemConnect edit={edit}
                                 level={0}/>
    </div>
  )
}

export default FormNavigation