import { useState, useEffect } from "react";
import "./styles/App.css";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Game from "./pages/Game.jsx";
import { getCurrentUser, logoutUser } from "./services/auth.service.js";

function App() {
    const [page, setPage] = useState("login");
    const [user, setUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    
    useEffect(() => {
        async function checkSession() {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    setPage("game");
                }
            } catch (error) {
                console.error("Session check error:", error);
            } finally {
                setIsCheckingAuth(false);
            }
        }

        checkSession();
    }, []);

    function handleLoginSuccess(userData) {
        setUser(userData);
        setPage("game");
    }

    function handleLogout() {
        logoutUser();
        setUser(null);
        setPage("login");
    }

    if (isCheckingAuth) {
        return (
            <div style={{ textAlign: "center", marginTop: "20%" }}>
                <p>Loading...</p>
            </div>
        );
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