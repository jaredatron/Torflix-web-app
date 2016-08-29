import Rx from 'rx-dom'
import putio from '../putio'

export default function(events){
  const POLLING_FREQUENCY = 3000 // miliseconds

  let state = {
    selectedTransfers: [],
    deletingSelectedTransfers: false,
    transfersBeingDeleted: [],
  }
  let stateStream = new Rx.ReplaySubject(1)
  // .subscribeOnCompleted( () => {
  //   if (pollingStream) pollingStream.dispose()
  //   pollingStream = null
  // })
  let pollingStream = null

  events.subscribe( event => {
    if (event.type === 'transfers:load')         return loadTransfers()
    if (event.type === 'transfers:reload')       return reloadTransfers()
    if (event.type === 'transfers:startPolling') return startPolling()
    if (event.type === 'transfers:stopPolling')  return stopPolling()
    if (event.type === 'transfers:delete')       return deleteTransfers(event.transferIds)
  })

  const loadTransfers = () => {
    if (!state.loaded) reloadTransfers()
  }

  const reloadTransfers = () => {
    putio.getTransfers().subscribe( transfers => {
      state.transfers = transfers
      state.loaded = true
      publish()
    })
  }

  const startPolling = () => {
    if (pollingStream) return
    pollingStream = Rx.Observable.interval(POLLING_FREQUENCY).forEach(reloadTransfers)
    reloadTransfers()
  }

  const stopPolling = () => {
    pollingStream.dispose()
    pollingStream = null
  }

  const toggleTransferSelect = (event) => {
    const transferId = event.transferId || event.transfer.id
    if (state.selectedTransfers.includes(transferId))
      state.selectedTransfers = state.selectedTransfers.filter(id => id !== transferId)
    else
      state.selectedTransfers = state.selectedTransfers.concat([transferId])
    publish()
  }

  const selectAllTransfers = () => {
    state.selectedTransfers = state.transfers.map(({id})=> id)
    publish()
  }

  const emptySelectedTransfers = () => {
    state.selectedTransfers = []
    publish()
  }

  const confirmDeleteSelected = () => {
    if (state.selectedTransfers.length === 0) return;
    state.deletingSelectedTransfers = true
    publish()
  }

  const cancelDelete = () => {
    state.deletingSelectedTransfers = false
    publish()
  }

  const deleteSelected = (event) => {
    const { deleteRelatedFiles } = event
    const transfersBeingDeleted = state.selectedTransfers
    state.deletingSelectedTransfers = false
    state.selectedTransfers = []
    deleteTransfers(transfersBeingDeleted)

  }

  const deleteTransfers = (transfersBeingDeleted) => {
    transfersBeingDeleted = state.transfers.filter(transfer =>
      transfersBeingDeleted.includes(transfer.id)
    ).map(({id}) => id)

    state.transfersBeingDeleted = state.transfersBeingDeleted.concat(transfersBeingDeleted)
    putio.deleteTransfers(transfersBeingDeleted).subscribe(() => {
      state.transfers = state.transfers.filter(transfer =>
        !state.transfersBeingDeleted.includes(transfer.id)
      )
      state.transfersBeingDeleted = []
      publish()
    })
    publish()
  }

  const publish = () => stateStream.onNext(state)
  publish()
  return stateStream;
}
