import { useEffect, useState } from "react";
import "./App.css";

function App() {

    const [gameInfo, setGameInfo] = useState(null);

    const [board, setBoard] = useState(Array(25).fill(""));
    const [player, setPlayer] = useState("X");
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);

    const API_URL = "https://homework-mr-binh-caro.onrender.com";
    // const API_URL = "http://localhost:3000";

    useEffect(() => {

        fetch(`${API_URL}/api/game`)
            .then(response => response.json())
            .then(data => {
                setGameInfo(data);
            })
            .catch(error => {
                console.log("Error:", error);
            });

        fetch(`${API_URL}/api/board`)
            .then(response => response.json())
            .then(data => {
                setBoard(data.board);
                setPlayer(data.currentPlayer);
                setGameOver(data.gameOver);
            })
            .catch(error => {
                console.log("Error:", error);
            });

    }, []);

    function play(index) {

        fetch(`${API_URL}/api/move`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                index: index
            })
        })
            .then(response => response.json())
            .then(data => {

                if (!data.board) {
                    alert(data.message);
                    return;
                }

                setBoard(data.board);
                setPlayer(data.currentPlayer);
                setGameOver(data.gameOver);
                setWinner(data.winner);

            })
            .catch(error => {
                console.log("Error:", error);
            });
    }

    function newGame() {

        fetch(`${API_URL}/api/new-game`, {
            method: "POST"
        })
            .then(response => response.json())
            .then(data => {

                setBoard(data.board);
                setPlayer(data.currentPlayer);
                setGameOver(data.gameOver);
                setWinner(data.winner);

            })
            .catch(error => {
                console.log("Error:", error);
            });
    }

    return (
        <div className="container">

            <h1>Caro Game</h1>

            {gameInfo && (
                <p>
                    {gameInfo.game} - {gameInfo.boardSize}
                </p>
            )}

            <p>
                {gameOver
                    ? winner
                        ? `Player ${winner} wins!`
                        : "Game Draw!"
                    : `Player ${player}'s turn`
                }
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

            {gameOver && (
                <h2>
                    {winner
                        ? `Player ${winner} wins!`
                        : "Game Draw!"
                    }
                </h2>
            )}

            <button onClick={newGame}>
                New Game
            </button>

        </div>
    );
}

export default App;