import Rx from 'rx'
import { timeStream } from './resources/time'
// import { locationStream } from './resources/location'
import { routeStream } from './resources/route'
// import { transfersStream } from './resources/transfers'



// var state = Rx.Observable.create(function (observer) {

//   timeStream

//   observer.onNext({});
//   // observer.onCompleted();

//   // Note that this is optional, you do not have to return this if you require no cleanup
//   return function () {
//     console.log('EVENT STREAM SHUTDOWN');
//   };
// });

let state = Rx.Observable.combineLatest(
  timeStream,
  routeStream,
).map(
  ([
    now,
    route,
  ])=>{
  return {
    now: now,
    path: route.path,
    params: route.params,
    page: route.page,
  }
})


export default state



// debugger

// // every stream must be an active push stream
// // all streams should be buffered by requestAnimationFrame before hitting React

// // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/forkjoin.md
// // Runs all observable sequences in parallel and collect their last elements.


// let appStateStream = Rx.Observable.combineLatest(
//   routeStream,
//   transfersStream,
//   function(route, transfers){
//     return {
//       time:      time,
//       path:      route.path,
//       params:    route.params,
//       page:      route.page,
//       transfers: transfers
//     }
//   }
// );
// // TODO user requsetAnimationFrame scheduler

// export default appStateStream

// appStateStream.subscribe((state)=>{
//   console.log('IND STATE STREAM SUBSCRIBER', state);
// });
