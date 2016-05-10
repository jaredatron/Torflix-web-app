import Router        from '../lib/Router'
import NotFoundPage  from './pages/NotFoundPage.jsx'
import HomePage      from './pages/HomePage.jsx'
import TransfersPage from './pages/TransfersPage.jsx'

const redirectTo = (path, params) => {
  params = params || {};
  return () => {
    RedirectComponent({path: path, params: params});
  };
};

export default new Router( router => {
  router.match('/',          HomePage);
  router.match('/transfers', TransfersPage);
  router.match('/*',         NotFoundPage);
});
