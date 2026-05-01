import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/app.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="container center-box">
      <div className="card">
        <h2>Login</h2>

        <input className="input" placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })} />

        <input className="input" type="password" placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })} />

        <button className="btn" onClick={login}>Login</button>

        <p onClick={() => navigate("/signup")} style={{ cursor: "pointer" }}>
          Don't have an account? Signup
        </p>
      </div>
    </div>
  );
}