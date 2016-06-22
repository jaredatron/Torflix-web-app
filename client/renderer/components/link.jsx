import React from 'react';
import ReactDOM from 'react-dom';

export default class Link extends React.Component {

  static PropTypes = {
    href: React.PropTypes.string,
    path: React.PropTypes.string,
    props: React.PropTypes.object,
  }

  static contextTypes = {
    emit: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    // TODO return if any modifier keys are pressed
    if (this.props.onClick){
      event.preventDefault();
      this.props.onClick(event);
      return false;
    }

    if (this.props.setParams){
      this.context.emit({
        type:   'setParams',
        params: this.props.setParams,
      });
      return false;
    }

    if (this.props.path){
      event.preventDefault();
      this.context.emit({
        type:   'changeLocation',
        path:   this.props.path,
        params: this.props.params,
      });
      return false;
    }
  }

  render() {
    // // var props = this.props;
    // let href = this.props.href || "";
    // let className = "PageLink "+(this.props.className || "")

    let href = this.props.href || this.props.path || "javascript:void(null);"
    let className = 'link '+(this.props.className || '')
    let onClick = this.onClick

    // return <a href={href} className={className} onClick={this.onClick}>
    return <a {...this.props}
        href={href}
        className={className}
        onClick={onClick}
      >{this.props.children}</a>
  }

}
