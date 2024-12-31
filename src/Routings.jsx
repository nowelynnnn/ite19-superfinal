import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login.jsx";
import Dashboard from "./Customer/Dashboard.jsx";
import Products from "./Customer/Products.jsx";
import PurchaseHistory from "./Customer/PurchaseHistory.jsx";
import Admin from "./Admin/Admin.jsx";

const Routings = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/history" element={<PurchaseHistory />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routings;
