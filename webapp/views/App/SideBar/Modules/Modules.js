import React, { useState } from 'react'
import PropTypes from 'prop-types'

import * as SideBarModule from './utils'

import Module from './Module'
import PopupMenu from './PopupMenu'

const Modules = (props) => {
  const { user, surveyInfo, pathname, sideBarOpened } = props

  // Popup menu module
  const [modulePopupMenu, setModulePopupMenu] = useState(null)

  return (
    <div className={`sidebar__modules${modulePopupMenu ? ' popup-menu-opened' : ''}`}>
      <div className="sidebar__module-placeholder" />
      {SideBarModule.getModulesHierarchy(user, surveyInfo).map((module) => (
        <Module
          key={SideBarModule.getKey(module)}
          surveyInfo={surveyInfo}
          module={module}
          pathname={pathname}
          sideBarOpened={sideBarOpened}
          isOver={modulePopupMenu && SideBarModule.getKey(module) === SideBarModule.getKey(modulePopupMenu)}
          onMouseEnter={() => {
            setModulePopupMenu(module)
          }}
        />
      ))}
      <div className="sidebar__module-placeholder" />

      {modulePopupMenu && (
        <PopupMenu
          module={modulePopupMenu}
          pathname={pathname}
          onClose={() => {
            setModulePopupMenu(null)
          }}
        />
      )}
    </div>
  )
}

Modules.propTypes = {
  user: PropTypes.object,
  surveyInfo: PropTypes.object,
  pathname: PropTypes.string,
  sideBarOpened: PropTypes.bool,
}

Modules.defaultProps = {
  user: null,
  surveyInfo: null,
  pathname: '',
  sideBarOpened: false,
}

export default Modules
