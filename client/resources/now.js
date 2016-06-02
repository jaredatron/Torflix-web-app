import Rx from 'rx-dom'

export default function now(events){
  const stream = new Rx.ReplaySubject(1)
  stream.onNext()

  Rx.Observable.interval(1000).forEach( () => stream.onNext() )

  return stream.map(()=> new Date)
}
