import Rx from 'rx-dom'
import request from '../request'

export default function(events){
  let state = {}
  let stateStream = new Rx.ReplaySubject(1)
  const publish = () => stateStream.onNext(state)

   events.subscribe( event => {
    if (event.type === 'tv-shows:load') return loadTvShows()
  })

  const loadTvShows = () => {
    if (state.loading) return
    state.loading = true
    publish()
    request({
      serverProxy: true,
      method: 'GET',
      url: 'https://eztv.ag/showlist/'
    }).subscribe(
      response => {
        state.tvShows = parseTvShows(response.text)
        state.loading = false
        publish()
      },
      error => {
        state.error = error
        publish()
      },
      complete => {

      }
    )
  }


  publish()
  return stateStream;
}


const parseTvShows = (html) => {
  var doc = document.createElement('html')
  doc.innerHTML = html

  const tableRows = doc.querySelectorAll('table.forum_header_border tbody tr[name=hover]')
  const tvShows = [].map.call(tableRows, (tr) => {
    const eztvHref = tr.querySelector('a').href
    const id = eztvHref.match(/shows\/(\d+)\//)[1]
    return {
      id: id,
      name: tr.querySelector('td').innerText,
      eztvHref: eztvHref,
    }
  })
  return tvShows
}
