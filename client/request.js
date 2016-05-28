import Rx from 'rx-dom'

export default function(settings){
  // if (settings.serverProxy){
  //   return
  // }else{
    return Rx.DOM.ajax(settings)
  // }
}

