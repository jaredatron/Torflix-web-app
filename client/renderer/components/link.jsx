import React from 'react';
import ReactDOM from 'react-dom';
import { pathAndParamsToHref, parseUri } from '../../resources/location'

/*

  inherit

  <Link href="http://www.google.com">google</Link>
  <Link path="/search/House+MD">google</Link>
  <Link path="/search/House+MD" params={{verified:true})>google</Link>
  <Link params={{verified:true})  inheritParams>verified</Link>
  <Link params={{verified:false}) inheritParams>unverified</Link>
  <Link path="/search/tvshows">tvshows</Link>
  <Link path="/search/movies" >movies</Link>

*/
export default class Link extends React.Component {

  static PropTypes = {
    href: React.PropTypes.string,
    path: React.PropTypes.string,
    props: React.PropTypes.object,
    onClick: React.PropTypes.func,
    inheritParams: React.PropTypes.bool,
  }

  static defaultProps = {
    inheritParams: true,
  }

  static contextTypes = {
    emit: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    if (this.props.onClick){
      this.props.onClick(event);
      return false;
    }

    const { state, emit } = this.context
    const { location } = state

    if (this.props.emit){
      emit(this.props.emit)
      event.preventDefault()
      return false;
    }

    if (this.props.onClick){
      this.props.onClick(event)
      event.preventDefault()
      return false;
    }

    if (this.props.href || this.props.path || this.props.params){
      const newLocation = parseUri(event.target.href)

      if (newLocation.domain !== location.domain) return true

      emit({
        type: 'setLocation',
        location: newLocation,
        replace: this.props.replace,
      });
    }
    event.preventDefault()
    return false
  }

  render() {
    let { href, path, params, className, inheritParams } = this.props

    if (typeof href !== 'string'){
      if (typeof path === 'string' || typeof params === 'object'){
        let currentLocation = this.context.state.route.location

        if (inheritParams){
          params = Object.assign({}, currentLocation.params, params || {})
        }

        if (typeof path !== 'string') path = currentLocation.path

        href = pathAndParamsToHref(path, params)
      }else{
        href = "javascript:void(null);"
      }
    }

    className = 'link '+(className || '')

    return <a
      {...this.props}
      href={href}
      className={className}
      onClick={this.onClick}
    >{this.props.children}</a>
  }

}
