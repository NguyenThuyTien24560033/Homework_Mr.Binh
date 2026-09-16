const board = document.getElementById("board");
const statusPL= document.getElementById("status");
const newGame = document.getElementById("newGame");

let currentPlayer = "X";
let gameOver = false;

let cells = [];


for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");

    cell.classList.add("cell");

    cell.addEventListener("click", function () {
        play(cell, i);
    });

    board.appendChild(cell);
    cells.push("");
}


function play(cell, index) {

    if (cells[index] !== "") {
        return;
    }

    if (gameOver) {
        return;
    }

    cells[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWinner()) {
        statusPL.textContent = "Player " + currentPlayer + " wins!";
        gameOver = true;
        return;
    }

    if (!cells.includes("")) {
        statusPL.textContent = "Draw!";
        gameOver = true;
        return;
    }

    if (currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }

    statusPL.textContent = "Player " + currentPlayer + "'s turn";
}

function checkWinner() {

    for (let row = 0; row < 5; row++) {

        let start = row * 5;

        if (
            cells[start] !== "" &&
            cells[start] === cells[start + 1] &&
            cells[start] === cells[start + 2] &&
            cells[start] === cells[start + 3] &&
            cells[start] === cells[start + 4]
        ) {
            return true;
        }
    }

    for (let col = 0; col < 5; col++) {

        if (
            cells[col] !== "" &&
            cells[col] === cells[col + 5] &&
            cells[col] === cells[col + 10] &&
            cells[col] === cells[col + 15] &&
            cells[col] === cells[col + 20]
        ) {
            return true;
        }
    }

    if (
        cells[0] !== "" &&
        cells[0] === cells[6] &&
        cells[0] === cells[12] &&
        cells[0] === cells[18] &&
        cells[0] === cells[24]
    ) {
        return true;
    }


    if (
        cells[4] !== "" &&
        cells[4] === cells[8] &&
        cells[4] === cells[12] &&
        cells[4] === cells[16] &&
        cells[4] === cells[20]
    ) {
        return true;
    }

    return false;
}

newGame.addEventListener("click", function () {

    currentPlayer = "X";
    gameOver = false;

    cells = [];

    board.innerHTML = "";

    for (let i = 0; i < 25; i++) {

        const cell = document.createElement("div");

        cell.classList.add("cell");

        cell.addEventListener("click", function () {
            play(cell, i);
        });

        board.appendChild(cell);
        cells.push("");
    }

    statusPL.textContent = "Player X's turn";
});