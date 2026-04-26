import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      backgroundColor: "#1e293b",
      color: "white"
    }}>
      <h2 style={{ margin: 0 }}>Smart Campus</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>{user}</span>

        <button
          onClick={logout}
          style={{
            padding: "6px 12px",
            background: "#ef4444",
            border: "none",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;