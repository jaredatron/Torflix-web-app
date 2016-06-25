import Rx from 'rx-dom'
import request from '../request'

export default (events) => {
  let state = {}
  let stateStream = new Rx.ReplaySubject(1)
  const publish = () => stateStream.onNext(state)

  events.subscribe( event => {
    if (event.type === 'alert')         return createAlert(event.message)
    if (event.type === 'dismiss-alert') return dismissAlert(event.alertId)
  })

  let alertIdSequence = 0
  const createAlert = (alert) => {
    const timeout = (1000 * 10); // seconds
    const alertId = alertIdSequence++;
    state[alertId] = {
      id: alertId,
      message: alert,
    }
    publish()
    setTimeout(()=>{ dismissAlert(alertId) }, timeout)
  }

  const dismissAlert = (alertId) => {
    delete state[alertId]
    publish()
  }

  publish()
  return stateStream;
}
