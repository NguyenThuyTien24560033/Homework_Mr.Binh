function GameHeader({ username, onLogout }) {
    return (
        <header className="user-header">
            <span>
                Welcome, {username || "Player"}!
            </span>

            <button onClick={onLogout}>
                Log Out
            </button>
        </header>
    );
}

export default GameHeader;