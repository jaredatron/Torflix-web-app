import HomePage from './pages/HomePage.jsx'

export default (location) => {
  return {
    path: location.pathname,
    params: {},
    Page: HomePage,
  }
}
