import { useState } from "react";
import "./AuthPage.css";

const AUTH_URL = "http://localhost:5000/api/auth";

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${AUTH_URL}/${mode}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(isRegister ? { name: name.trim() } : {}),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      if (!data.user) {
        throw new Error("User details were not returned by the server.");
      }

      onAuthenticated(data.user);
    } catch (err) {
      setError(
        err.message || "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(isRegister ? "login" : "register");
    setError("");
    setPassword("");
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon">M</span>
          <span>
            Mock <span className="auth-accent">&</span> Rock
          </span>
        </div>

        <div className="auth-heading">
          <span className="auth-eyebrow">
            AI INTERVIEW STUDIO
          </span>

          <h1>
            {isRegister
              ? "Create your account"
              : "Welcome back"}
          </h1>

          <p>
            {isRegister
              ? "Start preparing for your next opportunity."
              : "Sign in to continue your interview practice."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={
                isRegister ? "new-password" : "current-password"
              }
              placeholder={
                isRegister
                  ? "At least 8 characters"
                  : "Enter your password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={isRegister ? 8 : undefined}
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isRegister
              ? "Already have an account?"
              : "New to Mock & Rock?"}
          </span>

          <button type="button" onClick={switchMode}>
            {isRegister ? "Sign in" : "Create account"}
          </button>
        </div>

        <p className="auth-footer">
          Practice smarter. Interview better.
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
