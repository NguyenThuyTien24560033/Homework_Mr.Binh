import { checkWinner } from "../util/game.util.js";

let board = Array(25).fill("");
let currentPlayer = "X";
let gameOver = false;

export function getBoard() {
    return {
        board: board,
        currentPlayer: currentPlayer,
        gameOver: gameOver
    };
}

export function makeMove(index) {
    if (gameOver) {
        return { error: "Game is already over" };
    }

    if (index < 0 || index >= 25) {
        return { error: "Invalid cell" };
    }

    if (board[index] !== "") {
        return { error: "Cell is already occupied" };
    }

    board[index] = currentPlayer;

    const winResult = checkWinner(board);

    if (winResult) {
        gameOver = true;

        return {
            ...getBoard(),
            winner: winResult.winner,
            winLine: winResult.winLine
        };
    }

    if (!board.includes("")) {
        gameOver = true;

        return {
            ...getBoard(),
            winner: null,
            winLine: null
        };
    }

    if (currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }

    return {
        ...getBoard(),
        gameOver: false,
        winner: null,
        winLine: null
    };
}

export function skipTurn() {
    if (gameOver) {
        return {
            currentPlayer: currentPlayer,
            gameOver: gameOver
        };
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    return {
        board: board,
        currentPlayer: currentPlayer,
        gameOver: gameOver
    };
}

export function newGame() {
    board = Array(25).fill("");
    currentPlayer = "X";
    gameOver = false;

    return {
        board: board,
        currentPlayer: currentPlayer,
        gameOver: gameOver,
        winner: null
    };
}
