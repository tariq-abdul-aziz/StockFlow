import React from "react";
import { Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
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

const App = () => {
  return (
    <AuthProvider>
      <div className="text-black">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LogIn />} />

          {/* Protectd Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoices/create"
            element={
              <ProtectedRoute>
                <CreateInvoice />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoices/:id"
            element={
              <ProtectedRoute>
                <InvoiceDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/proforma"
            element={
              <ProtectedRoute>
                <ProForma />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory/add"
            element={
              <ProtectedRoute>
                <AddProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock-in"
            element={
              <ProtectedRoute>
                <StockIn />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock-out"
            element={
              <ProtectedRoute>
                <StockOut />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notepad"
            element={
              <ProtectedRoute>
                <Notepad />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <CustomerDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
