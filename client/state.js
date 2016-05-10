import { stream as locationStream } from '../lib/Location'

import router from './router';
import HomePage from './pages/HomePage.jsx'

// The entire application state as a stream

let routeStream = locationStream.map(location => {
  console.log('routeStream fired', location);
  return router.routeFor(location);
});

let appStateStream = Rx.Observable.zip(
  locationStream,
  routeStream,
).map((results) => {
  let [location, route] = results;
  return {
    path: location.path,
    params: route.params,
    page: route.page,
  }
})

export default appStateStream
