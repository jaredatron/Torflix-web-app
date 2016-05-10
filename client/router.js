import Router        from '../lib/Router'
import NotFoundPage  from './pages/NotFoundPage.jsx'
import HomePage      from './pages/HomePage.jsx'
import TransfersPage from './pages/TransfersPage.jsx'

export default new Router( router => {
  router.match('/',          HomePage);
  router.match('/transfers', TransfersPage);
  // router.match('/files',     router.redirectTo('/transfers'));
  router.match('/*path',     NotFoundPage);
});
