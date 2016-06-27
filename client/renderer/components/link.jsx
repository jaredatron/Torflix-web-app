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

    const href = event.target.href
    const newLocation = parseUri(href)

    console.log('HREF', href, parseUri(href))

    if (newLocation.domain === location.domain){
      emit({
        type: 'setLocation',
        location: newLocation,
        replace: this.props.replace,
      });
      event.preventDefault()
      return false
    }

    // emit({
    //   type: 'setLocation',
    //   href: href,
    // });

    // const { route } = state

    // // TODO return if any modifier keys are pressed
    // if (this.props.onClick){
    //   this.props.onClick(event);
    //   return false;
    // }

    // if (this.props.emit){
    //   this.context.emit(this.props.emit)
    //   return false;
    // }

    // if (this.props.updateParams){
    //   emit({
    //     type:   'updateParams',
    //     params: this.props.updateParams,
    //   });
    //   return false;
    // }

    // if (this.props.setPath){
    //   emit({
    //     type:   'setPath',
    //     params: this.props.setPath,
    //   });
    //   return false;
    // }

    // if (this.props.path || this.props.path){
    //   emit({
    //     type:   'setLocation',
    //     path:   this.props.path,
    //     params: this.props.params,
    //   });
    //   return false;
    // }
  }

  render() {
    let { href, path, params, className, inheritParams } = this.props
    let currentLocation = this.context.state.route.location

    if (inheritParams){
      params = Object.assign({}, currentLocation.params, params || {})
    }

    if (params && typeof path !== 'string') path = currentLocation.path

    if (href === undefined && (typeof path === 'string' || params))
      href = pathAndParamsToHref(path, params)

    if (href === undefined)
      href = "javascript:void(null);"

    className = 'link '+(className || '')

    return <a
      {...this.props}
      href={href}
      className={className}
      onClick={this.onClick}
    >{this.props.children}</a>
  }

}
