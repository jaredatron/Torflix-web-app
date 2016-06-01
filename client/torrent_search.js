import request from './request'
import URI from 'urijs'

const TORRENTZ_HOST = 'http://torrentz.com'

const TorrentSearch = {
  search(query){
    let url = URI(TORRENTZ_HOST+'/search').query({q: query}).toString()
    return request({
      serverProxy: true,
      method: 'GET',
      url: url,
    }).map(parseSearchResults)
  },

  getTorrent(torrentId){
    return request({
      serverProxy: true,
      method: 'GET',
      url: TORRENTZ_HOST+'/'+torrentId,
    }).map(findTorrentFromTrackersList)
  }
}

export default TorrentSearch

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

const findTorrentFromTrackersList = response => {
  let html = parseHTML(response.text)
  var links = html.querySelectorAll('.download > dl > dt > a[href][rel=e]')
  links = [].map.call(links, link => link.href)
  debugger
}
