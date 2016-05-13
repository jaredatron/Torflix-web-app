import { locationStream } from '../lib/Location'
import router from './router';
import { transfersStream } from './actions/transfers';

// The entire application state as a stream

let routeStream = locationStream.map(location => {
  console.log('routeStream fired', location);
  return router.routeFor(location);
});


let secondsStream = Rx.Observable.interval(1000)
  .timeInterval()
  .pluck('value')
  // .map(()=>{ return new Date; })
  // .subscribe((x)=>{
  //   console.log('time?', x);
  // })

let fiveSecondsString = Rx.Observable.interval(5000)
  .timeInterval()
  .pluck('value')

Rx.Observable.combineLatest(
  secondsStream, fiveSecondsString
).subscribe( data => {
  console.log('data', data);
});

let appStateStream = Rx.Observable.combineLatest(
  // timeStream,
  locationStream,
  routeStream,
  // transfersStream,
  // transfersStream,
  // function (now, location, route, transfers) {
  function (location, route, transfers) {
    let state = {
      // now:       now,
      path:      location.path,
      params:    route.params,
      page:      route.page,
      transfers: transfers,
    }
    console.log('stateStream fired', arguments, state);
    return state;
  }
)

// TODO user requsetAnimationFrame scheduler

export default appStateStream

appStateStream.subscribe((state)=>{
  console.log('IND STATE STREAM SUBSCRIBER', state);
});
