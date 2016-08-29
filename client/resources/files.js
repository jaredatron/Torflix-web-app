import Rx from 'rx-dom'
import putio from '../putio'

export default function(events){
  const POLLING_FREQUENCY = 5000 // miliseconds

  let state = {
    filesBeingDeleted: [],
  }
  let stateStream = new Rx.ReplaySubject(1)
  let pollingStream = null

  events.subscribe( event => {
    if (event.type === 'files:load')                  return loadFile(event.fileId)
    if (event.type === 'files:reload')                return reloadFile(event.fileId)
    if (event.type === 'files:loadDirectoryContents') return loadDirectoryContents(event.fileId)
    if (event.type === 'files:startPolling')          return startPolling(event.fileId)
    if (event.type === 'files:stopPolling')           return stopPolling(event.fileId)
    if (event.type === 'files:delete')                return deleteFiles(event.fileIds)
  })

  const loadFile = (fileId) => {
    if (!state[fileId]) reloadFile(fileId)
  }

  const reloadFile = (fileId) => {
    if (state[fileId] && state[fileId].loading) return
    if (!state[fileId]){
      state[fileId] = {id: fileId}
      publish()
    }
    putio.getFile(fileId).subscribe(
      file => {
        file.loaded = true
        Object.assign(state[fileId], file)
        if (typeof file.parent_id === 'number') loadFile(file.parent_id)
        if (file.isDirectory && !file.directoryContentsLoaded && !file.loadingDirectoryContents){
          loadDirectoryContents(fileId)
        }
        publish()
      },

      error => {
        let errorMessage = error.message
        if (error.response && error.response.status === 404){
          errorMessage = 'File Not Found'
        }
        state[fileId] = {
          error: error,
          errorMessage: errorMessage,
        }
        publish()
      }
    )
  }

  const loadDirectoryContents = (fileId) => {
    const file = state[fileId]
    if (!file) throw new Error('failed to load directory contents for '+fileId)
    file.loadingDirectoryContents = true
    publish()

    putio.getDirectoryContents(fileId).subscribe(
      ({parent, files}) => {
        files.forEach( file => {
          file.loaded = true
          state[file.id] = Object.assign(state[file.id] || {}, file)
        })
        parent.loaded = true
        parent.directoryContentsLoaded = true
        parent.loadingDirectoryContents = false
        Object.assign(state[fileId], parent)
        publish()
      },

      error => {
        throw error
        // state[fileId] = {error: error}
        // publish()
        debugger
      }
    )
  }

  const deleteFiles = (fileIds) => {
    fileIds = fileIds.filter(fileId => fileId in state)
    state.filesBeingDeleted = state.filesBeingDeleted.concat(fileIds)

    putio.deleteFiles(fileIds).subscribe(() => {
      state.filesBeingDeleted = state.filesBeingDeleted.filter(fileId =>
        !fileIds.includes(fileId)
      )
      publish()
    })
    publish()
  }

  const startPolling = (fileId) => {
    if (pollingStream && pollingStream.fileId === fileId) return
    stopPolling()

    pollingStream = Rx.Observable
      .interval(POLLING_FREQUENCY)
      .forEach(() => { reloadFile(fileId) })
    pollingStream.fileId = fileId
    pollingStream.next()
  }

  const stopPolling = () => {
    if (pollingStream) pollingStream.dispose()
    pollingStream = null
  }

  // const mergeFiles(a, b){
  //   a = a || {}
  //   if (file.isDirectory) {
  //     file.directoryContentsLoaded = !!file.fileIds
  //   }
  //   return a
  // }

  const publish = () => stateStream.onNext(state)
  publish()
  return stateStream;
}
