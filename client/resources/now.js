import Rx from 'rx'

export default function now(events){
  const state = Rx.Observable.interval(100)
    .timeInterval()
    .map(()=> new Date)

  // events.subscribe()

  return state
}
