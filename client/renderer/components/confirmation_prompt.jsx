import React from 'react'
import ReactDOM from 'react-dom'
import Modal from './modal.jsx'

export default class ConfirmationPrompt extends React.Component {

  componentDidMount(){
    this.refs.cancelationButton.focus()
  }

  render(){
    const {
      question,
      confirmation,
      cancelation,
      onConfirmation,
      onCancelation,
    } = this.props

    return <Modal>
      <div className="confirmation-prompt">
        <div>
          {question}
        </div>
        <div className="confirmation-prompt-controls">
          <button
            ref="cancelationButton"
            onClick={onCancelation}
          >{cancelation||'cancel'}</button>
          <button
            ref="confirmationButton"
            onClick={onConfirmation}
          >{confirmation||'Confirm'}</button>
        </div>
      </div>
    </Modal>
  }
}
