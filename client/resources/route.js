import location from './location'

import Router              from '../../lib/Router'
import NotFoundPage        from '../renderer/pages/not_found_page.jsx'
import HomePage            from '../renderer/pages/home_page.jsx'
import SearchPage          from '../renderer/pages/search_page.jsx'
import TransfersPage       from '../renderer/pages/transfers_page.jsx'
import FilesPage           from '../renderer/pages/files_page.jsx'
import PlayVideoPage       from '../renderer/pages/play_video_page.jsx'
import TvShowsPage         from '../renderer/pages/tv_shows_page.jsx'
import TorrentDownloadPage from '../renderer/pages/torrent_download_page.jsx'

let router = new Router

router.match('/',                            HomePage);
router.match('/transfers',                   TransfersPage);
router.match('/files',                       FilesPage);
router.match('/files/:fileId',               FilesPage);
router.match('/play/:fileId',                PlayVideoPage);
router.match('/tv-shows',                    TvShowsPage);
router.match('/tv-shows/:tvShowName',        TvShowsPage);
router.match('/search',                      SearchPage);
router.match('/search/*query',               SearchPage);
router.match('/download/torrent/:torrentId', TorrentDownloadPage);
router.match('/*path',                       NotFoundPage);


export default function route(events){
  return location(events).map((location) => {
    let route = router.routeFor(location)
    route.location = location
    return route
  })
}
