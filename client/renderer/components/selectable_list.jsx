import React from 'react';
import ReactDOM from 'react-dom';
import Link from './link.jsx'

export default class SelectableList extends React.Component {

  static propTypes = {
    // onChange: React.PropTypes.func.isRequired,
    members:         React.PropTypes.array.isRequired,
    memberComponent: React.PropTypes.func.isRequired,
    actions:         React.PropTypes.array,
    orderings:       React.PropTypes.array,
  }

  constructor(){
    super()
    this.state = {
      selectedMembers: []
    }
    this.onKeyDown          = this.onKeyDown.bind(this)
    this.focusNextChild     = this.focusNextChild.bind(this)
    this.focusPreviousChild = this.focusPreviousChild.bind(this)
    this.toggleSelected     = this.toggleSelected.bind(this)
    this.selectAll          = this.selectAll.bind(this)
    this.clearSelection     = this.clearSelection.bind(this)
  }

  onKeyDownHandlers = {
    j: (target) => { this.focusNextChild(target) },
    k: (target) => { this.focusPreviousChild(target) },
    x: (target) => { this.toggleSelected(target) },
  }

  onKeyDown(event){
    const { key, target } = event
    let memberKey = Object.keys(this.refs).find(key => this.refs[key] === target)
    if (typeof memberKey === 'string') memberKey = parseInt(memberKey, 10)
    if (memberKey){
      if (key in this.onKeyDownHandlers){
        event.preventDefault()
        this.onKeyDownHandlers[key].call(this, memberKey)
      }
    }
    if (this.props.onKeyDown) this.props.onKeyDown(event, memberKey)
  }


  focusNextChild(memberKey){
    const next = this.refs[memberKey].nextElementSibling.focus();
    if (next && next.focus) next.focus()
  }

  focusPreviousChild(memberKey){
    const prev = this.refs[memberKey].previousSibling
    if (prev && prev.focus) prev.focus()
  }

  toggleSelected(memberKey){
    let { selectedMembers } = this.state
    selectedMembers =  selectedMembers.includes(memberKey) ?
      selectedMembers.filter(key => key !== memberKey) :
      selectedMembers.concat([memberKey])
    this.setState({selectedMembers: selectedMembers})
  }

  selectAll(){
    const selectedMembers = this.props.members.map(member => member.key)
    this.setState({selectedMembers: selectedMembers})
  }

  clearSelection(){
    this.setState({selectedMembers: []})
  }

  render(){
    let { className, members, memberComponent } = this.props
    className = 'SelectableList '+(className||'')
    const children = members.map(props => {
      props = Object.assign({}, props, {
        selected: this.state.selectedMembers.includes(props.key),
        toggleSelected: this.toggleSelected.bind(this, props.key),
      })
      return <div
          key={props.key}
          ref={props.key}
          className="SelectableList-member"
          tabIndex={props.selectable ? 0 : -1}
        >
        {React.createElement(memberComponent, props)}
        </div>
    })
    return <div
      ref="node"
      className={className}
      onKeyDown={this.onKeyDown}
    >
      <Controls
        members={this.state.members}
        selectedMembers={this.state.selectedMembers}
        actions={this.props.actions}
        orderings={this.props.orderings}
        selectAll={this.selectAll}
        clearSelection={this.clearSelection}
      />
      {children}
    </div>
  }

}


class Controls extends React.Component {
  render(){
    const {
      members,
      selectedMembers,
      orderings,
      selectAll,
      clearSelection
    } = this.props

    const actions = this.props.actions.map(action =>
      <Link key={action.name} onClick={action.onClick.bind(null, selectedMembers)}>{action.name}</Link>
    )
    return <div className="SelectableList-controls columns">
      <div>
        <Link onClick={selectAll}>all</Link>
        <span> | </span>
        <Link onClick={clearSelection}>none</Link>
      </div>
      <div className="grow" />
      <div>{actions}</div>
    </div>
  }
}
