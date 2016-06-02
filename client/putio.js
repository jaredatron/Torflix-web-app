import Putio from 'put.io'
import request from './request'



const putio = new Putio({
  clientId:    PUTIO_CLIENT_ID,
  secret:      PUTIO_APPLICATION_SECRET,
  oauthToken:  PUTIO_OAUTH_TOKEN,
  redirectURI: PUTIO_REDIRECT_URI,
  oAuthResponseType: 'token',
  request:     request,
})

putio.loggedIn = () => {
  return !!putio.accessToken
}

putio.login = () => {
  var matches = location.hash.match(/^#access_token=([^&]+)/)
  var accessToken
  if (matches){
    putio.accessToken = localStorage['putio.access_token'] = matches[1]
    history.replaceState("", document.title, window.location.pathname + window.location.search);
  }
  putio.accessToken = localStorage['putio.access_token']
}

putio.logout = () => {
  delete localStorage['putio.access_token']
  delete putio.accessToken
}

export default putio
