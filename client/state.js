import Rx from 'rx'
// import now from './resources/now'
// import { routeStream } from './resources/route'
// // import { transfersStream } from './resources/transfers'


const State = (events, spec) => {
  console.log('State Constructor', events, spec);
  for (var prop in spec){
    spec[prop] = spec[prop](events)
  }
  return combineLatestAsObject(spec)
}

export default State

// // let state = Rx.Observable.combineLatest(
// //   timeStream,
// //   routeStream,
// // ).map(
// //   ([
// //     now,
// //     route,
// //   ])=>{
// //   return {
// //     now: now,
// //     path: route.path,
// //     params: route.params,
// //     page: route.page,
// //   }
// // })

// let state = combineLatestAsObject({
//   now: now.stream
// })

// export default state


function combineLatestAsObject(spec){
  var props = []
  var streams = []
  for (var prop in spec){
    props.push(prop)
    streams.push(spec[prop])
  }
  return Rx.Observable.combineLatest(...streams).map((values) => {
    let object = {};
    for (var i = 0; i < props.length; i++) {
      object[props[i]] = values[i];
    }
    return object;
  });
}


// // debugger

// // // every stream must be an active push stream
// // // all streams should be buffered by requestAnimationFrame before hitting React

// // // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/forkjoin.md
// // // Runs all observable sequences in parallel and collect their last elements.


// // let appStateStream = Rx.Observable.combineLatest(
// //   routeStream,
// //   transfersStream,
// //   function(route, transfers){
// //     return {
// //       time:      time,
// //       path:      route.path,
// //       params:    route.params,
// //       page:      route.page,
// //       transfers: transfers
// //     }
// //   }
// // );
// // // TODO user requsetAnimationFrame scheduler

// // export default appStateStream

// // appStateStream.subscribe((state)=>{
// //   console.log('IND STATE STREAM SUBSCRIBER', state);
// // });
