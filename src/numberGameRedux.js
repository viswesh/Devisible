// The types of actions that you can dispatch to modify the state of the store
export const types = {
    TICK: "TICK",
    STARTGAME: "STARTGAME",
    STOPGAME: "STOPGAME",
    TOGGLESELECTION: "TOGGLESELECTION",
    CHANGEUSERNAME: "CHANGEUSERNAME"
};

// Helper functions to dispatch actions, optionally with payloads
export const actionCreators = {
    tick: data => {
        return { type: types.TICK };
    },
    startgame: data => {
        return { type: types.STARTGAME };
    },
    stopgame: data => {
        return { type: types.STOPGAME };
    },
    toggleSelection: data => {
        return { type: types.TOGGLESELECTION, payload: data };
    },
    changeUsername: data => {
        return { type: types.CHANGEUSERNAME, payload: data };
    }
};

// Initial state of the store
let divisibleGameData = localStorage.getItem("divisibleGameData") && JSON.parse(localStorage.getItem("divisibleGameData"));
let userName = 'user' + Math.floor(Math.random() * 2505);
let userScores = [];

if (divisibleGameData) {
    let users = Object.keys(divisibleGameData);
    userName = users[users.length - 1];
    userScores = divisibleGameData[userName];
} else {
    divisibleGameData = {};
    divisibleGameData[userName] = [];
}
const initialState = {
    gameMode: false,
    timer: 8,
    user: {
        username: userName,
        scores: userScores
    },
    game: {
        numberQ: "?",
        numbers: []
    }
}

// Function to handle actions and update the state of the store.
// Notes:
// - The reducer must return a new state object. It must never modify
//   the state object. State objects should be treated as immutable.
// - We set \`state\` to our \`initialState\` by default. Redux will
//   call reducer() with no state on startup, and we are expected to
//   return the initial state of the app in this case.
export const reducer = (state = initialState, action) => {
    const gameState = state;
    const { type, payload } = action;

    switch (type) {
        case types.TICK: {
            return {
                ...gameState,
                timer: gameState.timer - 1
            };
        }
        case types.STARTGAME: {
            let numbers = [...Array(30)].map(function () {
                return {
                    selected: false,
                    value: Math.floor(Math.random() * 20) + 1
                }
            });

            return {
                ...gameState,
                gameMode: true,
                game: {
                    numbers: numbers,
                    numberQ: Math.floor(Math.random() * 10) + 2
                }
            }
        }
        case types.STOPGAME: {            
            let user = gameState.user.username,
                numberQ = gameState.game.numberQ,
                correctAnswers = gameState.game.numbers.filter(function (val) {
                    return val.value % numberQ === 0;
                }),
                selectedCorrectAnswers = gameState.game.numbers.filter(function (val) {
                    return val.selected && val.value % numberQ === 0;
                }),
                accuracy = ((selectedCorrectAnswers.length / correctAnswers.length) * 100);
            accuracy = accuracy || 100;

            //Retreieve localstorage key 
            let divisibleGameData = JSON.parse(localStorage.getItem("divisibleGameData")),
                date = new Date(),
                userGameDetail = { time: date.toLocaleDateString() + " " + date.toLocaleTimeString(), score: accuracy + " %" };
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

            // console.info(JSON.stringify(selectedCorrectAnswers));
            // console.info(JSON.stringify(correctAnswers));
            // console.info((selectedCorrectAnswers.length/correctAnswers.length) * 100);
            divisibleGameData = localStorage.getItem("divisibleGameData") && JSON.parse(localStorage.getItem("divisibleGameData"));

            return {
                ...gameState,
                user: {
                    username: user,
                    scores: divisibleGameData[user].reverse()
                },
                gameMode: false,
                timer: 8,
                game: {
                    numberQ: "?"
                }
            }
        }
        case types.TOGGLESELECTION: {
            return {
                ...gameState,
                game: {
                    numberQ: gameState.game.numberQ,
                    numbers: payload
                }
            };
        }
        case types.CHANGEUSERNAME: {
            return {
                ...gameState,
                user: {
                    username: payload                    
                }
            };
        }
        default:
        return gameState;

    } 
};
