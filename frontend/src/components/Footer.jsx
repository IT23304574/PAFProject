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
    { label: "API",  val: "99.9% uptime" },
    { label: "Auth", val: "Healthy"       },
    { label: "DB",   val: "Connected"     },
  ];

  const stackTags = ["Spring Boot", "React", "OAuth 2.0", "REST API"];

  return (
    <footer style={{ background:"#111827", borderTop:"1px solid rgba(255,255,255,0.07)" }}>

      {/* ── Upper grid ── */}
      <div style={{
        maxWidth:1280, margin:"0 auto", padding:"3rem 2rem 2rem",
        display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1fr", gap:"3rem",
      }}>

        {/* Brand */}
        <div>
          <a href="#" style={{ display:"flex", alignItems:"center", gap:"0.6rem", textDecoration:"none", marginBottom:"0.85rem" }}>
            <div style={{
              width:36, height:36, borderRadius:8,
              background:"linear-gradient(135deg,#3b82f6,#06b6d4)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, boxShadow:"0 0 18px rgba(59,130,246,0.35)",
            }}>🏛</div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.15rem", letterSpacing:"-0.01em", color:"#f1f5f9", lineHeight:1.1 }}>
                Smart<span style={{ color:"#3b82f6" }}>Campus</span>
              </div>
              <span style={{ fontSize:"0.6rem", fontWeight:400, color:"#64748b", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                Operations Hub
              </span>
            </div>
          </a>
          <p style={{ fontSize:"0.85rem", color:"#64748b", lineHeight:1.7, maxWidth:260 }}>
            A unified platform for facility bookings, asset management, and
            maintenance ticketing — built for modern universities.
          </p>
          {/* Socials */}
          <div style={{ display:"flex", gap:"0.5rem", marginTop:"1.2rem" }}>
            {["𝕏","in","⌥","⊕"].map((icon, i) => (
              <a key={i} href="#" style={{
                width:34, height:34, border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:8, background:"transparent", color:"#64748b",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, textDecoration:"none", cursor:"pointer",
              }}>{icon}</a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {footerCols.map(col => (
          <div key={col.title}>
            <h4 style={{
              fontFamily:"'Syne',sans-serif", fontWeight:700,
              fontSize:"0.8rem", letterSpacing:"0.1em", textTransform:"uppercase",
              color:"#f1f5f9", marginBottom:"1rem",
            }}>{col.title}</h4>
            <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {col.links.map(link => (
                <li key={link}>
                  <a href="#" style={{
                    fontSize:"0.85rem", color:"#64748b", textDecoration:"none",
                    display:"flex", alignItems:"center", gap:"0.4rem",
                  }}>
                    <span style={{ width:4, height:4, borderRadius:"50%", background:"rgba(255,255,255,0.1)", flexShrink:0, display:"inline-block" }} />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Status strip ── */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 2rem 1.5rem" }}>
        <div style={{
          background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.18)",
          borderRadius:10, padding:"0.7rem 1.2rem",
          display:"flex", alignItems:"center", gap:"0.75rem",
          fontSize:"0.82rem", color:"#64748b", flexWrap:"wrap",
        }}>
          <span style={{
            width:8, height:8, borderRadius:"50%", background:"#22c55e",
            boxShadow:"0 0 8px #22c55e", flexShrink:0, display:"inline-block",
          }} />
          <span style={{ color:"#22c55e", fontWeight:600 }}>All systems operational</span>
          <span style={{ color:"rgba(255,255,255,0.07)" }}>|</span>
          <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
            {statusItems.map(s => (
              <span key={s.label} style={{ display:"flex", alignItems:"center", gap:"0.35rem" }}>
                <span style={{ color:"#f1f5f9", fontWeight:500 }}>{s.label}</span> {s.val}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{
          maxWidth:1280, margin:"0 auto", padding:"1rem 2rem",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:"1rem", flexWrap:"wrap",
        }}>
          <p style={{ fontSize:"0.78rem", color:"#64748b" }}>
            © 2026 SmartCampus Hub — Built for{" "}
            <span style={{ color:"#3b82f6" }}>IT3030 PAF</span> · SLIIT Faculty of Computing
          </p>
          <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
            {stackTags.map(tag => (
              <span key={tag} style={{
                fontSize:"0.7rem", padding:"0.2rem 0.6rem",
                border:"1px solid rgba(255,255,255,0.07)", borderRadius:100, color:"#64748b",
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
