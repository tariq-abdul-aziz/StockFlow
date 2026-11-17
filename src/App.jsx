import React from "react";
import { Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
import LogIn from "./pages/LogIn";
import CreateInvoice from "./pages/CreateInvoice";
import ProductDetails from "./pages/ProductDetails";
import AddProducts from "./pages/AddProducts";
import CustomerDetails from "./pages/CustomerDetails";
import DocumentViewer from "./pages/DocumentViewer";
import DashboardLayout from "./layouts/DashboardLayout";

const App = () => {
  return (
    <AuthProvider>
      <div className="text-blac">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LogIn />} />

          {/* All Protected Route */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/create" element={<CreateInvoice />} />
            <Route
              path="/invoices/:id"
              element={<DocumentViewer type="invoice" />}
            />
            <Route path="/proforma" element={<ProForma />} />
            <Route
              path="/proforma/:id"
              element={<DocumentViewer type="proforma" />}
            />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<ProductDetails />} />
            <Route path="/inventory/add" element={<AddProducts />} />
            <Route path="/stock-in" element={<StockIn />} />
            <Route path="/stock-out" element={<StockOut />} />
            <Route path="/notepad" element={<Notepad />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
