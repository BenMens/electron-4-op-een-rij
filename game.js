/* eslint-disable complexity */
/* eslint-disable curly */
/* eslint-disable multiline-comment-style */

// Hide from global scope using a Immediately Invoked Function Expression (IIFE) pattern
// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
(function game() {

const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;
const BOARD_ID = "board";

let PLAYER_1_TILE = {
    value: 0,
    colorClass: "red",
    colorName: "Red",
    playerName: "Red player"
};

let PLAYER_2_TILE = {
    value: 1,
    colorClass: "yellow",
    colorName: "Yellow",
    playerName: "Yellow player"
};

let EMPTY_TILE = {
    value: -1,
    colorClass: "transparant",
    image: "cell.svg",
    colorName: "empty",
};


let playerTiles = [PLAYER_1_TILE, PLAYER_2_TILE];

let board;
let turn;
let winner;


// #####################################################################################################################
// Init
// #####################################################################################################################
function init() {
    createBoard(BOARD_ID, 7, 6);
    setWinner({winner: -1});
    setTurn(0);
}


// #####################################################################################################################
// Game logic
// #####################################################################################################################
function clickedColumn(col) {
    // Check if game is ongoing
    if (winner >= 0) return;

    // Find bottom empty tile
    let freeRow = BOARD_HEIGHT - 1;
    while (freeRow >= 0 && board[col][freeRow] !== EMPTY_TILE) {
        freeRow--;
    }

    // Check if colomn is full
    if (freeRow < 0) return;

    // Fill tile
    board[col][freeRow] = playerTiles[turn];
    setBoardTile(col, freeRow, board[col][freeRow]);

    setWinner(checkWin(turn, 4));

    // Swap turn
    setTurn((turn + 1) % 2);
}


function setWinner(newWinner) {
    let winDisplay = document.body.querySelector('.header');

    winner = newWinner.winner;

    if (winner >= 0) {
        winDisplay.innerHTML = `${playerTiles[winner].playerName} wins!`;
        document.body.querySelector(".player-turn").innerHTML = ``;

        newWinner.winningTiles.forEach((winningTile) => {
            let tileImg = document
                .querySelector(`#${BOARD_ID}`)
                .querySelector(`#c${winningTile.col}r${winningTile.row}`);
            tileImg.classList.add("win-line");
        });
    } else {
        winDisplay.innerHTML = `4 in a row`;
    }
}


function setTurn(newTurn) {
    turn = newTurn;

    let playerElm = document.body.querySelector("#player-display");

    if (winner === -1) {
        playerElm.innerHTML =
            `It is currently <span class="player-turn">${playerTiles[turn].playerName}</span>'s turn.`;
    } else {
        playerElm.innerHTML = `Yeah!!`;
        playerElm.className = "flash";
    }
}


function setBoardTile(col, row, tile) {
    let td = document.querySelector(`#${BOARD_ID}`).querySelector(`#c${col}r${row}`);
    td.replaceWith(createTile(col, row, tile));
}


function checkWin(player, winLength) {
    let result = {
        winner: player,
        winningTiles: []
    };

    // Horizontal check
    for (let row = 0; row < BOARD_HEIGHT; row++) {
        result.winningTiles = [];
        let count = 0;

        for (let col = 0; col < BOARD_WIDTH; col++) {
            if (board[col][row].value === player) {
                count++;
                result.winningTiles.push({
                    col: col,
                    row: row
                });
                if (count === winLength) return result;
            } else {
                count = 0;
            }
        }
    }

    // Vertical check
    for (let col = 0; col < BOARD_WIDTH; col++) {
        result.winningTiles = [];
        let count = 0;

        for (let row = 0; row < BOARD_HEIGHT; row++) {
            if (board[col][row].value === player) {
                count++;
                result.winningTiles.push({
                    col: col,
                    row: row
                });
                if (count === winLength) return result;
            } else {
                count = 0;
            }
        }
    }

    // Diagonal up check
    for (let col = 0; col < BOARD_WIDTH - winLength + 1; col++) {
        result.winningTiles = [];
        let count = 0;

        for (let i = 0; i < Math.min(BOARD_WIDTH - col, BOARD_HEIGHT); i++) {
            if (board[i + col][i].value === player) {
                count++;
                result.winningTiles.push({
                    col: i + col,
                    row: i
                });
                if (count === winLength) return result;
            } else {
                count = 0;
            }
        }
    }
    for (let row = BOARD_HEIGHT - winLength + 1; row > 0; row--) {
        result.winningTiles = [];
        let count = 0;

        for (let i = 0; i < Math.min(BOARD_WIDTH, BOARD_HEIGHT - row); i++) {
            if (board[i][i + row].value === player) {
                count++;
                result.winningTiles.push({
                    col: i,
                    row: i + row
                });
                if (count === winLength) return result;
            } else {
                count = 0;
            }
        }
    }

    // Diagonal down check
    for (let col = winLength - 1; col < BOARD_WIDTH; col++) {
        result.winningTiles = [];
        let count = 0;

        for (let i = 0; i < Math.min(col + 1, BOARD_HEIGHT); i++) {
            if (board[col - i][i].value === player) {
                count++;
                result.winningTiles.push({
                    col: col - i,
                    row: i
                });
                if (count === winLength) return result;
            } else {
                count = 0;
            }
        }
    }
    for (let row = 1; row < BOARD_HEIGHT - winLength + 2; row++) {
        result.winningTiles = [];
        let count = 0;

        for (let i = 0; i < Math.min(BOARD_WIDTH, BOARD_HEIGHT - row); i++) {
            if (board[BOARD_WIDTH - i - 1][i + row].value === player) {
                count++;
                result.winningTiles.push({
                    col: BOARD_WIDTH - i - 1,
                    row: i + row
                });
                if (count === winLength) return result;
            } else {
                count = 0;
            }
        }
    }

    result.winner = -1;
    result.winningTiles = [];

    return result;
}


// #####################################################################################################################
// Create tiles
// #####################################################################################################################

function createTile(col, row, tile) {
    let td = document.createElement(`td`);
    td.id = `c${col}r${row}`;
    td.onclick = () => clickedColumn(col);
    td.className = `tile-background ${tile.colorClass}`;

    let img = document.createElement(`img`);
    img.src = `img/cell.svg`;
    img.alt = tile.colorName;
    img.className = "tile-img";

    td.appendChild(img);

    return td;
}


// #####################################################################################################################
// Create board
// #####################################################################################################################

function createBoard(tableId, cols, rows) {

    board = new Array(BOARD_WIDTH);
    for (let i = 0; i < BOARD_WIDTH; i++) {
        board[i] = new Array(BOARD_HEIGHT);

        for (let j = 0; j < BOARD_HEIGHT; j++) {
            board[i][j] = EMPTY_TILE;
        }
    }

    var tableBody = document.createElement("tbody");

    for (var row = 0; row < rows; row++) {
        var tr = document.createElement('tr');

        for (var col = 0; col < cols; col++) {
            tr.appendChild(createTile(col, row, board[col][row]));
        }
        tableBody.appendChild(tr);
    }

    document.querySelector(`#${tableId} tbody`).replaceWith(tableBody);
}


init();

// End IIFE
}());