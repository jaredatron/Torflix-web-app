import React from 'react'
import ReactDOM from 'react-dom'
import Link from './link.jsx'

export default class Alerts extends React.Component {
  static contextTypes = {
    state: React.PropTypes.object.isRequired
  }

  render() {
    const alertsState = this.context.state.alerts
    const alerts = Object.keys(alertsState).map(alertId => {
      const alert = alertsState[alertId]
      return <Alert key={alertId} alert={alert} />
    })
    return <div className="alerts">
      <div className="alerts-container">
        {alerts}
      </div>
    </div>
  }
}


class Alert extends React.Component {
  render(){
    const { alert } = this.props
    const dismissAlertEvent = {
      type: 'dismiss-alert',
      alertId: alert.id,
    }
    return <div className="alert">
      <span>{alert.message}</span>
      <Link className="close-alert" emit={dismissAlertEvent}>X</Link>
    </div>
  }
}
