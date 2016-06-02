import React from 'react'
import Page from '../page.js'
import Layout from '../components/layout.jsx'

export default class FilesPage extends Page {

  onEnter(){
    // this.emit('files:startPolling')
  }

  onExit(){
    // this.emit('files:stopPolling')
  }

  onStateChange(state){
    const fileId = state.route.params.fileId || 0
    const file = state.files[fileId]
    if (!file){
      this.emit({
        type: 'files:load',
        fileId: fileId
      })
    }else{
      // console.info('onStateChange', file)
      if (file.isDirectory && !file.directoryContentsLoaded && !file.loadingDirectoryContents){
        this.emit({
          type: 'files:loadDirectoryContents',
          fileId: fileId
        })
      }
    }
  }

  render(state) {
    const fileId = state.route.params.fileId || 0
    const file = state.files[fileId]

    const content = (
      file.loading ? 'Loading...' :
      file.error ? `Error: ${file.error}` :
      <File fileId={fileId} />
    )
  // ?
    //   <FilesList files={state.files[fileId]} /> :
    //   'Loading...'

    return <Layout>{content}</Layout>
  }

}

class File extends React.Component {
  static contextTypes = {
    state: React.PropTypes.object.isRequired
  }

  render(){
    const state = this.context.state
    const fileId = this.props.fileId
    const file = state.files[fileId]

    if (file.isDirectory) return <Directory fileId={fileId} />
    return <div>
      <div>File: {fileId} {file.name}</div>
      <div>{JSON.stringify(file, null, '  ')}</div>
    </div>
  }
}


class Directory extends React.Component {
  static contextTypes = {
    state: React.PropTypes.object.isRequired
  }
  render(){
    const state = this.context.state
    const fileId = this.props.fileId
    const directory = state.files[fileId]
    const files = directory.directoryContentsLoaded ?
      directory.fileIds.map(fileId => <File key={fileId} fileId={fileId} />) :
      'loading...'
    return <div>
      <div>Directory: {fileId} {directory.name}</div>
      <div>{JSON.stringify(directory, null, '  ')}</div>
      <div>{files}</div>
    </div>
  }
}


class FilesListItem extends React.Component {
  render(){
    return <tr>
      <td>{this.props.file.name}</td>
    </tr>
  }
}
