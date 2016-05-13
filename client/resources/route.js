import { locationStream } from './location'

let routeStream = locationStream.map( location => {
  console.log('routeStream fired', location);
  return router.routeFor(location);
});

export { routeStream }
