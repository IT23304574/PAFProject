import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../core/layout/MainLayout";
import Login from "../features/auth/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default AppRoutes;