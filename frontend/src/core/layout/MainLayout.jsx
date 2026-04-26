import Navbar from "./Navbar";
import Footer from "../../components/Footer";

function MainLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#0b0f1a",
        color: "#e2e8f0",
        fontFamily: "'DM Sans', sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default MainLayout;