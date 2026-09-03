import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const { darkMode, toggleTheme, colors } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: darkMode ? "#0d47a1" : "#1976d2",
    color: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flexWrap: "wrap",
    gap: "10px",
  };

  const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "white",
    color: "#1976d2",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const logoutButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const registerButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const themeButtonStyle = {
    padding: "8px 12px",
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid white",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "20px",
  };

  return (
    <nav style={navStyle}>
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          ✅ Task Manager
        </Link>
      </h2>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={toggleTheme} style={themeButtonStyle}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        {isLoggedIn ? (
          <>
            <Link to="/dashboard">
              <button style={buttonStyle}>Dashboard</button>
            </Link>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button style={buttonStyle}>Login</button>
            </Link>
            <Link to="/register">
              <button style={registerButtonStyle}>Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;