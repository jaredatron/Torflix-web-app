import { timeStream } from './resources/time'
import { routeStream } from './resources/route'
import { transfersStream } from './resources/transfers';


// https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/forkjoin.md
// Runs all observable sequences in parallel and collect their last elements.


let appStateStream = Rx.Observable.combineLatest(
  routeStream,
  transfersStream,
  function(route, transfers){
    return {
      time:      time,
      path:      route.path,
      params:    route.params,
      page:      route.page,
      transfers: transfers
    }
  }
);
// TODO user requsetAnimationFrame scheduler

export default appStateStream

appStateStream.subscribe((state)=>{
  console.log('IND STATE STREAM SUBSCRIBER', state);
});
