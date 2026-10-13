import { useState } from "react";
import  {loginUser}  from "../services/auth.service.js";

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        <p>Log in to continue playing Caro</p>

        <label htmlFor="login-username">Username</label>
        <input
          id="login-username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username"
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={onSwitchToRegister}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;