import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
    const [page, setPage] = useState("login");
    const [user, setUser] = useState(null);
    const [gameInfo, setGameInfo] = useState(null);

    const [board, setBoard] = useState(Array(25).fill(""));
    const [player, setPlayer] = useState("X");
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [winLine, setWinLine] = useState(null);
    const [lastMoveIndex, setLastMoveIndex] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);
    

    const API_URL = "https://homework-mr-binh-caro.onrender.com";
    // const API_URL = "http://localhost:3000";

    useEffect(() => {
        if (page !== "game") return;

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

    }, [page]);

    useEffect(() => {
        if (page !== "game" || gameOver) return;

        if (timeLeft === 0) {
            fetch(`${API_URL}/api/skip-turn`, {
                method: "POST"
            })
                .then(response => response.json())
                .then(data => {
                    alert(`Timeout! Switched to Player ${data.currentPlayer}'s turn.`);
                    setPlayer(data.currentPlayer);
                    setTimeLeft(10); 
                })
                .catch(error => console.log("Error:", error));
                
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [page, timeLeft, gameOver]); 


    function handleLoginSuccess(userData) {
        setUser(userData);
        setPage("game");
    }

    function handleLogout() {
        setUser(null);
        setPage("login");
    }

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
                setWinLine(data.winLine || null);
                setLastMoveIndex(index);
                setTimeLeft(10);

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
                setWinLine(null);
                setLastMoveIndex(null);
                setTimeLeft(10);

            })
            .catch(error => {
                console.log("Error:", error);
            });
    }

    if (page === "register") {
    return (
        <Register
            onSwitchToLogin={() => setPage("login")}
        />
    );
}

if (page === "login") {
    return (
        <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setPage("register")}
        />
    );
}


    return (

         <>
        <header className="user-header">
            <span>
                Welcome, {user?.username || "Player"}!
            </span>

            <button onClick={handleLogout}>
                Log Out
            </button>
        </header>

        <div className="container">

            <h1>Caro Game</h1>

            {!gameOver && (
                <div className={"timer-box" + (timeLeft <= 3 ? " warning" : "")}>
                    Time: <strong>{timeLeft}s</strong>
                </div>
            )}

            <p>
                {gameOver
                    ? winner
                        ? `Player ${winner} wins!`
                        : "Game Draw!"
                    : `Player ${player}'s turn`
                }
            </p>

            <div className={"board" + (gameOver ? " disabled" : "")}>

                {board.map((value, index) => (

                    <div
                        className={"cell " + value + (index === lastMoveIndex ? " last-move" : "")}
                        key={index}
                        onClick={() => play(index)}
                    >
                        {value}
                    </div>

                ))}

                {winLine && (
                    <div className={`winning-line ${winLine.type} ${winLine.type}-${winLine.index}`} />
                )}
            
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
          </>
    );
}

export default App;