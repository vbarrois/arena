import './panelRight.scss'
import React from 'react'
import PropTypes from 'prop-types'

const PanelRight = (props) => {
  const { children, header, onClose, width } = props

  return (
    <div className="panel-right" style={{ width: `min(${width}, 100vw)` }}>
      <div className="panel-right__header">
        <button type="button" className="btn btn-transparent btn-close" onClick={onClose}>
          <span className="icon icon-cross icon-12px" />
        </button>
        <div>{header}</div>
      </div>
      <div className="panel-right__content">{React.Children.toArray(children)}</div>
    </div>
  )
}

PanelRight.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  header: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.string, // width of the panel (e.g. '1000px' or '90vw')
}

PanelRight.defaultProps = {
  header: '',
  width: '500px',
}

export default PanelRight
