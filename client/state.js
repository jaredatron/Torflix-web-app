import { timeStream } from './resources/time'
import { routeStream } from './resources/route'
import { transfersStream } from './resources/transfers';

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
