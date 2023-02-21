import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import RegisterCus from "./components/RegisterCust";
import RegisterOwner from "./components/RegisterOwner";
import SidebarCust from "./components/SidebarCust";
import SidebarOwner from "./components/SidebarOwner";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/register-customer" element={<RegisterCus />} />
          <Route path="/register-ownerstore" element={<RegisterOwner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          {/* Section Customer */}
          <Route path="/cust/profile" element={<SidebarCust index={0} />} />
          <Route path="/cust/home" element={<SidebarCust index={1} />} />
          <Route path="/cust/cart" element={<SidebarCust index={2} />} />
          <Route path="/cust/order" element={<SidebarCust index={3} />} />
          {/* Section Owner */}
          <Route path="/owner/profile" element={<SidebarOwner index={0} />} />
          <Route path="/owner/home" element={<SidebarOwner index={1} />} />
          <Route path="/owner/order" element={<SidebarOwner index={2} />} />
          <Route path="/owner/cooking" element={<SidebarOwner index={3} />} />
        </Routes>
      </Router>
    </>
  );
}
