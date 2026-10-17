
import { useEffect, useState } from "react";
import AuthPage from "./components/AuthPage";
import InterviewDashboard from "./InterviewDashboard";

const AUTH_URL = "http://localhost:5000/api/auth";

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);


useEffect(() => {
  let active = true;

  const checkSession = async () => {
    try {
      const response = await fetch(`${AUTH_URL}/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        // Logged-out users ke liye 401 expected hai.
        if (response.status !== 401) {
          console.error(
            "Session check failed:",
            response.status
          );
        }
        return;
      }

      const data = await response.json();

      if (active && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      if (active) {
        console.error(
          "Could not reach authentication server:",
          error.message
        );
      }
    } finally {
      if (active) {
        setCheckingSession(false);
      }
    }
  };

  checkSession();

  return () => {
    active = false;
  };
}, []);


  const handleLogout = async () => {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error.message);
    } finally {
      setUser(null);
    }
  };

  if (checkingSession) {
    return (
      <main className="session-loading">
        <p>Loading your session...</p>
      </main>
    );
  }

  if (!user) {
    return <AuthPage onAuthenticated={setUser} />;
  }

  return (
    <InterviewDashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;
