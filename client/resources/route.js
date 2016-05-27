import location from './location'

import Router        from '../../lib/Router'
import NotFoundPage  from '../renderer/pages/NotFoundPage.jsx'
import HomePage      from '../renderer/pages/HomePage.jsx'
import TransfersPage from '../renderer/pages/TransfersPage.jsx'

let router = new Router

router.match('/',          HomePage);
router.match('/transfers', TransfersPage);
// router.match('/files',     router.redirectTo('/transfers'));
router.match('/*path',     NotFoundPage);


export default function route(events){
  return location(events).map( location => {
    console.log('routeStream fired', location);
    return router.routeFor(location);
  });
}
