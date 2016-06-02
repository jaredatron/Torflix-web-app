import Rx from 'rx-dom'
import renderer from './renderer.jsx';
import events from './events';
import State from './state';

const App = {

  events: events,

  emit: (event) => {
    event = typeof event === 'string'? { type: event } : event
    App.events.onNext(event)
  },

  start(DOMNode){
    this.DOMNode = DOMNode
    this.state.observeOn(Rx.Scheduler.requestAnimationFrame).subscribe(
      state => { this.setState(state) },
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

  setState(state){
    this._state = state
    this._render(state)
  },

  _render(state){
    let props = {
      emit: this.emit,
      state: state,
    }
    let Page = state.route.page
    if (!this.page || !(this.page instanceof Page)){
      if (this.page) this.page.onExit()
      this.page = new Page
      this.page.onEnter()
    }
    // this.page.beforeRender()
    state.page = this.page
    this.instance = renderer.render(this.DOMNode, props);
    // this.page.afterRender()
  }
}

// import keypress  from './resources/keypress'


import now       from './resources/now'
import route     from './resources/route'
import auth      from './resources/auth'
import transfers from './resources/transfers'
import search    from './resources/search'
import torrentDownload from './resources/torrent_download'

App.state = new State(App.events, {
  now: now,
  route: route,
  auth: auth,
  transfers: transfers,
  search: search,
  torrentDownload: torrentDownload,
})

// Rx.Observable.fromEvent(window, 'keydown').subscribe(App.emit)

export default App



// debugging

window.App = App;

import putio from './putio'
App.putio = putio

App.state.subscribe(
  state => {
    // console.log("STATE:", state)
  }
)

App.events.subscribe(
  event => {
    console.log('EVENT', event)
  }
)
