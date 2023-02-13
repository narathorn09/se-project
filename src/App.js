import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import RegisterCus from "./components/RegisterCus";
import RegisterOwner from "./components/RegisterOwner";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/register-customer" element={<RegisterCus />} />
          <Route path="/register-ownerstore" element={<RegisterOwner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Sidebar />} />
        </Routes>
      </Router>
    </>
  );
}
