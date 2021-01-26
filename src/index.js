import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button
      className="square"
      onClick={(i) => props.onClick(i)}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.square[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
class GameType extends React.Component {

  render(props){
    return (
      <div>
        <p>Please select your game type:</p>
        <div onChange={(event) => this.props.onChange(event)}>
          <input type="radio" value="multiplayer" name="gametype" /> Multiplayer
          <input type="radio" value="bot" name="gametype" defaultChecked /> Play With Bot
        </div>
      </div>
    )}
}
class Game extends React.Component {
  constructor(props) { 
    super(props); 
    this.state = { 
      history: [{ squares: Array(9).fill(null), }], 
      xIsNext: true, 
      stepNumber: 0,
      gameType: 'bot'
    }; 
  }

  resetToInitialState(){
    this.setState({ 
      history: [{ squares: Array(9).fill(null), }], 
      xIsNext: true, 
      stepNumber: 0,
    }); 
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);    
    const current = history[history.length - 1];   
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;    
    }
    squares[i] = (this.state.xIsNext ? 'X' : 'O');
    this.setState({ 
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    }, () => {botsTurn(this);}); 
  }

  jumpTo(step) {
    this.setState({ 
      stepNumber: step, 
      xIsNext: (step % 2) === 0, });
  }

  handleGameTypeChange(event){
    if(event.target.value!==this.state.gameType){
      this.resetToInitialState();
      this.setState({
        gameType: event.target.value
      })
    }
  }

  render() {
    const history = this.state.history;    
    const current = history[this.state.stepNumber];    
    const winner = calculateWinner(current.squares);  

    const moves = history.map((step, move) => { 
      const desc = move ? 
      'Go to move #' + move :
      'Go to game start'; 
      return (
        <li key={move}>          
           <button onClick={() => this.jumpTo(move)}>{desc}</button>        
        </li>
      ); 
    });

    let status;    
    if (winner) {      
      status = 'Winner: ' + winner;    
    } 
    else {      
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');    
    }
    return (
      <div className="game">
        <GameType
          onChange={(i) => this.handleGameTypeChange(i)}
        />
        <div className="game-board">          
          <Board
            square={current.squares}
            onClick={(i) => this.handleClick(i)}
           />          
        </div>
        <div className="game-info">        
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
// ========================================
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
function botsTurn(botHistory){
  console.log(botHistory.state);
  if(botHistory.state.gameType === "bot"){
    const history = botHistory.state.history.slice(0, botHistory.state.stepNumber + 1);    
    const current = history[history.length - 1];   
    const squares = current.squares.slice();
    var postion= decideNextStep(current.squares);
    console.log(postion);
    if (calculateWinner(squares) || squares[postion]) {
      return;    
    }    
    squares[postion] = (botHistory.state.xIsNext ? 'X' : 'O');
    botHistory.setState({ 
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !botHistory.state.xIsNext,
      stepNumber: history.length,
    });
  }
}


function decideNextStep(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const priorityPositions = [4,0,2,6,8,1,3,5,7];
  var availablePositions=[];
  for(let i = 0; i < squares.length; i++) {
    if(squares[i]===null){
      availablePositions.push(i);
    }
  };

  for(let i = 0; i < lines.length; i++) {
    const combination= lines[i];
    let postion = null;
    let count = 0;
    for(let j=0;j<combination.length;j++) {
      if(squares[combination[j]] ==='O'){
        count++;
        continue;
      }
      else if(!squares[combination[j]]){
        postion = combination[j];
      }      
    }
    if(count===2 && postion!==null){
      return postion;
    } 
  }

  for(let i = 0; i < lines.length; i++) {
    const combination= lines[i];
    let postion = null;
    let count = 0;
    for(let j=0;j<combination.length;j++) {
      if(squares[combination[j]] ==='X'){
        count++;
        continue;
      }
      else if(!squares[combination[j]]){
        postion = combination[j];
      }
    }
    if(count===2 && postion!==null){
      return postion;
    } 
  }  

  for(let i = 0; i < priorityPositions.length; i++)
  {
    if(availablePositions.indexOf(priorityPositions[i])>0)
    {
      return priorityPositions[i]
    }
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
