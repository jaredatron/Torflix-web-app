import Rx from 'rx-dom'
import renderer from './renderer.jsx';
import events from './events';
import State from './state';
import LoginPage from './renderer/pages/login_page.jsx'

const App = {
  renderer: renderer,
  events: events,

  emit: (event) => {
    event = typeof event === 'string'? { type: event } : event
    App.events.onNext(event)
  },

  start(DOMNode){
    App.DOMNode = DOMNode
    this.sub1 = App.state.forEach( state => App.setState(state) )
    this.sub2 = App.state.observeOn(Rx.Scheduler.requestAnimationFrame).subscribe(
      state => { App.render() },
      error => {
        console.warn('App Render Error')
        console.error(error)
        throw error
      },
      complete => {
        throw new Error('state stream should never complete');
      },
    );
  },

  stop(){
    this.sub1 && this.sub1.dispose()
    this.sub2 && this.sub2.dispose()
  },

  setState(state){
    App._state = state

    const Page = state.auth.loggedIn ? state.route.page : LoginPage

    if (!(App.page instanceof Page)){
      if (App.page) App.page.onExit(state)
      App.page = new Page
      App.page.emit = App.emit
      App.page.onEnter(state)
    }
    App.page.onStateChange(state)
  },

  render(){
    const state = App._state
    App.page.beforeRender(state)
    App.instance = renderer.render(App.DOMNode, App.emit, App.page, state);
    App.page.afterRender(state)
  }
}

// FOR DEBUGGING
// App.events.subscribe(event => {
//   console.log('EVENT', event.type, event)
// })
// /FOR DEBUGGING


// import keypress  from './resources/keypress'


import now       from './resources/now'
import route     from './resources/route'
import auth      from './resources/auth'
import transfers from './resources/transfers'
import files     from './resources/files'
import tvShows   from './resources/tv_shows'
import search    from './resources/search'
import torrentDownload from './resources/torrent_download'

App.state = new State(App.events, {
  now,
  route,
  auth,
  transfers,
  files,
  tvShows,
  search,
  torrentDownload,
})

// Rx.Observable.fromEvent(window, 'keydown').subscribe(App.emit)

export default App



// debugging

window.App = App;

import putio from './putio'
App.putio = putio



