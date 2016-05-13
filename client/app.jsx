import renderer from './renderer';
import state from './state';

const App = {

  eventsStream: {},

  state: state,

  render(DOMNode){
    this.stateSubscription = stateStream.subscribe(
      state => {
        renderer.render(DOMNode, state);
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

export default App
