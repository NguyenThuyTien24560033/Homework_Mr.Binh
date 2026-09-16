// const express = require("express");

// const app = express();

// const PORT = process.env.PORT || 3000;

// app.use(express.json());


// // GET /
// app.get("/", (req, res) => {
//     res.json({
//         message: "Hello World - Caro Game API"
//     });
// });


// // GET game information
// app.get("/api/game", (req, res) => {
//     res.json({
//         game: "Caro",
//         boardSize: "5x5",
//         players: ["X", "O"],
//         rule: "Five in a row wins"
//     });
// });


// // GET empty board
// app.get("/api/board", (req, res) => {
//     res.json({
//         board: Array(25).fill(""),
//         currentPlayer: "X"
//     });
// });


// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Hello World - Caro Game API"
    });
});

app.get("/api/game", (req, res) => {
    res.json({
        game: "Caro",
        boardSize: "5x5",
        players: ["X", "O"],
        rule: "Five in a row wins"
    });
});

app.get("/api/board", (req, res) => {
    res.json({
        board: Array(25).fill(""),
        currentPlayer: "X"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});