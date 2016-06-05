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
      file.errorMessage ? <h1>Error: {file.errorMessage}</h1> :
      file.isDirectory ? <DirectoryContents files={files} fileId={fileId} /> :
      file.isVideo ? <VideoFile files={files} fileId={fileId} /> :
      file.isImage ? <img src={file.downloadUrl} /> :
      // file.isText ? <iframe src={file.downloadUrl} /> :
      <MiscFile files={files} fileId={fileId} />
    )



    return <Layout className="files-page">
      <Breadcrum files={files} fileId={fileId} />
      {content}
    </Layout>
  }

}

class Breadcrum extends React.Component {
  render(){
    const fileId = this.props.fileId
    const files = this.props.files
    const file = files[fileId]

    let parentIds = getParentIds(files, file)

    const links = parentIds.map( parentId => {
      let parent = files[parentId]
      let parentName = parent ? parent.name : 'Parent Directory'
      return <Link key={parentId} path={`/files/${parentId}`}>{parentName}</Link>
    })

    return <div className="inline-list separated-list">{links}</div>
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

const DirectoryMember = ({file}) => {
  let className = "files-directory-member"
  if (file.isDirectory) className += ' directory'
  return <div className={className}>
    <DirectoryMemberIcon file={file} />
    <Link className="files-title" path={`/files/${file.id}`}>{file.name}</Link>
    <div className="grow"></div>
    <DownloadLink file={file} />
    <PlayLink file={file}>P</PlayLink>
    <PutioLink file={file} />
  </div>
}

const DirectoryMemberIcon = ({file}) => {
  return (
    file.isDirectory ? <div>D</div> :
    file.isVideo ? <div>F</div> :
    <div>?</div>
  )
}

const DownloadLink = ({file}) => {
  let downloadUrl = file.downloadUrl
  return downloadUrl ?
    <Link tabIndex="-1" href={downloadUrl}>D</Link> :
    null
}

const PutioLink = (props) => {
  let putioUrl = props.file.putioUrl
  return putioUrl ?
    <Link tabIndex="-1" href={putioUrl}>P</Link> :
    null
}

const PlayLink = (props) => {
  return props.file.isVideo ?
    <Link href={`/play/${props.file.id}`}>{props.children}</Link> :
    null
}

class VideoFile extends React.Component {
  render(){
    const files = this.props.files
    const fileId = this.props.fileId
    const file = files[fileId]

    return <div className="files-video-file">
      <h1>{file.name}</h1>
      <div className="inline-list separated-list">
        <Link href={file.downloadUrl}>Download</Link>
        <PlayLink file={file}>Play</PlayLink>
      </div>
    </div>
  }
}

class MiscFile extends React.Component {
  render(){
    const files = this.props.files
    const fileId = this.props.fileId
    const file = files[fileId]

    const properties = Object.keys(file).map( prop => {
      return <tr key={prop}>
        <td>{prop}</td>
        <td>{JSON.stringify(file[prop])}</td>
      </tr>
    })

    return <div>
      <h1>{file.name}</h1>
      <table>
        <tbody>{properties}</tbody>
      </table>
    </div>
  }
}

const getParentIds = (files, file) => {
  let parentId = file.parent_id
  if (typeof parentId !== 'number') return []
  let parent = files[parentId]
  let parentIds = [parentId]
  if (parent) parentIds = getParentIds(files, parent).concat(parentIds)
  return parentIds
}
