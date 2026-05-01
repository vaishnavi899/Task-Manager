import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/app.css";

export default function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member"
  });

  const navigate = useNavigate();

  const signup = async () => {
    try {
      await API.post("/auth/signup", data);
      alert("Signup successful");
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="container center-box">
      <div className="card">
        <h2>Signup</h2>

        <input className="input" placeholder="Name"
          onChange={(e) => setData({ ...data, name: e.target.value })} />

        <input className="input" placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })} />

        <input className="input" type="password" placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })} />

        <select className="input"
          onChange={(e) => setData({ ...data, role: e.target.value })}>
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>

        <button className="btn" onClick={signup}>Signup</button>

        <p onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}