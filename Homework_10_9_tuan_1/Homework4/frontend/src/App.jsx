import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/App.css";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Game from "./pages/Game.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { getCurrentUser, logoutUser } from "./services/auth.service.js";

function App() {
    const [user, setUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Kiểm tra token cũ khi mở trang hoặc F5
    useEffect(() => {
        async function checkSession() {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
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
    }

    function handleLogout() {
        logoutUser();
        setUser(null);
    }

    if (isCheckingAuth) {
        return (
            <div style={{ textAlign: "center", marginTop: "20%" }}>
                <p>Loading</p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        user ? (
                            <Navigate to="/game" replace />
                        ) : (
                            <Login onLoginSuccess={handleLoginSuccess} />
                        )
                    }
                />
                <Route
                    path="/register"
                    element={
                        user ? (
                            <Navigate to="/game" replace />
                        ) : (
                            <Register />
                        )
                    }
                />

                <Route
                    path="/game"
                    element={
                        <ProtectedRoute user={user}>
                            <Game user={user} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/game" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;