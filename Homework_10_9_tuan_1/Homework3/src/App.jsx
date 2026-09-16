import { useState } from "react";
import "./App.css";

function App() {
    const [board, setBoard] = useState(Array(25).fill(""));
    const [player, setPlayer] = useState("X");
    const [gameOver, setGameOver] = useState(false);

    function play(index) {
        if (board[index] !== "" || gameOver) {
            return;
        }

        const newBoard = [...board];
        newBoard[index] = player;

        setBoard(newBoard);

        if (checkWinner(newBoard)) {
            setGameOver(true);
            return;
        }

        if (!newBoard.includes("")) {
            setGameOver(true);
            return;
        }

        if (player === "X") {
            setPlayer("O");
        } else {
            setPlayer("X");
        }
    }

    function checkWinner(board) {

        for (let row = 0; row < 5; row++) {
            let start = row * 5;

            if (
                board[start] !== "" &&
                board[start] === board[start + 1] &&
                board[start] === board[start + 2] &&
                board[start] === board[start + 3] &&
                board[start] === board[start + 4]
            ) {
                return true;
            }
        }

        for (let col = 0; col < 5; col++) {
            if (
                board[col] !== "" &&
                board[col] === board[col + 5] &&
                board[col] === board[col + 10] &&
                board[col] === board[col + 15] &&
                board[col] === board[col + 20]
            ) {
                return true;
            }
        }

        if (
            board[0] !== "" &&
            board[0] === board[6] &&
            board[0] === board[12] &&
            board[0] === board[18] &&
            board[0] === board[24]
        ) {
            return true;
        }

        // Check other diagonal
        if (
            board[4] !== "" &&
            board[4] === board[8] &&
            board[4] === board[12] &&
            board[4] === board[16] &&
            board[4] === board[20]
        ) {
            return true;
        }

        return false;
    }

    function newGame() {
        setBoard(Array(25).fill(""));
        setPlayer("X");
        setGameOver(false);
    }

    return (
        <div className="container">

            <h1>Caro Game</h1>

            <p>
                {gameOver
                    ? "Game Over!"
                    : `Player ${player}'s turn`}
            </p>

            <div className="board">
                {board.map((value, index) => (
                    <div
                        className="cell"
                        key={index}
                        onClick={() => play(index)}
                    >
                        {value}
                    </div>
                ))}
            </div>

            <button onClick={newGame}>
                New Game
            </button>

        </div>
    );
}

export default App;