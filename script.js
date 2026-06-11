function createContestant(sign) {
    let score = 0
    if (sign != 'X' && sign != 'O') {
        throw new Error("Invalid sign have been assigned");
    }

    function getSign() {
        return sign
    }

    function giveScore() {
        score++;
        return score;
    }
    function getScore() {
        return score;
    }
    return {getSign, giveScore, getScore}
}
let gameboard = (() => {
    let playField = [[null, null, null],
                     [null, null, null],
                     [null, null, null]]

    function getField() {
        return playField.map(row => [...row]);
    }
    function clear() {
        for (let i = 0; i < playField.length; i++) {
            for (let j = 0; j < playField[i].length; j++) {
                playField[i][j] = null
            }
        }
    }

    function updateGameBoard() {
        let gameboardDom = document.getElementById("game-board")
        let tempGameboard = gameboard.getField()
        let temp = 0
        
        for (let i = 0; i < tempGameboard.length; i++) {
            for (let j = 0; j < tempGameboard[0].length; j++) {
                if (tempGameboard[i][j] != null) {
                    gameboardDom.children[temp].textContent = `${tempGameboard[i][j]}`
                }
                else {
                    gameboardDom.children[temp].textContent = "";
                }
                temp++;
            }
        }
    
    }

    function play(row, column, sign) {
        if (!sign) {throw new Error("no sign provided to play")}

        //check for invalid input
        if (row < 0 || row >= playField.length || column < 0 || 
            column >= playField[0].length || sign != 'X' && sign != 'O') throw new Error(`invalid play, got${row, column, sign}`)
        
        //if not null then there's already a sign in that index. return false to make another play
        if (playField[row][column] != null) return false;

        playField[row][column] = sign;
        if (gameMaster.checkWins(sign) == "win") console.log(`${sign} wins`);
        
        console.log(playField)
        gameMaster.switchRound()
        updateGameBoard()

    }
    
    return({getField, clear, play, updateGameBoard})
})()


let gameMaster = (() => {
    //check if the game is pvp or pvb
    let gameMode = null //pvp or pvb
    let setGameMode = (label) => {
        if (label != "pvp" && label != "pvb") throw new Error("invalid game mode")
        gameMode = label
    }
    function getGameMode() {
        return gameMode;
    }

    let players = []
    let Addplayers = (sign) => {
        players.push(createContestant(sign))
        return sign;
    }
    function clearPlayers() {players = []}
    function playersList() {return players;}

    // pick a random player to start the game
    let currentRound;
    function randomRound() {
        currentRound = players[Math.floor(Math.random() * players.length)]
        return currentRound;
    }
    //switch turns when play is called
    let switchRound = () => {
        if (currentRound == players[0]) currentRound = players[1];
        else currentRound = players[0];
    }
    let getRound = () => { return currentRound;}

    let checkWins = (sign) => {
        let board = gameboard.getField()
    
        const WIN_COMBINATIONS = [
        [[0,0], [0,1], [0, 2]], //row 1
        [[1,0],[1,1],[1,2]], //row 2 
        [[2,0],[2,1],[2,2]], //row 3
        [[0,0],[1,0],[2,0]], //col 1
        [[0,1],[1,1],[2,1]], //col 2
        [[0,2],[1,2],[2,2]], //col 3
        [[0,0],[1,1],[2,2]], //diagonal \
        [[0,2],[1,1],[2,0]]  //diagonal /
    ]


    for (let i = 0; i < WIN_COMBINATIONS.length; i++) {
        let record = 0
        for (let j = 0; j < WIN_COMBINATIONS[0].length; j++) {

            let index_i = WIN_COMBINATIONS[i][j][0]
            let index_j = WIN_COMBINATIONS[i][j][1]
            if (board[index_i][index_j] == sign) {
                record++
            }
            else {
                break;
            }

            if (record == 3) {
                updateResultsScreen(sign)
                return "win"

            }
        }
    }
    
    if (cpu.countAvailable() == 0) {
        updateResultsScreen("tie")
        return "tie"
    }

        return false;

    }
    return {setGameMode, getGameMode, Addplayers, playersList, clearPlayers, randomRound, switchRound, getRound, checkWins}
})()

let cpu = (() => {
    
    //store the available indexes in array.
    let availableSlots = [];
    function countAvailable() {
        availableSlots = []
        let board = gameboard.getField();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] == null) {
                    availableSlots.push([i, j])
                }
            }
        }
        return availableSlots.length
    } countAvailable()

    let sign; //X or O
    function giveSign(newSign) {
        sign = newSign;
    }
    function getSign() { return sign}

    let pickAPlay;
    function decideMove(params) {
        countAvailable()
        if (availableSlots.length > 0) {
            pickAPlay = availableSlots[Math.floor(Math.random() * availableSlots.length)];
            return pickAPlay; 
        }
        else console.log("No empty slots to continue playing")
    }


    //play function that takes an index. plays it then deletes it from the available slots
    function play() {
        decideMove()
        gameboard.play(pickAPlay[0], pickAPlay[1], sign)
    }

    return {giveSign, play, countAvailable, getSign};
})()






//event listeners

//load main divs
let chooseModePage = document.querySelector("#mode-selection-screen")
let mainScreen = document.querySelector("#game-field")

//mode selection screen
chooseModePage.addEventListener("click", (e) => {
    if (e.target.id == "pvc-mode-btn") {
        //create 1 player and cpu
        gameMaster.Addplayers("X");
        gameMaster.Addplayers("O")
        cpu.giveSign("O")
        gameMaster.setGameMode("pvb")

        chooseModePage.classList.toggle("invisible");
        mainScreen.classList.toggle("invisible")
        gameStarts()
    }
    else if (e.target.id == "pvp-mode-btn") {
        //create 2 players
        gameMaster.Addplayers("X");
        gameMaster.Addplayers("O")
        gameMaster.setGameMode("pvp")

        chooseModePage.classList.toggle("invisible");
        mainScreen.classList.toggle("invisible")
        gameStarts()
    }
    
})

//game starts
function gameStarts() {
    gameMaster.randomRound() //a player with 
    
    //cpu plays if it's first
    function cpuTurn() {
        if (gameMaster.getGameMode() == "pvb") {
            if (gameMaster.getRound().getSign() == cpu.getSign()) {
                cpu.play()
            }
        }
    }
    cpuTurn()
    
    mainScreen.addEventListener("click", (e) => {
        let chosenPlay = e.target.id;
        gameboard.play(chosenPlay[0], chosenPlay[2], gameMaster.getRound().getSign())
        cpuTurn()
    })
}



//update results screen
let resultsScreen = document.querySelector("#results-screen")
let winnerNamePlace = document.querySelector("#winner-name");
let resultsMessage = document.querySelector("#win-message")
function updateResultsScreen(winner) {

    resultsScreen.classList.toggle("invisible")

    if (winner == "tie") {
        winnerNamePlace.textContent = ""
        resultsMessage.textContent = "That's a tie!"
    }
    else if (winner == "X") {
        winnerNamePlace.textContent = "X.."
        resultsMessage.textContent = " has won"
    }
    else {
        winnerNamePlace.textContent = "O.."
        resultsMessage.textContent = " has won"
    }
}
let playAgainBtn = document.querySelector("#play-again-btn")
playAgainBtn.addEventListener("click", (e) => {
    gameboard.clear()
    gameMaster.clearPlayers()
    gameboard.updateGameBoard()
    chooseModePage.classList.toggle("invisible")
    mainScreen.classList.toggle("invisible")
    resultsScreen.classList.toggle("invisible")
})
