import React from "react";
import { Routes, Route } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import ProForma from "./pages/ProForma";
import Inventory from "./pages/Inventory";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";
import Notepad from "./pages/Notepad";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import LoginIn from "./pages/LoginIn";
import CreateInvoice from "./pages/CreateInvoice";
import ProductDetails from "./pages/ProductDetails";
import AddProducts from "./pages/AddProducts";

const App = () => {
  return (
    <div className="text-black">
      <Routes>
        <Route path="/" element={<LoginIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/create" element={<CreateInvoice />} />
        <Route path="/proforma" element={<ProForma />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/:id" element={<ProductDetails />} />
        <Route path="/inventory/add" element={<AddProducts />}/>
        <Route path="/stock-in" element={<StockIn />} />
        <Route path="/stock-out" element={<StockOut />} />
        <Route path="/notepad" element={<Notepad />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;
