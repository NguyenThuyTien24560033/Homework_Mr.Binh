import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/auth.service.js";
import "../styles/auth.css";

function Login({ onLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(() => {
    return location.state?.registeredEmail || localStorage.getItem("last_login_email") || "";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      
      localStorage.setItem("last_login_email", email);

      onLoginSuccess(data.user || data);
      navigate("/game");
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

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          autoComplete="username email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          autoComplete="current-password"
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
          <Link to="/register" className="auth-link">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;