import Rx from 'rx-dom'
import putio from '../putio'

export default function(events){
  let state = {}
  const stateStream = new Rx.ReplaySubject(1);
  const publish = () => { stateStream.onNext(state) }

  events.subscribe( event => {
    if (event.type === 'auth:logout') {
      logout()
    }
  })

  const logout = () => {
    putio.logout()
    state = {
      loggedIn: false,
      loading: false,
      loaded: false,
    }
    publish();
  }

  const update = () => {
    if (putio.loggedIn()){
      if (!state.loaded && !state.loading){
        loadAccountInfo()
        state = {
          loggedIn: true,
          loading: true,
          loaded: false,
        }
      }
    }else{
      state = {loggedIn: false}
    }
    publish()
  }

  const loadAccountInfo = () => {
    putio.getAccountInfo().subscribe(
      creds => {
        Object.assign(state,creds)
        state.loading = false
        state.loaded = true
        publish()
      },
      error => {
        console.warn('Error loading auth from putio')
        console.error(error);
        stateStream.onNext({error: error})
      }
    )
  }

  putio.login()
  update();
  return stateStream;
}
