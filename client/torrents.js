import Rx from 'rx-dom'
import request from './request'
import URI from 'urijs'

const TORRENTZ_HOST = 'http://torrentz.com'

const TorrentSearch = {
  search(query){
    return getSearchResults(query)
  },

  getMagnetLink(torrentId){
    // return getTorrentTrackersPage(torrentId)
    //   .map(parseTorrentTrackersPage)
    //   .map(findMagnetLinkFromTrackers)

    let state = {
      torrentId: torrentId,
      error: null,
      errorMessage: null,
      trackers: null,
    }
    return Rx.Observable.create( observer => {
      observer.onNext(state)

      let getTrackersForTorrentIdSubscription = getTrackersForTorrentId(torrentId).subscribe(
        results => {
          state.torrentName = results.torrentName;
          state.trackers = results.trackers;
          observer.onNext(state)
        },

        error => {
          console.error(error)
          state.error = error;
          state.errorMessage = 'unable to find trackers'
          observer.onCompleted(state)
        }
      )

      return () => {
        getTrackersForTorrentIdSubscription.dispose()
      }

    })
  }
}

export default TorrentSearch

// requests

const getSearchResults = (query) => {
  let url = URI(TORRENTZ_HOST+'/search').query({q: query}).toString()
  return request({
    serverProxy: true,
    method: 'GET',
    url: url,
  }).map(parseSearchResults)
}

const getTrackersForTorrentId = (torrentId) => {
  return request({
    serverProxy: true,
    method: 'GET',
    url: TORRENTZ_HOST+'/'+torrentId,
  }).map(parseTorrentTrackersPage)
}

const findMagnetLinkFromTrackers = (trackers) => {
  debugger
  return null
}


// parsers

const parseHTML = innerHTML => {
  const html = document.createElement('html')
  html.innerHTML = innerHTML
  return html
}

const parseSearchResults = response => {
  let html = parseHTML(response.text)
  let results = [];
  [].forEach.call(html.querySelectorAll('.results > dl'), node => {
    let result = {};
    try{
      if (node.innerText.includes('removed in compliance')) return;
      result.name = node.querySelector('dt > a').innerText
      result.href = node.querySelector('dt > a').href
      result.id = result.href.match(/\/([^\/]+)$/)[1]
      result.rating = node.querySelector('dd > .v').innerText

      let createdAtNode = node.querySelector('dd > .a > span')
      if (createdAtNode){
        result.createdAt = createdAtNode.title
        result.createdAtAgo = createdAtNode.innerText
      }
      let sizeNode = node.querySelector('dd > .s')
      if (sizeNode) result.size = sizeNode.innerText
      result.seeders = node.querySelector('dd > .u').innerText
      result.leechers = node.querySelector('dd > .d').innerText
      results.push(result)
    }catch(error){
      console.warn('failed to parse torrentz.com result html', node)
      console.error(error)
    }
  })
  return results
}

const parseTorrentTrackersPage = response => {
  let html = parseHTML(response.text)
  let torrentName = html.querySelector('.download > h2 > span').innerText
  let links = html.querySelectorAll('.download > dl > dt > a[href][rel=e]')
  let trackers = [].map.call(links, link => link.href)
  return { torrentName, trackers }
}

