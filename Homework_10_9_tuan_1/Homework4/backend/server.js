const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let board = Array(25).fill("");
let currentPlayer = "X";
let gameOver = false;


// app.get("/api/game", (req, res) => {
//     res.json({
//         game: "Caro",
//         boardSize: "5x5",
//         players: ["X", "O"],
//         rule: "Five in a row wins"
//     });
// });

app.get("/api/board", (req, res) => {
    res.json({
        board: board,
        currentPlayer: currentPlayer,
        gameOver: gameOver
    });
});

app.post("/api/move", (req, res) => {
    const { index } = req.body;

    if (gameOver) {
        return res.status(400).json({
            message: "Game is already over"
        });
    }

    if (index < 0 || index >= 25) {
        return res.status(400).json({
            message: "Invalid cell"
        });
    }

    if (board[index] !== "") {
        return res.status(400).json({
            message: "Cell is already occupied"
        });
    }

    board[index] = currentPlayer;

    const winResult = checkWinner(board);

    if (winResult) {
        gameOver = true;

        return res.json({
            board: board,
            currentPlayer: currentPlayer,
            gameOver: true,
            winner: winResult.winner,
            winLine: winResult.winLine
        });
    }

    if (!board.includes("")) {
        gameOver = true;

        return res.json({
            board: board,
            currentPlayer: currentPlayer,
            gameOver: true,
            winner: null,
            winLine: null
        });
    }

    if (currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }

    res.json({
        board: board,
        currentPlayer: currentPlayer,
        gameOver: false,
        winner: null,
        winLine: null
    });
});

app.post("/api/skip-turn", (req, res) => {
    if (gameOver) {
        return res.json({ currentPlayer, gameOver });
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    
    res.json({
        board: board,
        currentPlayer: currentPlayer,
        gameOver: gameOver
    });
});

function checkWinner(board) {

    for (let row = 0; row < 5; row++) {

        let start = row * 5;

        if (
            board[start] !== "" &&
            board[start] === board[start + 1] &&
            board[start] === board[start + 2] &&
            board[start] === board[start + 3] &&
            board[start] === board[start + 4])
        // ) {
        //     return true;
        // }
        {
            return { winner: board[start], winLine: { type: 'row', index: row } };
        }
    }

    for (let col = 0; col < 5; col++) {

        if (
            board[col] !== "" &&
            board[col] === board[col + 5] &&
            board[col] === board[col + 10] &&
            board[col] === board[col + 15] &&
            board[col] === board[col + 20])
        // ) {
        //     return true;
        // }
        {
            return { winner: board[col], winLine: { type: 'col', index: col } };
        }
    }

    if (
        board[0] !== "" &&
        board[0] === board[6] &&
        board[0] === board[12] &&
        board[0] === board[18] &&
        board[0] === board[24])
    // ) {
    //     return true;
    // }
    {
        return { winner: board[0], winLine: { type: 'diagonal-main', index: 0 } };
    }

    if (
        board[4] !== "" &&
        board[4] === board[8] &&
        board[4] === board[12] &&
        board[4] === board[16] &&
        board[4] === board[20])
    // ) {
    //     return true;
    // }
    {
        return { winner: board[4], winLine: { type: 'diagonal-sub', index: 0 } };
    }

    return null;
}

app.post("/api/new-game", (req, res) => {

    board = Array(25).fill("");
    currentPlayer = "X";
    gameOver = false;

    res.json({
        board: board,
        currentPlayer: currentPlayer,
        gameOver: gameOver,
        winner: null
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});