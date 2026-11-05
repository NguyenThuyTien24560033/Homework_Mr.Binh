import { useEffect, useState } from "react";
import GameBoard from "../components/GameBoard.jsx";
import GameHeader from "../components/GameHeader.jsx";
import GameStatus from "../components/GameStatus.jsx";
import { socket } from "../services/socket.js";
import "../styles/game.css";
import "../styles/room.css";

function checkWinnerLocal(cells) {
    for (let r = 0; r < 5; r++) {
        const s = r * 5;
        if (cells[s] && cells[s] === cells[s + 1] && cells[s] === cells[s + 2] && cells[s] === cells[s + 3] && cells[s] === cells[s + 4]) {
            return { winner: cells[s], winLine: { type: "row", index: r } };
        }
    }
    for (let c = 0; c < 5; c++) {
        if (cells[c] && cells[c] === cells[c + 5] && cells[c] === cells[c + 10] && cells[c] === cells[c + 15] && cells[c] === cells[c + 20]) {
            return { winner: cells[c], winLine: { type: "col", index: c } };
        }
    }
    if (cells[0] && cells[0] === cells[6] && cells[0] === cells[12] && cells[0] === cells[18] && cells[0] === cells[24]) {
        return { winner: cells[0], winLine: { type: "diagonal-main", index: 0 } };
    }
    if (cells[4] && cells[4] === cells[8] && cells[4] === cells[12] && cells[4] === cells[16] && cells[4] === cells[20]) {
        return { winner: cells[4], winLine: { type: "diagonal-sub", index: 0 } };
    }
    return null;
}

function Game({ user, onLogout }) {
    const [mode, setMode] = useState("local");
    const [board, setBoard] = useState(Array(25).fill(""));
    const [currentPlayer, setCurrentPlayer] = useState("X");
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [winLine, setWinLine] = useState(null);
    const [lastMoveIndex, setLastMoveIndex] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);

    const [roomId, setRoomId] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [myRole, setMyRole] = useState("");
    const [opponentJoined, setOpponentJoined] = useState(false);

    useEffect(() => {
        const canRun = (mode === "local" && !gameOver) || (mode === "online" && !gameOver && roomId && opponentJoined);
        if (!canRun) return;

        if (timeLeft === 0) {
            if (mode === "local") {
                const nextPlayer = currentPlayer === "X" ? "O" : "X";
                setCurrentPlayer(nextPlayer);
                setTimeLeft(10);
                alert(`Timeout! Switched to Player ${nextPlayer}'s turn.`);
            } else {
                socket.emit("skip_turn", { roomId });
                setTimeLeft(10);
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, gameOver, mode, roomId, opponentJoined, currentPlayer]);

    useEffect(() => {
        function handleRoomCreated(data) {
            setRoomId(data.roomId);
            setMyRole(data.role);
            setBoard(data.room.board);
            setCurrentPlayer(data.room.currentPlayer);
            setGameOver(false);
            setWinner(null);
            setWinLine(null);
            setOpponentJoined(false);
            setTimeLeft(10);
        }

        function handleRoomJoined(data) {
            setRoomId(data.roomId);
            setMyRole(data.role);
            setBoard(data.room.board);
            setCurrentPlayer(data.room.currentPlayer);
            setGameOver(false);
            setWinner(null);
            setWinLine(null);
            setOpponentJoined(true);
            setTimeLeft(10);
        }

        function handleGameStart(data) {
            setBoard(data.room.board);
            setCurrentPlayer(data.room.currentPlayer);
            setOpponentJoined(true);
            setGameOver(false);
            setWinner(null);
            setWinLine(null);
            setTimeLeft(10);
        }

        function handleMoveMade(data) {
            setBoard(data.room.board);
            setCurrentPlayer(data.room.currentPlayer);
            setGameOver(data.room.gameOver);
            setWinner(data.room.winner);
            setWinLine(data.room.winLine);
            setLastMoveIndex(data.lastMoveIndex);
            setTimeLeft(10);
        }

        function handleTurnSkipped(data) {
            setCurrentPlayer(data.room.currentPlayer);
            setTimeLeft(10);
            alert(`Timeout! Switched to Player ${data.room.currentPlayer}'s turn.`);
        }

        function handleGameRestarted(data) {
            setBoard(data.room.board);
            setCurrentPlayer(data.room.currentPlayer);
            setGameOver(false);
            setWinner(null);
            setWinLine(null);
            setLastMoveIndex(null);
            setTimeLeft(10);
        }

        function handleOpponentLeft(message) {
            alert(message);
            resetOnlineState();
        }

        function handleErrorMessage(message) {
            alert(message);
        }

        socket.on("room_created", handleRoomCreated);
        socket.on("room_joined", handleRoomJoined);
        socket.on("game_start", handleGameStart);
        socket.on("move_made", handleMoveMade);
        socket.on("turn_skipped", handleTurnSkipped);
        socket.on("game_restarted", handleGameRestarted);
        socket.on("opponent_left", handleOpponentLeft);
        socket.on("error_message", handleErrorMessage);

        return () => {
            socket.off("room_created", handleRoomCreated);
            socket.off("room_joined", handleRoomJoined);
            socket.off("game_start", handleGameStart);
            socket.off("move_made", handleMoveMade);
            socket.off("turn_skipped", handleTurnSkipped);
            socket.off("game_restarted", handleGameRestarted);
            socket.off("opponent_left", handleOpponentLeft);
            socket.off("error_message", handleErrorMessage);
        };
    }, []);

    function resetOnlineState() {
        setRoomId("");
        setMyRole("");
        setOpponentJoined(false);
        setBoard(Array(25).fill(""));
        setCurrentPlayer("X");
        setGameOver(false);
        setWinner(null);
        setWinLine(null);
        setLastMoveIndex(null);
        setTimeLeft(10);
    }

    function switchMode(newMode) {
        if (mode === "online" && roomId) {
            socket.disconnect();
            socket.connect();
        }
        setMode(newMode);
        resetOnlineState();
        setTimeLeft(10);
    }

    function handleCreateRoom() {
        socket.emit("create_room", { username: user?.username || "Player" });
    }

    function handleJoinRoom() {
        if (!joinCode.trim()) {
            alert("Please enter a room code!");
            return;
        }
        socket.emit("join_room", { roomId: joinCode.trim(), username: user?.username || "Player" });
    }

    function handleLeaveRoom() {
        socket.disconnect();
        socket.connect();
        resetOnlineState();
    }

    function handlePlay(index) {
        if (gameOver || board[index] !== "") return;

        if (mode === "local") {
            const nextBoard = [...board];
            nextBoard[index] = currentPlayer;
            setBoard(nextBoard);
            setLastMoveIndex(index);
            setTimeLeft(10);

            const winResult = checkWinnerLocal(nextBoard);
            if (winResult) {
                setGameOver(true);
                setWinner(winResult.winner);
                setWinLine(winResult.winLine);
                return;
            }

            if (!nextBoard.includes("")) {
                setGameOver(true);
                setWinner(null);
                setWinLine(null);
                return;
            }

            setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
        } else {
            if (!roomId) {
                alert("Please create or join a room first!");
                return;
            }
            if (!opponentJoined) {
                alert("Waiting for an opponent to join!");
                return;
            }
            if (currentPlayer !== myRole) {
                alert("It is not your turn!");
                return;
            }

            socket.emit("make_move", { roomId, index });
        }
    }

    function handleNewGame() {
        if (mode === "local") {
            setBoard(Array(25).fill(""));
            setCurrentPlayer("X");
            setGameOver(false);
            setWinner(null);
            setWinLine(null);
            setLastMoveIndex(null);
            setTimeLeft(10);
        } else {
            if (!roomId) return;
            socket.emit("restart_game", { roomId });
        }
    }

    return (
        <>
            <GameHeader username={user?.username} onLogout={onLogout} />

            <main className="container">
                <h1>Caro Game</h1>

                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${mode === "local" ? "active" : ""}`}
                        onClick={() => switchMode("local")}
                    >
                        Same Device (Local)
                    </button>
                    <button
                        className={`mode-btn ${mode === "online" ? "active" : ""}`}
                        onClick={() => switchMode("online")}
                    >
                        Two Devices (Online)
                    </button>
                </div>

                {mode === "online" && (
                    <div className="room-panel">
                        {!roomId ? (
                            <>
                                <div className="room-actions">
                                    <button className="action-btn" onClick={handleCreateRoom}>
                                        Create Room
                                    </button>
                                </div>
                                <div className="room-actions">
                                    <input
                                        className="room-input"
                                        type="text"
                                        placeholder="Enter 4-digit room code"
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value)}
                                        maxLength={4}
                                    />
                                    <button className="action-btn secondary" onClick={handleJoinRoom}>
                                        Join Room
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="room-info-badge">
                                <span>Room: #{roomId} | You: Player {myRole}</span>
                                <button className="leave-btn" onClick={handleLeaveRoom}>
                                    Leave
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {mode === "online" && roomId && !opponentJoined && (
                    <p style={{ color: "#d97706", fontWeight: 600, textAlign: "center" }}>
                        Waiting for opponent to join... Share room code: <strong>{roomId}</strong>
                    </p>
                )}

                {mode === "online" && roomId && opponentJoined && (
                    <p style={{ fontWeight: 600, color: currentPlayer === myRole ? "#0284c7" : "#64748b" }}>
                        {currentPlayer === myRole ? "Your turn!" : "Waiting for opponent's turn..."}
                    </p>
                )}

                <GameStatus
                    player={currentPlayer}
                    gameOver={gameOver}
                    winner={winner}
                    timeLeft={timeLeft}
                />

                <GameBoard
                    board={board}
                    gameOver={gameOver || (mode === "online" && (!roomId || !opponentJoined))}
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