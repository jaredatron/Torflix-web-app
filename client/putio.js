import Putio from 'put.io'
import request from './request'

var matches = location.hash.match(/^#access_token=([^&]+)/)
var accessToken
if (matches){
  accessToken = localStorage['putio.access_token'] = matches[1]
}else{
  accessToken = localStorage['putio.access_token']
}

const putio = new Putio({
  clientId:    PUTIO_CLIENT_ID,
  secret:      PUTIO_APPLICATION_SECRET,
  oauthToken:  PUTIO_OAUTH_TOKEN,
  redirectURI: PUTIO_REDIRECT_URI,
  oAuthResponseType: 'token',
  accessToken: accessToken,
  request:     request,
})

export default putio
