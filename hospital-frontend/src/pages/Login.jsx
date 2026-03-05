import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") navigate("/admin");
      if (res.data.role === "doctor") navigate("/doctor");
      if (res.data.role === "patient") navigate("/patient");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8"
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center" }}>Hospital Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <br /><br />

        <button
          style={{ width: "100%",padding: "8px" }}
          onClick={handleLogin}
        >
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;