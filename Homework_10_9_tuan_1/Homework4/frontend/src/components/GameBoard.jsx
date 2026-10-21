import "../styles/game-board.css"

function GameBoard({
    board,
    gameOver,
    lastMoveIndex,
    winLine,
    onPlay,
}) {
    return (
        <div className={`board${gameOver ? " disabled" : ""}`}>
            {board.map((value, index) => (
                <div
                    className={
                        "cell " +
                        value +
                        (index === lastMoveIndex ? " last-move" : "")
                    }
                    key={index}
                    onClick={() => onPlay(index)}
                >
                    {value}
                </div>
            ))}

            {winLine && (
                <div
                    className={
                        `winning-line ${winLine.type} ` +
                        `${winLine.type}-${winLine.index}`
                    }
                />
            )}
        </div>
    );
}

export default GameBoard;