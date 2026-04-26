export default function Footer() {
  const footerCols = [
    {
      title: "Platform",
      links: ["Facilities Catalogue", "Booking Management", "Incident Tickets", "Notifications"],
    },
    {
      title: "Admin",
      links: ["User Management", "Role & Permissions", "Analytics Dashboard", "Audit Logs"],
    },
    {
      title: "Help",
      links: ["API Docs", "User Guide", "Report a Bug", "IT3030 Brief"],
    },
  ];

  const statusItems = [
    { label: "API", val: "99.9% uptime" },
    { label: "Auth", val: "Healthy" },
    { label: "DB", val: "Connected" },
  ];

  const stackTags = ["Spring Boot", "React", "OAuth 2.0", "REST API"];

  return (
    <footer
      style={{
        background: "#0f172a",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        marginTop: "3rem",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Top Section ── */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "0.8rem",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              🏛
            </div>

            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#e2e8f0",
                }}
              >
                Smart<span style={{ color: "#3b82f6" }}>Campus</span>
              </div>

              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Operations Hub
              </span>
            </div>
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              lineHeight: 1.6,
              maxWidth: 260,
            }}
          >
            A unified platform for facility bookings, asset management, and
            maintenance ticketing — built for modern universities.
          </p>
        </div>

        {/* Columns */}
        {footerCols.map((col) => (
          <div key={col.title}>
            <h4
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.8rem",
                color: "#e2e8f0",
              }}
            >
              {col.title}
            </h4>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem",
              }}
            >
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    style={{
                      fontSize: "0.85rem",
                      color: "#94a3b8",
                      textDecoration: "none",
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Status Bar ── */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem 1.5rem",
        }}
      >
        <div
          style={{
            background: "rgba(34,197,94,0.05)",
            border: "1px solid rgba(34,197,94,0.15)",
            borderRadius: 8,
            padding: "0.6rem 1rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.8rem",
            color: "#94a3b8",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />

          <span style={{ color: "#22c55e", fontWeight: 600 }}>
            All systems operational
          </span>

          <span style={{ opacity: 0.3 }}>|</span>

          {statusItems.map((s) => (
            <span key={s.label}>
              <strong style={{ color: "#e2e8f0" }}>{s.label}</strong>{" "}
              {s.val}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} SmartCampus Hub — Built for{" "}
            <span style={{ color: "#3b82f6" }}>IT3030 PAF</span>
          </p>

          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {stackTags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.7rem",
                  padding: "0.2rem 0.6rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 999,
                  color: "#94a3b8",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}