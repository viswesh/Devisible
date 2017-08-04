import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Box from './box.js';
import { createStore } from 'redux';
import { reducer } from './numberGameRedux';
import { actionCreators } from './numberGameRedux';

class App extends Component {
  constructor() {
    super();
    this.start = this.start.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.toggleBoxClick = this.toggleBoxClick.bind(this);
    this.checkResults = this.checkResults.bind(this);
    this.getUserGameDetail = this.getUserGameDetail.bind(this);
    this.store = createStore(reducer);
  }

  getUserGameDetail() {
    return localStorage.getItem("divisibleGameData") && JSON.parse(localStorage.getItem("divisibleGameData"));
  }
  componentWillMount() {
    const store = this.store;
    const { gameState } = store.getState();
    this.setState({ gameState })

    this.unsubscribe = store.subscribe(() => {
      const { gameState } = store.getState()
      this.setState({ gameState })
    })
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
    this.unsubscribe()
  }
  tick() {
    const store = this.store;
    const gameState = store.getState();

    if (gameState.timer === 0) {
      this.checkResults();
      clearInterval(this.timerID);
    }
    this.store.dispatch(actionCreators.tick());
  }
  start(event) {
    const store = this.store;
    const gameState = store.getState();

    if (!gameState.user.username) {
      event.preventDefault();
      return;
    }
    //start timer
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );

    this.store.dispatch(actionCreators.startgame());
  }
  handleUserChange(event) {
    this.store.dispatch(actionCreators.changeUsername(event.target.value));
  }
  toggleBoxClick(event) {
    const store = this.store;
    const gameState = store.getState();

    let index = parseInt(event.target.getAttribute('data-index'), 10); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
    let numbers = gameState.game.numbers;

    numbers[index].selected = !numbers[index].selected;    
    this.store.dispatch(actionCreators.toggleSelection(numbers));
  }
  checkResults() {
    clearInterval(this.timerID);
    this.store.dispatch(actionCreators.stopgame());
  }
  render() {
    let gameState = this.store.getState();
    let appHeaderClass = gameState.gameMode ? "App game" : "App";

    return (
      <div className={appHeaderClass}>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {gameState.gameMode && (<span className="timer">{gameState.timer}</span>)}
          <h2>Welcome {gameState.user.username}</h2>
          <h4> Objective: Select numbers evenly Divisible by {gameState.game.numberQ} </h4>
          {/* {gameState.gameMode && (<button className="checkResults" onClick={this.checkResults}>Submit</button>)} */}
        </div>
        <div className="App-intro">
          {!gameState.gameMode && (<div className="gameInitInfo"><input required type="text" placeholder="user name" value={gameState.user.username} onChange={this.handleUserChange} ></input><button className="startBtn" onClick={this.start}> Start </button></div>)}
          {!gameState.gameMode && gameState.user.scores && gameState.user.scores.reverse().slice(0, 6).map((x, i) =>
            <div className="leaderboard" key={i}>
              <div> {x.score} </div>
              <div className="time"> {x.time} </div>
            </div>
          )
          }
          {gameState.gameMode && gameState.game.numbers.map((x, i) =>
            <Box key={i} numdata={x} indetifier={i} toggleBoxClick={this.toggleBoxClick} />
          )
          }
        </div>
      </div>
    );
  }
}

export default App;