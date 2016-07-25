import React from 'react'
import ReactDOM from 'react-dom'
import Link from './link.jsx'

export default class Modal extends React.Component {

  componentDidMount(){
    this.activeElement = document.activeElement
    this.activeElement.blur()
  }

  componentWillUnmount(){
    this.activeElement.focus()
  }

  render() {
    const className = "modal "+(this.props.className||'')
    return <div {...this.props} className={className} >
      {this.props.children}
    </div>
  }
}
