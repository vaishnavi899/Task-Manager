export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="navbar">
      <h3>Task Manager</h3>
      <button className="btn" onClick={logout}>Logout</button>
    </div>
  );
}