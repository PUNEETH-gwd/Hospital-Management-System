import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role
      });

      alert("User registered successfully");
      window.location.href = "/";

    } catch (error) {
      console.log(error);
      alert("Registration failed");
    }
  };

  const containerStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8"
  };

  const boxStyle = {
    width: "350px",
    padding: "30px",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>

        <h2 style={{ textAlign: "center" }}>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <br /><br />

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

        <select
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        >
          <option>Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <br /><br />

        <button
          onClick={register}
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Register
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account? <a href="/">Login</a>
        </p>

      </div>
    </div>
  );
}

export default Register;