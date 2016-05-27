import Putio from 'put.io'

var matches = location.hash.match(/^#access_token=([^&]+)/)
const accessToken = matches ? matches[1] : null

const putio = new Putio({
  clientId:    PUTIO_CLIENT_ID,
  secret:      PUTIO_APPLICATION_SECRET,
  oauthToken:  PUTIO_OAUTH_TOKEN,
  redirectURI: PUTIO_REDIRECT_URI,
  oAuthResponseType: 'token',
  accessToken: accessToken,
})

export default putio
