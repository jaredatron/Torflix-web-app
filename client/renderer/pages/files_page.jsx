import React from 'react'
import Page from '../page.js'
import Layout from '../components/layout.jsx'
import Link from '../components/link.jsx'

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
    const files = state.files
    const file = files[fileId]

    const content = (
      file.loading ? 'Loading...' :
      file.error ? `Error: ${file.error}` :
      file.isDirectory ? <DirectoryContents files={files} fileId={fileId} /> :
      file.isVideo ? <VideoFile files={files} fileId={fileId} /> :
      <MiscFile files={files} fileId={fileId} />
    )
  // ?
    //   <FilesList files={state.files[fileId]} /> :
    //   'Loading...'

    return <Layout className="files-page">{content}</Layout>
  }

}

class DirectoryContents extends React.Component {
  render(){
    const files = this.props.files
    const fileId = this.props.fileId
    const directory = files[fileId]
    const directoryContents = directory.directoryContentsLoaded ?
      directory.fileIds.map(fileId => <DirectoryMember key={fileId} file={files[fileId]} />) :
      'loading...'
    return <div>
      <h1>{directory.name}</h1>
      <div>{directoryContents}</div>
    </div>
  }
}

class DirectoryMember extends React.Component {
  render(){
    const file = this.props.file
    return <div>
      <Link path={`/files/${file.id}`}>{file.name}</Link>
    </div>
  }
}


class VideoFile extends React.Component {
  render(){
    const files = this.props.files
    const fileId = this.props.fileId
    const file = files[fileId]

    let sources = [
      <source key="streamUrl" src={file.streamUrl} type={`video/${file.extension}`} />
    ]
    if (file.is_mp4_available) sources.push(
      <source key="mp4StreamUrl" src={file.mp4StreamUrl} type="video/mp4" />
    )

    return <div className="files-video-file">
      <h1>{file.name}</h1>
      <div>
        <Link href={file.downloadUrl}>Download Video</Link>
      </div>
      <video controls>
        {sources}
        Your browser does not support the video tag.
      </video>
    </div>
  }
}

// class File extends React.Component {
//   static contextTypes = {
//     state: React.PropTypes.object.isRequired
//   }

//   render(){
//     const state = this.context.state
//     const fileId = this.props.fileId
//     const file = state.files[fileId]

//     if (file.isDirectory) return <Directory fileId={fileId} />
//     return <div>
//       <div>File: {fileId} {file.name}</div>
//       <div>{JSON.stringify(file, null, '  ')}</div>
//     </div>
//   }
// }


// class Directory extends React.Component {
//   static contextTypes = {
//     state: React.PropTypes.object.isRequired
//   }
//   render(){
//     const state = this.context.state
//     const fileId = this.props.fileId
//     const directory = state.files[fileId]
//     const files = directory.directoryContentsLoaded ?
//       directory.fileIds.map(fileId => <DirectoryMember key={fileId} fileId={fileId} />) :
//       'loading...'
//     return <div className="files-directory">
//       <h1>{directory.name}</h1>
//       <div>{files}</div>
//     </div>
//   }
// }


// class FilesListItem extends React.Component {
//   render(){
//     return <tr>
//       <td>{this.props.file.name}</td>
//     </tr>
//   }
// }
