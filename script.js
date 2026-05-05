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
    function play(row, column, sign) {
        if (!sign) {throw new Error("no sign provided to play")}

        //check for invalid input
        if (row < 0 || row >= playField.length || column < 0 || 
            column >= playField[0].length || sign != 'X' && sign != 'O') throw new Error("invalid play")
        
        //if not null then there's already a sign in that index. return false to make another play
        if (playField[row][column] != null) return false;

        playField[row][column] = sign;
        if (gameMaster.checkWins(sign) == "win") console.log(`${sign} wins`);
        
        console.log(playField)

    }
    
    return({getField, clear, play})
})()

// TODO: add event listener to get which sign the user Chooses
//       and wither it's a PvP or PvB(player versus bot)
//once the player clicks START. you use createCOntestant to store players with their sign in an array

//TODO: call cpu each time a player calls play() to respond to them
//      only when the chosen mode is PvB
let gameMaster = (() => {
    //check if the game is pvp or pvb
    let gameMode = null //pvp or pvb
    let setGameMode = (label) => {
        if (label != "pvp" && label != "pvb") throw new Error("invalid game mode")
        gameMode = label
    }

    let players = []
    let Addplayers = (sign) => {
        players.push(createContestant(sign))
        return sign;
    }

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

            if (record == 3) return "win"
        }
    }

    if (cpu.countAvailable() == 0) return "tie"

        return false;

    }
    return {setGameMode, Addplayers, randomRound, switchRound, checkWins}
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

    return {giveSign, decideMove , play, countAvailable};
})()






//event listeners

let player1;
let player2;
//choose mode page
let chooseModePage = document.querySelector("#mode-selection-screen")
chooseModePage.addEventListener("click", (e) => {
    if (e.target.id == "pvc-mode-btn") {
        //create 1 player
        player1 = createContestant("X");

        chooseModePage.classList.toggle("visible");
    }
    else if (e.target.id == "pvp-mode-btn") {
        //create 2 players
        player1 = createContestant("X");
        player2 = createContestant("O");

        chooseModePage.classList.toggle("visible");
    }
    
})


