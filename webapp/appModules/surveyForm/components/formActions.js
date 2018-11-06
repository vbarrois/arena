import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { uuidv4 } from '../../../../common/uuid'

import Survey from '../../../../common/survey/survey'
import NodeDef from '../../../../common/survey/nodeDef'

import { nodeDefLayoutProps, nodeDefRenderType, isRenderForm } from '../../../../common/survey/nodeDefLayout'
import { getNodeDefIconByType, getNodeDefDefaultLayoutPropsByType } from '../nodeDefs/nodeDefSystemProps'

import { getSurvey } from '../../../survey/surveyState'

import { createNodeDef } from '../../../survey/nodeDefs/actions'
import { getFormActivePageNodeDef, getNodeDefFormUnlocked, getSurveyForm } from '../surveyFormState'

const AddNodeDefButton = ({type, addNodeDef, enabled}) => {
  const isEntity = type === NodeDef.nodeDefType.entity
  const nodeDefProps = getNodeDefDefaultLayoutPropsByType(type)

  return <React.Fragment key={type}>
    {
      isEntity ?
        <div className="separator-of"/>
        : null

    }
    <button className="btn btn-s btn-of-light-s"
            onClick={() => addNodeDef(type, nodeDefProps)}
            aria-disabled={!enabled}>
      {getNodeDefIconByType(type)}{type}
    </button>
  </React.Fragment>
}

const AddNodeDefButtons = ({addNodeDef, nodeDef}) => {
  const enabled = nodeDef && NodeDef.isNodeDefEntity(nodeDef)

  const canAddAttribute = enabled
  const canAddEntity = enabled && isRenderForm(nodeDef)

  return <React.Fragment>
    <div/>
    <div/>
    <div/>
    <div className="title-of">
      <span className="icon icon-plus icon-left"/> Add
    </div>

    {
      R.values(NodeDef.nodeDefType)
        .map(type =>
          <AddNodeDefButton key={type} type={type}
                            addNodeDef={addNodeDef}
                            enabled={type === NodeDef.nodeDefType.entity ? canAddEntity : canAddAttribute}/>
        )
    }

    <button className="btn btn-s btn-of-light-xs"
            aria-disabled={!canAddEntity}
            onClick={() => addNodeDef(
              NodeDef.nodeDefType.entity,
              {
                [nodeDefLayoutProps.render]: nodeDefRenderType.form,
                [nodeDefLayoutProps.pageUUID]: uuidv4(),
              }
            )}>
      <span className="icon icon-insert-template icon-left"/>
      Entity New Page
    </button>

  </React.Fragment>
}

class FormActions extends React.Component {

  constructor () {
    super()
    this.state = {opened: true}

    this.addNodeDef = this.addNodeDef.bind(this)
  }

  toggleOpen () {
    const {opened} = this.state

    const width = opened ? 33 : 200
    document.getElementsByClassName('survey-form')[0].style.gridTemplateColumns = `1fr ${width}px`

    this.setState({opened: !opened})

    //react-grid-layout re-render
    window.dispatchEvent(new Event('resize'))
  }

  addNodeDef (type, props) {
    const {nodeDef, createNodeDef} = this.props
    createNodeDef(nodeDef.id, type, props)
  }

  render () {

    const {nodeDef} = this.props

    return (
      <div className="survey-form__actions node-def__form_page">

        <div style={{opacity: '0.5', position: 'absolute'}}>
          <a className="btn btn-s btn-of-light-xs no-border"
             onClick={() => this.toggleOpen()}>
            <span className={`icon icon-${this.state.opened ? 'shrink2' : 'enlarge2'} icon-16px`}/>
          </a>
        </div>

        {
          this.state.opened ?
            <AddNodeDefButtons nodeDef={nodeDef} addNodeDef={this.addNodeDef}/>
            : null
        }

      </div>

    )
  }

}

const mapStateToProps = state => {
  const survey = getSurvey(state)
  const surveyForm = getSurveyForm(state)

  const nodeDefUnlocked = getNodeDefFormUnlocked(survey)(surveyForm)
  const nodeDefActivePage = getFormActivePageNodeDef(survey)(surveyForm)

  const nodeDef = nodeDefUnlocked &&
  (
    nodeDefActivePage.uuid === nodeDefUnlocked.uuid ||
    Survey.isNodeDefAncestor(nodeDefActivePage, nodeDefUnlocked)(survey)
  )
    ? nodeDefUnlocked
    : null

  return {
    nodeDef
  }
}

export default connect(mapStateToProps, {createNodeDef})(FormActions)