import Rx from 'rx-dom'
import request from './request'
import URI from 'urijs'

const TORRENTZ_HOST = 'http://Torrentz.eu'

const get = (url) => {
  return request({
    serverProxy: true,
    method: 'GET',
    url: url,
  }).map(response => {
    const html = document.createElement('html')
    html.innerHTML = response.text
    return html
  })

}

const TorrentSearch = {
  search(search){
    return getSearchResults(search)
  },

  getMagnetLink(torrentId){
    let state = {
      torrentId: torrentId,
      error: null,
      errorMessage: null,
      trackers: null,
      magnetLink: null,
    }
    return Rx.Observable.create( observer => {
      const publish = () => { observer.onNext(state) }

      var getTrackersForTorrentIdSubscription = null
      var getMagnetLinkForTrackersSubscription = null

      getTrackersForTorrentId(torrentId).subscribe(
        results => {
          // throw new Error('ass')
          state.torrentName = results.torrentName;
          state.trackers = results.trackers;
          publish()
        },
        error => {
          throw error
        },
        complete => {
          getMagnetLinkForTrackersSubscription = getMagnetLinkForTrackers(state.trackers).subscribe(
            magnetLink => {
              state.magnetLink = magnetLink
              publish()
            },
            error => {
              throw error
            },
            complete => {
              publish()
              observer.onCompleted()
            }
          )
        }
      )

      return () => {
        if (getTrackersForTorrentIdSubscription) getTrackersForTorrentIdSubscription.dispose()
        if (getMagnetLinkForTrackersSubscription) getMagnetLinkForTrackersSubscription.dispose()
      }

    })
  }
}

export default TorrentSearch

// requests

const getSearchResults = ({query, order, verified}) => {
  let path  = verified ? '/verified' : '/search'
  path += (
    order === 'size'   ? 'S' :
    order === 'date'   ? 'A' :
    order === 'rating' ? 'N' :
    order === 'peers'  ? '' : ''
  )
  let url = URI(TORRENTZ_HOST+path).query({q: query}).toString()
  return get(url).map(parseSearchResults)
}

const getTrackersForTorrentId = (torrentId) => {
  return get(TORRENTZ_HOST+'/'+torrentId).map(parseTorrentTrackersPage)
}

const getMagnetLinkForTrackers = (trackers) => {
  var requests = []
  trackers.forEach(url => {
    let domain = URI(url).domain()
    let parser = trackerParsers[domain] || trackerParsers.default
    requests.push(parser(url))
  })

  var subscriptions = []
  return Rx.Observable.create( observer => {
    requests.forEach(request => {
      subscriptions.push(request.subscribe(
        magnetLink => {
          if (magnetLink){
            subscriptions.forEach(subscription => { subscription.dispose() })
            observer.onNext(magnetLink)
            observer.onCompleted()
          }
        },
        error => {
          console.warn('error parsing magnet link from tracker')
          console.error(error)
        },
      ))
    })
  })
}

const pluckFirstMagnetLink = html => {
  return html.querySelector('a[href^="magnet:"]').href
}

const trackerParsers = {
  'default': (url) => {
    return get(url).map(pluckFirstMagnetLink)
  },
  'kat.cr': (url) => {
    return get(url).map( html => {
      return html.querySelector('a[title="Magnet link"]').href
    })
  },
  'torrenthound.com': (url) => {
    return get(url).map( html => {
      return html.querySelector('a[title="Magnet download"]').href
    })
  },
  // 'rarbg.com': (url) => {
  //   return get(url).map(pluckFirstMagnetLink)
  // },
  // 'www.torlock.com': (url) => {
  //   return get(url).map( html => {
  //     debugger
  //   })
  // },
  // 'www.monova.org': (url) => {
  //   return get(url).map( html => {
  //     debugger
  //   })
  // },
  // 'www.seedpeer.me': (url) => {
  //   return get(url).map( html => {
  //     debugger
  //   })
  // },
  // 'www.torrentdownloads.me': (url) => {
  //   return get(url).map( html => {
  //     debugger
  //   })
  // },
  // 'www.torrentfunk.com': (url) => {
  //   return get(url).map( html => {
  //     debugger
  //   })
  // },
  // 'www.limetorrents.cc': (url) => {
  //   return get(url).map( html => {
  //     debugger
  //   })
  // },
  // 'torrentproject.se': (url) => {
  //   return get(url).map( html => {
  //     debugger
  //   })
  // },
}


// parsers

const parseSearchResults = html => {
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

const parseTorrentTrackersPage = html => {
  let torrentName = html.querySelector('.download > h2 > span').innerText
  let links = html.querySelectorAll('.download > dl > dt > a[href][rel=e]')
  let trackers = [].map.call(links, link => link.href)
  return { torrentName, trackers }
}

