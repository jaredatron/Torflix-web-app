import renderer from './renderer.jsx';
import events from './events';
import State from './state';
import now from './resources/now'
import route from './resources/route'

const App = {

  events: events,

  emit: (event) => {
    App.events.onNext(event)
  },

  render(DOMNode){
    renderer.render(DOMNode, this.state, this.emit);
  },
}



App.state = new State(App.events, {
  now: now,
  route: route,
})

App.state.subscribe(
  state => {
    console.log("STATE:", state)
  }
)

export default App
