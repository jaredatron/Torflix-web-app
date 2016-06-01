import request from './request'
import URI from 'urijs'

const TorrentSearch = {
  search(query){
    let url = URI('http://torrentz.com/search').query({q: query}).toString()
    return request({
      serverProxy: true,
      method: 'GET',
      url: url,
    }).map(response => {
      let html = document.createElement('html')
      html.innerHTML = response.text
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
    })
  }
}

export default TorrentSearch
