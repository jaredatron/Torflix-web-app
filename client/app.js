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
    this.state.observeOn(Rx.Scheduler.requestAnimationFrame).subscribe(
      state => {
        this._state = state
        let props = {
          emit: this.emit,
          state: state,
        }
        this.instance = renderer.render(DOMNode, props);
        // this.instance = ReactDOM.render(React.createElement(App, props), DOMNode);
      },
      error => {
        console.warn('App Render Error');
        console.error(error);
      },
      () => {
        throw new Error('state stream should never complete');
      },
    );

  },
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
