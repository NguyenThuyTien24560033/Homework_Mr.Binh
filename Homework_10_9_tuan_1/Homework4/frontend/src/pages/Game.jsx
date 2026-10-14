import { useEffect, useState } from "react";
import GameBoard from "../components/GameBoard.jsx";
import GameHeader from "../components/GameHeader.jsx";
import GameStatus from "../components/GameStatus.jsx";

import {
    getGameInfo,
    getBoard,
    skipTurn,
    makeMove,
    createNewGame,
} from "../services/game.service.js";

function Game({ user, onLogout }) {
    const [gameInfo, setGameInfo] = useState(null);
    const [board, setBoard] = useState(Array(25).fill(""));
    const [player, setPlayer] = useState("X");
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [winLine, setWinLine] = useState(null);
    const [lastMoveIndex, setLastMoveIndex] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        async function loadGame() {
            try {
                const gameData = await getGameInfo();
                setGameInfo(gameData);

                const boardData = await getBoard();

                setBoard(boardData.board);
                setPlayer(boardData.currentPlayer);
                setGameOver(boardData.gameOver);
            } catch (error) {
                console.log("Error:", error);
            }
        }

        loadGame();
    }, []);

    useEffect(() => {
        if (gameOver) return;

        if (timeLeft === 0) {
            skipTurn()
                .then((data) => {
                    alert(
                        `Timeout! Switched to Player ${data.currentPlayer}'s turn.`
                    );
                    setPlayer(data.currentPlayer);
                    setTimeLeft(10);
                })
                .catch((error) => console.log("Error:", error));

            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((previousTime) => previousTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, gameOver]);

    function handlePlay(index) {
        makeMove(index)
            .then((data) => {
                if (!data.board) {
                    alert(data.message);
                    return;
                }

                setBoard(data.board);
                setPlayer(data.currentPlayer);
                setGameOver(data.gameOver);
                setWinner(data.winner);
                setWinLine(data.winLine || null);
                setLastMoveIndex(index);
                setTimeLeft(10);
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    }

    function handleNewGame() {
        createNewGame()
            .then((data) => {
                setBoard(data.board);
                setPlayer(data.currentPlayer);
                setGameOver(data.gameOver);
                setWinner(data.winner);
                setWinLine(null);
                setLastMoveIndex(null);
                setTimeLeft(10);
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    }

    return (
        <>
            <GameHeader
                username={user?.username}
                onLogout={onLogout}
            />

            <main className="container">
                <h1>Caro Game</h1>

                <GameStatus
                    player={player}
                    gameOver={gameOver}
                    winner={winner}
                    timeLeft={timeLeft}
                />

                <GameBoard
                    board={board}
                    gameOver={gameOver}
                    lastMoveIndex={lastMoveIndex}
                    winLine={winLine}
                    onPlay={handlePlay}
                />

                <button onClick={handleNewGame}>
                    New Game
                </button>
            </main>
        </>
    );
}

export default Game;