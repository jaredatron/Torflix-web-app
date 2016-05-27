import renderer from './renderer.jsx';
import state from './state';

const App = {

  eventsStream: {},

  state: state,

  emit(event){
    this.events.onNext(event)
  },

  render(DOMNode){
    renderer.render(DOMNode, state, this.emit);
  },
}

export default App
