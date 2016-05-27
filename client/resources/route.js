import location from './location'

import Router        from '../../lib/Router'
import NotFoundPage  from '../renderer/pages/not_found_page.jsx'
import HomePage      from '../renderer/pages/home_page.jsx'
import TransfersPage from '../renderer/pages/transfers_page.jsx'

let router = new Router

router.match('/',          HomePage);
router.match('/transfers', TransfersPage);
// router.match('/files',     router.redirectTo('/transfers'));
router.match('/*path',     NotFoundPage);


export default function route(events){
  return location(events).map( location => router.routeFor(location) )
}
