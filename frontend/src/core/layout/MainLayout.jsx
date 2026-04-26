import Navbar from "./Navbar";
import Footer from "../../components/Footer";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      <Navbar />

      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;