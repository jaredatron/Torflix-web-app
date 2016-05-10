import { stream as locationStream } from '../lib/Location'

import router from './router';
import HomePage from './pages/HomePage.jsx'

// The entire application state as a stream



// let manualLocationChangeStream = new Rx.ReplaySubject(1);
// manualLocationChangeStream.onNext();
// let popstateStream = Rx.Observable.fromEvent(window, 'popstate');

// window.setLocation = function(path){
//   history.pushState(null, null, path);
//   manualLocationChangeStream.onNext();
// }

// let locationChangeStream = Rx.Observable.merge(
//   manualLocationChangeStream, popstateStream
// ).map(()=>{
//   console.log('locationChangeStream fired')
//   return {
//     path:   location.pathname,
//     params: searchToObject(location.search),
//   }
// });

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
// appStateStream.onNext({
//   path: '/',
//   params: {},
//   page: HomePage,
// });

export default appStateStream
