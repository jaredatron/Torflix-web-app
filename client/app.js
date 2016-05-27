import renderer from './renderer.jsx';
import events from './events';
import State from './state';

const App = {

  events: events,

  emit: (event) => {
    event = typeof event === 'string'? { type: event } : event
    App.events.onNext(event)
  },

  render(DOMNode){
    renderer.render(DOMNode, this.state, this.emit);
  },
}

// import keypress  from './resources/keypress'


import now       from './resources/now'
import route     from './resources/route'
import transfers from './resources/transfers'

App.state = new State(App.events, {
  now: now,
  route: route,
  transfers: transfers,
})

Rx.Observable.fromEvent(window, 'keydown').subscribe(App.emit)

export default App

// debugging

window.App = App;

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
