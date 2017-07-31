import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Box from './box.js';


class App extends Component {
  constructor() {
    super();
    this.start = this.start.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.toggleBoxClick = this.toggleBoxClick.bind(this);
    this.checkResults = this.checkResults.bind(this);
    this.getUserGameDetail = this.getUserGameDetail.bind(this);
    this.timer = 8;

    let userName = 'user' + Math.floor(Math.random() * 2505);
    let userScores = [];

    let divisibleGameData = this.getUserGameDetail();
    if (divisibleGameData) {
      let users = Object.keys(divisibleGameData);
      userName = users[users.length-1];
      userScores = divisibleGameData[userName];
    } else {
      divisibleGameData = {};
      divisibleGameData[userName] = [];
    }

    this.state = {
      gameMode: false,
      timer: this.timer,
      user: {
        username: userName,
        scores: userScores
      },
      game: {
        numberQ: "?",
        numbers: []
      }
    }
  }

  getUserGameDetail() {
    return localStorage.getItem("divisibleGameData") && JSON.parse(localStorage.getItem("divisibleGameData"));
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tick() {
    if (this.state.timer == 0) {
      this.checkResults();
      clearInterval(this.timerID);
    }
    this.setState((prevState, props) => {
      return { timer: prevState.timer - 1 };
    });
  }
  start(event) {
    if (!this.state.user.username) {
      event.preventDefault;
      return;
    }
    //start timer
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );

    let numbers = [...Array(30)].map(function () {
      return {
        selected: false,
        value: Math.floor(Math.random() * 20) + 1
      }
    });
    this.setState({
      gameMode: true,
      game: {
        numbers: numbers,
        numberQ: Math.floor(Math.random() * 10) + 2
      }
    });

  }
  handleUserChange(event) {
    this.setState({
      user: {
        username: event.target.value
      }
    })
  }
  toggleBoxClick(event) {
    let index = parseInt(event.target.getAttribute('data-index'));
    let numbers = this.state.game.numbers;

    numbers[index].selected = !numbers[index].selected;
    this.setState(numbers);
  }
  checkResults() {
    let user = this.state.user.username,
      numberQ = this.state.game.numberQ,
      correctAnswers = this.state.game.numbers.filter(function (val) {
        return val.value % numberQ == 0;
      }),
      selectedCorrectAnswers = this.state.game.numbers.filter(function (val) {
        return val.selected && val.value % numberQ == 0;
      }),
      accuracy = ((selectedCorrectAnswers.length / correctAnswers.length) * 100);
      accuracy = accuracy || 100;

    //Retreieve localstorage key 
    var divisibleGameData = JSON.parse(localStorage.getItem("divisibleGameData")),
      date = new Date(),
      userGameDetail = { time: date.toLocaleDateString() + " " + date.toLocaleTimeString(), score: accuracy+ " %"  };
    if (divisibleGameData) {
      if (divisibleGameData[user]) {
        divisibleGameData[user].push(userGameDetail)
      } else {
        divisibleGameData[user] = [userGameDetail]
      }

    } else {
      divisibleGameData = {};
      divisibleGameData[user] = [userGameDetail]
    }

    localStorage.setItem("divisibleGameData", JSON.stringify(divisibleGameData));
    this.setState({
      gameMode: false,
      timer: this.timer,
      user: {
        username: user,
        scores: this.getUserGameDetail()[user].reverse(),
      },
      game: {
        numberQ: "?"
      }
    });

    // console.info(JSON.stringify(selectedCorrectAnswers));
    // console.info(JSON.stringify(correctAnswers));
    // console.info((selectedCorrectAnswers.length/correctAnswers.length) * 100);
  }
  render() {
    let appHeaderClass = this.state.gameMode ? "App game" : "App";

    return (
      <div className={appHeaderClass}>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.gameMode && (<span className="timer">{this.state.timer}</span>)}
          <h2>Welcome {this.state.user.username}</h2>
          <h4> Objective: Select numbers evenly Divisible by {this.state.game.numberQ} </h4>
          {/* {this.state.gameMode && (<button className="checkResults" onClick={this.checkResults}>Submit</button>)} */}
        </div>
        <div className="App-intro">
          {!this.state.gameMode && (<div className="gameInitInfo"><input required type="text" placeholder="user name" value={this.state.user.username} onChange={this.handleUserChange} ></input><button className="startBtn" onClick={this.start}> Start </button></div>)}
          {!this.state.gameMode && this.state.user.scores && this.state.user.scores.reverse().slice(0, 6).map((x, i) =>
            <div className="leaderboard" key={i}>
              <div> {x.score} </div>
              <div className="time"> {x.time} </div>
            </div>
          )
          }
          {this.state.gameMode && this.state.game.numbers.map((x, i) =>
            <Box key={i} numdata={x} indetifier={i} toggleBoxClick={this.toggleBoxClick} />
          )
          }
        </div>
      </div>
    );
  }
}

export default App;