import { useState } from "react";
import "./App.css";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Game from "./pages/Game.jsx";

function App() {
    const [page, setPage] = useState("login");
    const [user, setUser] = useState(null);

    function handleLoginSuccess(userData) {
        setUser(userData);
        setPage("game");
    }

    function handleLogout() {
        setUser(null);
        setPage("login");
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
        <Game
            user={user}
            onLogout={handleLogout}
        />
    );
}

export default App;