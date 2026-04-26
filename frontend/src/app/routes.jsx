import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;