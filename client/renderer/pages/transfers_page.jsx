import React from 'react'
import Page from '../page.js'
import Layout from '../components/layout.jsx'
import Link from '../components/link.jsx'
import Modal from '../components/modal.jsx'
import ConfirmationPrompt from '../components/confirmation_prompt.jsx'
import SelectableList from '../components/selectable_list.jsx'

export default class TransfersPage extends Page {

  onEnter(){
    // this.emit('transfers:load')
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
      <Transfers
        {...transfers}
        onDeleteTransfers={this.onDeleteTransfers}
      />
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

class Transfers extends React.Component {
  static contextTypes = {
    emit: React.PropTypes.func.isRequired
  }

  constructor(){
    super()
    this.deleteTransfers = this.deleteTransfers.bind(this)
  }

  deleteTransfers(transferIds){
    this.context.emit({
      type: 'transfers:delete',
      transferIds: transferIds,
    })
  }

  render(){
    const {
      loaded,
      transfersBeingDeleted,
    } = this.props

    if (!loaded) return <div>Loading...</div>

    const transfers = this.props.transfers.slice().reverse().map( transfer => {
      const beingDeleted = transfersBeingDeleted.includes(transfer.id)
      return {
        key: transfer.id,
        transfer: transfer,
        beingDeleted: beingDeleted,
        selectable: !beingDeleted,
      }
    })

    const props = {
      className: "transfers-list",
      members: transfers,
      memberComponent: Transfer,
      actions: [
        {
          name: 'delete',
          onClick: this.deleteTransfers,
        }
      ],
      orderings: ['createdAt']
    }

    return <SelectableList {...props} />
  }
}


class Transfer extends React.Component {
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
    return <div className={className}>
      <div>
        <input
          type="checkbox"
          checked={selected}
          tabIndex="-1"
          onChange={this.props.toggleSelected}
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
