import React from 'react'
import Page from '../page.js'
import Layout from '../components/layout.jsx'
import Link from '../components/link.jsx'
import SelectableList from '../components/selectable_list.jsx'
import moment from 'moment'

export default class FilesPage extends Page {

  constructor(){
    super()
    this.deleteFiles = this.deleteFiles.bind(this)
  }

  onStateChange(state){
    let fileId = state.route.params.fileId

    if (fileId === '0') {
      this.emit({
        type: 'setLocation',
        location: {
          path: '/files',
        },
        replace: true,
      })
      return
    }

    fileId = fileId || '0'

    this.emit({
      type: 'files:startPolling',
      fileId: fileId
    })

    // const file = state.files[fileId]
    // if (!file){
    //   this.emit({
    //     type: 'files:load',
    //     fileId: fileId
    //   })
    // }else{
    //   // console.info('onStateChange', file)
    //   if (file.isDirectory && !file.directoryContentsLoaded && !file.loadingDirectoryContents){
    //     this.emit({
    //       type: 'files:loadDirectoryContents',
    //       fileId: fileId
    //     })
    //   }
    // }
  }

  deleteFiles(fileIds){
    this.emit({
      type: 'files:delete',
      fileIds,
    })
  }

  render(state) {
    const fileId = state.route.params.fileId || 0
    const files = state.files
    const file = files[fileId]

    const content = (
      !file.loaded ? 'Loading...' :
      file.errorMessage ? <h1>Error: {file.errorMessage}</h1> :
      file.isDirectory ? <DirectoryContents files={files} fileId={fileId} deleteFiles={this.deleteFiles} /> :
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
    const {fileId, beingDeleted, deleteFiles} = this.props

    const allFiles = this.props.files
    const filesBeingDeleted = allFiles.filesBeingDeleted
    const directory = allFiles[fileId]

    if (!directory.fileIds){
      return <div>Loading…</div>
    }

    const files = directory.fileIds.map(fileId => {
      const file = allFiles[fileId]
      const beingDeleted = filesBeingDeleted.includes(fileId)
      return {
        key: file.id,
        file: file,
        beingDeleted: beingDeleted,
        selectable: !beingDeleted,
      }
    })

    const props = {
      className: "files-page-directory-contents",
      members: files,
      memberComponent: DirectoryMember,
      actions: [
        {
          name: 'delete',
          onClick: deleteFiles,
        }
      ],
      orderings: ['name', 'createdAt']
    }
    return <SelectableList {...props} />
  }
}

const DirectoryMember = (props) => {
  const {
    selected,
    file,
    toggleSelected,
    beingDeleted,
  } = props
  let className = "files-directory-member"
  if (file.isDirectory) className += ' files-directory-member-directory'
  if (selected) className += ' files-directory-member-selected'
  if (beingDeleted) className += ' files-directory-member-being-deleted'
  return <div className={className}>
    <div>
      <input
        type="checkbox"
        checked={selected}
        tabIndex="-1"
        onChange={toggleSelected}
        disabled={beingDeleted}
      />
    </div>
    <DirectoryMemberIcon file={file} />
    <Link tabIndex="-1" className="files-title" path={`/files/${file.id}`}>{file.name}</Link>
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
  let downloadUrl = props.file.downloadUrl || ''
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
        <PutioLink file={file}>Put.io</PutioLink>
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
