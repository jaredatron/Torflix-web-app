import React from 'react'
import Page from '../page.js'

export default class PlayVideoPage extends Page {

  onStateChange(state){
    const fileId = state.route.params.fileId || 0
    const file = state.files[fileId]
    if (!file){
      this.emit({
        type: 'files:load',
        fileId: fileId
      })
    }
  }

  render(state) {
    const file = state.files[state.route.params.fileId]
    if (!file) return <div>Loading...</div>
    return <div className="play-page">
      <Video file={file} className="layer" autoPlay/>
      <Overlay>
        <h1>{file.name}</h1>
      </Overlay>
    </div>
  }

}






class Overlay extends React.Component {
  constructor(){
    super()
    this.state = {
      visible: true
    }
    this.onMouseMove = this.onMouseMove.bind(this)
    this.fadeOut = this.fadeOut.bind(this)
    this.fadeIn = this.fadeIn.bind(this)
  }

  componentDidMount(){
    clearTimeout(this.timeout)
    this.timeout = setTimeout(this.fadeOut, 3500)
    this.subscription = Rx.Observable
      .fromEvent(document, 'mousemove')
      .debounce(100)
      .forEach(this.onMouseMove)
  }

  componentWillUnmount(){
    clearTimeout(this.timeout)
    this.subscription.dispose()
  }

  onMouseMove() {
    this.fadeIn()
  }

  fadeIn() {
    this.setState({visible: true})
    clearTimeout(this.timeout)
    this.timeout = setTimeout(this.fadeOut, 3500)
  }

  fadeOut() {
    this.setState({visible: false})
  }

  render(){
    let className = "layer theme-dark transparent-overlay"
    if (!this.state.visible) className += ' invisible'
    return <div
      ref="overlay"
      className={className}
      >{this.props.children}</div>
  }
}


class Video extends React.Component {
  render(){
    const file = this.props.file

    let sources = [
      <source key="streamUrl" src={file.streamUrl} type={`video/${file.extension}`} />
    ]
    if (file.is_mp4_available) sources.push(
      <source key="mp4StreamUrl" src={file.mp4StreamUrl} type="video/mp4" />
    )

    return <video {...this.props} controls poster={file.screenshot}>
      {sources}
      Your browser does not support the video tag.
    </video>
  }
}
