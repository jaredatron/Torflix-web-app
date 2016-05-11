import { locationStream } from '../lib/Location'
import router from './router';
import { transfersStream } from './actions/transfers';

// The entire application state as a stream

let routeStream = locationStream.map(location => {
  console.log('routeStream fired', location);
  return router.routeFor(location);
});

let appStateStream = Rx.Observable.zip(
  locationStream,
  routeStream,
  // transfersStream,
  // transfersStream,
  function (location, route, transfers) {
    console.log('state update???')
    return {
      path:      location.path,
      params:    route.params,
      page:      route.page,
      transfers: transfers,
    }
  }
)

export default appStateStream
