import React from 'react';
import ReactDOM from 'react-dom';

export default class PageLink extends React.Component {

  static contextTypes = {
    setPathAndProps: React.PropTypes.func.isRequired
  }

  onClick(event) {
    event.preventDefault();
    if (this.props.onClick){
      this.props.onClick(event);
    }else{
      console.info('SHOULD PUSH STATE TO', this.props.href);
      this.context.setPathAndProps('boosh', {page: 2});
    }
  }

  render() {
    // // var props = this.props;
    // let href = this.props.href || "";
    // let className = "PageLink "+(this.props.className || "")

    let props = {}
    props.href = this.props.href || "";
    props.className = this.props.className || "";
    props.className = "PageLink "+this.props.className;
    props.onClick = this.onClick.bind(this);

    // return <a href={href} className={className} onClick={this.onClick}>
    return <a {...props}>
      {this.props.children}
    </a>
  }

}
