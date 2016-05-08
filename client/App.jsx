import React from 'react';
import ReactDOM from 'react-dom';

export default class App extends React.Component {

  render() {
    return <div>wooot</div>;
  }

}
//   static propTypes = {
//     color: React.PropTypes.string,
//   }

//   constructor(props) {
//     super(props);
//     this.state = {
//       players: ['Jared', 'Scott'],
//       activePlayer: 0,
//       spaces: [
//         null,null,null,
//         null,null,null,
//         null,null,null,
//       ]
//     }
//     this.onSpaceSelect = this.onSpaceSelect.bind(this);
//   }

//   onSpaceSelect(space, event) {
//     event.preventDefault();
//     if (typeof space === 'number'){
//       this.state.spaces[space] = (this.state.activePlayer === 0 ? 'X' : 'O');
//       this.setState({
//         spaces: this.state.spaces,
//         activePlayer: (this.state.activePlayer === 0 ? 1 : 0),
//       });
//     }
//   }

//   render() {
//     return <div className="TicTacToe">
//       <div>
//         <TicTacToePlayer name={this.state.players[0]} activePlayer={this.state.activePlayer === 0}/>
//         <TicTacToePlayer name={this.state.players[1]} activePlayer={this.state.activePlayer === 1}/>
//       </div>
//       <TicTacToeBoard spaces={this.state.spaces} onSpaceSelect={this.onSpaceSelect} />
//     </div>
//   }
// }



// class TicTacToePlayer extends React.Component {
//   static propTypes = {
//     name: React.PropTypes.string.isRequired,
//     activePlayer: React.PropTypes.bool.isRequired,
//   }
//   render(){
//     return <div>
//       <span>{this.props.name}</span>
//       &nbsp;
//       <span>{this.props.activePlayer ? 'ACTIVE' : ''}</span>
//     </div>
//   }
// }

// class TicTacToeBoard extends React.Component {
//   static propTypes = {
//     spaces: React.PropTypes.array.isRequired,
//     onSpaceSelect: React.PropTypes.func.isRequired,
//   }
//   render() {
//     return <div className="TicTacToeBoard">
//       <TicTacToeSpace value={this.props.spaces[0]} onSelect={this.props.onSpaceSelect.bind(null, 0)} />
//       <TicTacToeSpace value={this.props.spaces[1]} onSelect={this.props.onSpaceSelect.bind(null, 1)} />
//       <TicTacToeSpace value={this.props.spaces[2]} onSelect={this.props.onSpaceSelect.bind(null, 2)} />
//       <TicTacToeSpace value={this.props.spaces[3]} onSelect={this.props.onSpaceSelect.bind(null, 3)} />
//       <TicTacToeSpace value={this.props.spaces[4]} onSelect={this.props.onSpaceSelect.bind(null, 4)} />
//       <TicTacToeSpace value={this.props.spaces[5]} onSelect={this.props.onSpaceSelect.bind(null, 5)} />
//       <TicTacToeSpace value={this.props.spaces[6]} onSelect={this.props.onSpaceSelect.bind(null, 6)} />
//       <TicTacToeSpace value={this.props.spaces[7]} onSelect={this.props.onSpaceSelect.bind(null, 7)} />
//       <TicTacToeSpace value={this.props.spaces[8]} onSelect={this.props.onSpaceSelect.bind(null, 8)} />
//     </div>
//   }
// }
// class TicTacToeSpace extends React.Component {
//   static propTypes = {
//     onSelect: React.PropTypes.func.isRequired,
//   }
//   render() {
//     if (this.props.value){
//       return <div className="TicTacToeSpace">{this.props.value}</div>
//     }else{
//       return <a href="" className="TicTacToeSpace" onClick={this.props.onSelect}>{this.props.value}</a>
//     }
//   }
// }
