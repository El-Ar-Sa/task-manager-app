import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{
      maxWidth: "800px",
      margin: "80px auto",
      padding: "40px",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        🚀 Welcome to Task Manager
      </h1>
      <p style={{ fontSize: "20px", color: "#666", marginBottom: "40px" }}>
        Organize your tasks efficiently and boost your productivity
      </p>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/register">
          <button style={{
            padding: "15px 40px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            Get Started
          </button>
        </Link>
        <Link to="/login">
          <button style={{
            padding: "15px 40px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            Login
          </button>
        </Link>
      </div>

      <div style={{ 
        marginTop: "60px", 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "30px" 
      }}>
        <div style={{ 
          padding: "20px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "8px" 
        }}>
          <h3>📝 Create Tasks</h3>
          <p style={{ color: "#666" }}>Add and organize your tasks easily</p>
        </div>
        <div style={{ 
          padding: "20px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "8px" 
        }}>
          <h3>✅ Track Progress</h3>
          <p style={{ color: "#666" }}>Mark tasks as complete</p>
        </div>
        <div style={{ 
          padding: "20px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "8px" 
        }}>
          <h3>🔒 Secure</h3>
          <p style={{ color: "#666" }}>Your tasks are private and secure</p>
        </div>
      </div>
    </div>
  );
}

export default Home;