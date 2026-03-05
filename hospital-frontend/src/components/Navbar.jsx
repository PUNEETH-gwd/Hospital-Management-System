function Navbar() {
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        background: "#222",
        color: "white",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>Hospital Management System</div>

      <div>
        <span style={{ marginRight: "15px" }}>
          Logged in as: {role}
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;