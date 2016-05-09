import Router from '../lib/Router'
import NotFoundPage  from './pages/NotFoundPage.jsx'
import HomePage      from './pages/HomePage.jsx'
import TransfersPage from './pages/TransfersPage.jsx'


export default new Router(() => {
  this.match('/',          HomePage);
  this.match('/transfers', TransfersPage);
  this.match('/*',         NotFoundPage);
})

// export default (location) => {
//   let path = location.pathname;
//   console.log('ROUTER', path);
//   // let params = location.search; // TODO

//   let Page = (
//     (path === '/')          ? HomePage :
//     (path === '/transfers') ? TransfersPage :
//     NotFoundPage
//   );

//   return {
//     path: location.pathname,
//     params: {},
//     Page: Page,
//   }
// }
