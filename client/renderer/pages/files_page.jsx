import React from 'react'
import Page from '../page.js'
import Layout from '../components/layout.jsx'
import Link from '../components/link.jsx'
import moment from 'moment'

export default class FilesPage extends Page {

  onEnter(){
    // this.emit('files:startPolling')
  }

  onExit(){
    // this.emit('files:stopPolling')
  }

  onStateChange(state){
    let fileId = state.route.params.fileId

    if (fileId === '0') {
      this.emit({
        type: 'changeLocation',
        path: '/files',
        replace: true,
      })
      return
    }

    fileId = fileId || '0'

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
      let path = parentId === 0 ? '/files' : `/files/${parentId}`
      return <div key={parentId}><Link path={path}>{parentName}</Link></div>
    })

    return <div className="inline-list crumb-list">{links}</div>
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
    <small>{moment(file.created_at).fromNow().toString()}</small>
    <small>{formatBytes(file.size, 2)}</small>
    <div className="grow"></div>
    <DownloadLink file={file} tabIndex="-1">
      <i className="icon icon-download"/>
    </DownloadLink>
    <PlayLink file={file} tabIndex="-1">
      <i className="icon icon-play"/>
    </PlayLink>
    <PutioLink file={file} tabIndex="-1">
      <i className="icon icon-external-link-square"/>
    </PutioLink>
  </div>
}

const DirectoryMemberIcon = ({file}) => {
  return (
    file.isDirectory ? <div className="icon icon-folder" /> :
    file.isVideo ? <div className="icon icon-video-camera" /> :
    <div className="icon icon-file" />
  )
}

const DownloadLink = (props) => {
  let downloadUrl = props.file.downloadUrl
  return downloadUrl ?
    <Link {...props} href={downloadUrl}>{props.children}</Link> :
    null
}

const PutioLink = (props) => {
  let putioUrl = props.file.putioUrl
  return putioUrl ?
    <Link {...props} href={putioUrl}>{props.children}</Link> :
    null
}

const PlayLink = (props) => {
  return props.file.isVideo ?
    <Link {...props} href={`/play/${props.file.id}`}>{props.children}</Link> :
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
      <PlayLink file={file}>
        <img src={file.screenshot} />
      </PlayLink>
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

const FileSize = () => {
  return <span>{formatBytes(this.props.size, 2)}</span>
}

const getParentIds = (files, file) => {
  let parentId = file.parent_id
  if (typeof parentId !== 'number') return []
  let parent = files[parentId]
  let parentIds = [parentId]
  if (parent) parentIds = getParentIds(files, parent).concat(parentIds)
  return parentIds
}


const formatBytes = (bytes, decimals) => {
  if (bytes == 0) return '0 Bytes'
  const k = 1000
  const dm = decimals + 1 || 3
  const sizes = [
    'bytes',
    'kb',
    'mb',
    'gb',
    'tb',
    'pb',
    'eb',
    'zb',
    'yb'
  ]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / k ** i).toPrecision(dm) + '' + sizes[i]
}
