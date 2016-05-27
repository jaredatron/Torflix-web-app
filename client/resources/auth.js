import Rx from 'rx'
import putio from '../putio'

export default function(events){
  let state = {};
  let stateStream = new Rx.ReplaySubject(1);


  events.subscribe( event => {
    if (event.type === 'auth:logout') {
      putio.accessToken = null;
      update();
    }
  })

  let update = () => {
    if (putio.accessToken){
      stateStream.onNext({})
    }else{
      stateStream.onNext(null)
    }
  }

  update();
  return stateStream;
}
