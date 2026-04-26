import { useContext } from "react";
import { AuthContext } from "../../features/auth/AuthContext";

function Navbar() {
  const auth = useContext(AuthContext);
  const { user, logout } = auth || {}; // Safety net: prevents crash if auth is undefined

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
        {user ? (
          <>
            {user.picture && <img src={user.picture} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />}
            <span>{user.name} ({user.role})</span>
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
          </>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
    </div>
  );
}

export default Navbar;