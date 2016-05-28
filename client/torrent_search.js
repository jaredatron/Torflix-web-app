import request from './request'
import URI from 'urijs'

const TorrentSearch = {
  search(query){
    let url = URI('http://torrentz.com/search').query({q: query})
    return request({
      serverProxy: true,
      method: 'GET',
      url: url,
    })
  }
}

export default TorrentSearch
