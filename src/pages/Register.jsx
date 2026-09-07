import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from '../config/api';


function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    setError("");
    setSuccess("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    if (!hasUpperCase || !hasNumber) {
      setError("Password must contain at least one uppercase letter and one number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoading(false);
        setSuccess("Registration successful!");
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setIsLoading(false);
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setError("Network error. Please check your connection.");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Create an Account</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password (min 6 characters)"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "4px",
              border: "1px solid #ef9a9a",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              borderRadius: "4px",
              border: "1px solid #a5d6a7",
            }}
          >
            ✅ {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isLoading ? "#90caf9" : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <span style={{ color: "#666" }}>Already have an account? </span>
          <Link to="/login" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;