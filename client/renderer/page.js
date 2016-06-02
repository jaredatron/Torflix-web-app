export default class Page {

  onEnter(props){
    console.log('Page#onEnter', this)
  }

  beforeRender(props){
    console.log('Page#beforeRender', this)
  }

  afterRender(props){
    console.log('Page#afterRender', this)
  }

  onExit(props){
    console.log('Page#onExit', this)
  }

}
