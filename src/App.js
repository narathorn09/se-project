import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import RegisterCus from "./components/RegisterCus";
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
          <Route path="/cust" element={<SidebarCust />} />
          {/* <Route path="/owner" element={<SidebarOwner />} /> */}
          <Route path="/owner/profile" element={<SidebarOwner index={0} />} />
          <Route path="/owner/home" element={<SidebarOwner index={1} />} />
          <Route path="/owner/order" element={<SidebarOwner index={2} />} />
          <Route path="/owner/cooking" element={<SidebarOwner index={3} />} />
        </Routes>
      </Router>
    </>
  );
}
