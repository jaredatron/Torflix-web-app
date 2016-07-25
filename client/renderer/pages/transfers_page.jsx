import React from 'react'
import Page from '../page.js'
import Layout from '../components/layout.jsx'
import Link from '../components/link.jsx'
import Modal from '../components/modal.jsx'
import ConfirmationPrompt from '../components/confirmation_prompt.jsx'

export default class TransfersPage extends Page {

  onEnter(){
    this.emit('transfers:startPolling')
  }

  onExit(){
    this.emit('transfers:stopPolling')
  }

  render(props) {
    const { torrentDownload, transfers } = props

    return <Layout>
      <ActionConfirmationPrompt transfers={transfers} />
      <TorrentDownloads {...torrentDownload} />
      <Transfers {...transfers} />
    </Layout>
  }

}


const TorrentDownloads = ({ids, downloads}) => {
  const downloadComponents = ids.map(id => {
    return <TorrentDownload key={id} id={id} details={downloads[id]} />
  })
  return <div>{downloadComponents}</div>
}

const TorrentDownload = ({id, details}) => {
  const torrentName = details.torrentName || details.name || torrentId
  const stateDescription = (
    details.error ? 'ERROR '+details.error :
    details.magnetLink ? 'Adding magnet link to Put.io' :
    details.trackers ? 'Searching for magnet link' :
    'Searching for trackers'
  )
  return <div className="transfers-torrent-download">
    <div><strong>{torrentName}</strong></div>
    <div><small>{stateDescription}</small></div>
  </div>
}

const Transfers = (props) => {
  const {
    loaded,
    transfers,
    selectedTransfers,
    transfersBeingDeleted,
  } = props

  if (!loaded) return <div>Loading...</div>

  const transferComponents = transfers.slice().reverse().map((transfer) => {
    const selected = selectedTransfers.includes(transfer.id)
    const beingDeleted = transfersBeingDeleted.includes(transfer.id)
    return <Transfer
      key={transfer.id}
      transfer={transfer}
      selected={selected}
      beingDeleted={beingDeleted}
    />
  })

  return <div className="transfers-list">{transferComponents}</div>
}


class Transfer extends React.Component {
  static contextTypes = {
    emit: React.PropTypes.func.isRequired
  }

  constructor(){
    super()
    this.toggleSelected = this.toggleSelected.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
  }

  toggleSelected(){
    this.context.emit({
      type: 'transfers:toggleTransferSelect',
      transfer: this.props.transfer,
    })
  }

  focusNextElement(){
    let nextElement = this.refs.container.nextElementSibling
    while (!nextElement.matches('[tabIndex]'))
      nextElement = nextElement.nextElementSibling
    nextElement.focus();
  }

  focusPreviousElement(){
    let previous = this.refs.container.previousSibling
    while (!previous.matches('[tabIndex]'))
      previous = previous.previousSibling
    previous.focus();
  }

  onKeyPress(event){
    const { key } = event
    if (key === 'x'){
      if (this.props.beingDeleted) return;
      this.toggleSelected()
    }
    if (key === 'j'){
      this.focusNextElement()
    }
    if (key === 'k'){
      this.focusPreviousElement()
    }
    if (key === 'd'){
      this.context.emit('transfers:confirmDeleteSelected')
    }
  }

  render(){
    const { transfer, selected, beingDeleted } = this.props
    let className = "transfers-list-transfer"

    if (selected)
      className += ' transfers-list-transfer-selected'

    if (beingDeleted)
      className += ' transfers-list-transfer-being-deleted'

    const name = !beingDeleted && transfer.file_id ?
      <Link path={`/files/${transfer.file_id}`} tabIndex="-1">
        {transfer.name}
      </Link> :
      <div>{transfer.name}</div>

    const tabIndex = beingDeleted ? undefined : 0

    return <div ref="container" className={className} tabIndex={tabIndex} onKeyPress={this.onKeyPress}>
      <div>
        <input
          type="checkbox"
          checked={selected}
          tabIndex="-1"
          onChange={this.toggleSelected}
          disabled={beingDeleted}
        />
      </div>
      <div>
        {name}
        <div>
          <small>{transfer.status_message}</small>
        </div>
      </div>
    </div>
  }
}


const ActionConfirmationPrompt = ({ transfers }) => {
  if (transfers.deletingSelectedTransfers){
    return <DeleteTransfersConfirmationPrompt transfers={transfers} />
  }
  return null
}

class DeleteTransfersConfirmationPrompt extends React.Component {
  static contextTypes = {
    emit: React.PropTypes.func.isRequired
  }

  constructor(){
    super()
    this.onConfirmation = this.onConfirmation.bind(this)
    this.onCancelation = this.onCancelation.bind(this)
  }

  onConfirmation(){
    this.context.emit({
      type: 'transfers:deleteSelected',
      deleteRelatedFiles: this.refs.deleteRelatedFiles.checked,
    })
  }

  onCancelation(){
    this.context.emit('transfers:cancelDelete')
  }

  render(){
    const { transfers } = this.props

    const selectedTransfers = transfers.transfers.filter(transfer =>
      transfers.selectedTransfers.includes(transfer.id)
    )
    const count = selectedTransfers.length
    const question = <div>
      <h3>Are you sure you want to delete the following transfers?</h3>
      <ol>{selectedTransfers.map(({id}) => <li key={id}>{id}</li>)}</ol>
      <h4>
        <span>Also delete related files?</span>
        <input type="checkbox" defaultSelected={false} ref="deleteRelatedFiles" />
      </h4>
    </div>
    return <ConfirmationPrompt
      question={question}
      confirmation={`Delete ${count} transfers`}
      cancelation="cancel"
      onConfirmation={this.onConfirmation}
      onCancelation={this.onCancelation}
      >
    </ConfirmationPrompt>
  }
}
