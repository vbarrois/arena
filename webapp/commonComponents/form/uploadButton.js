import './uploadButton.scss'

import React from 'react'
import * as R from 'ramda'

const checkFilesSize = (files, maxSizeMB) =>
  R.find(file => file.size > maxSizeMB * 1024 * 1024, files)
    ? alert(`File exceeds maximum size (${maxSizeMB}MB)`)
    : true

class UploadButton extends React.Component {

  constructor (props) {
    super(props)

    this.fileInput = React.createRef()
  }

  render () {
    const {disabled, label, onChange, showLabel, maxSize, accept} = this.props

    return <React.Fragment>
      <input
        ref={this.fileInput}
        type="file"
        style={{display: 'none'}}
        accept={accept}
        onChange={() => {
          const files = this.fileInput.current.files
          if (checkFilesSize(files, maxSize)) {
            onChange(files)
          }
        }}/>

      <button className="btn"
              aria-disabled={disabled}
              onClick={() => {
                // first reset current value, then trigger click event
                this.fileInput.current.value = ''
                this.fileInput.current.dispatchEvent(new MouseEvent('click'))
              }}>
        <span className={`icon icon-upload2 icon-14px${showLabel ? ' icon-left' : ''}`}/>
        {showLabel && label}
      </button>
    </React.Fragment>
  }

}

UploadButton.defaultProps = {
  disabled: false,
  label: 'Upload',
  onChange: null,
  showLabel: true,
  maxSize: 10, //mega bytes
  accept: null //e.g. .txt, .xls (null = all type of files are accepted)
}

export default UploadButton