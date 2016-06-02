import Rx from 'rx-dom'
import putio from '../putio'

export default function(events){
  let stateStream = new Rx.ReplaySubject(1);

  events.subscribe( event => {
    if (event.type === 'auth:logout') {
      logout()
    }
  })

  const logout = () => {
    putio.logout()
    publish();
  }

  const reload = () => {
    putio.accountInfo().subscribe(
      creds => {
        stateStream.onNext(creds)
      },
      error => {
        console.warn('Error loading auth from putio')
        console.error(error);
        stateStream.onNext({error: error})
      }
    )
  }

  const publish = () => {
    if (putio.accessToken){
      stateStream.onNext({loading: true})
      reload()
    }else{
      stateStream.onNext(null)
    }
  }


  putio.login()
  publish();
  return stateStream;
}
