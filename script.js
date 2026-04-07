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
        //check for invalid input
        if (row < 0 || row >= playField.length || column < 0 || 
            column >= playField[0].length || sign != 'X' && sign != 'O') throw new Error("invalid play")
        
        //if not null then there's already a sign in that index. return false to make another play
        if (playField[row][column] != null) return false;

        playField[row][column] = sign;
        console.log(playField)

        //return true to switch turns with the opponent
        return true
    }
    
    return({getField, clear, play})
})()

// TODO: add event listener to get which sign the user Chooses
//       and wither it's a PvP or PvB(player versus bot)

//TODO: create a function that execute each time you call play() to respond to the player
//      only when the chosen mode is PvB