import "../styles/game-status.css"
function GameStatus({ player, gameOver, winner, timeLeft }) {
    return (
        <>
            {!gameOver && (
                <div
                    className={
                        "timer-box" +
                        (timeLeft <= 3 ? " warning" : "")
                    }
                >
                    Time: <strong>{timeLeft}s</strong>
                </div>
            )}

            <p>
                {gameOver
                    ? winner
                        ? `Player ${winner} wins!`
                        : "Game Draw!"
                    : `Player ${player}'s turn`}
            </p>

            {gameOver && (
                <h2>
                    {winner
                        ? `Player ${winner} wins!`
                        : "Game Draw!"}
                </h2>
            )}
        </>
    );
}

export default GameStatus;