import {
  IndianRupee,
  Package,
  Printer,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getInvoices, getProducts } from "../services/firestoreService";

const Reports = () => {
  const { currentUser } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const fetchReportData = async () => {
      if (!currentUser?.uid) return;
      try {
        setLoading(true);
        const [invData, prodData] = await Promise.all([
          getInvoices(currentUser.uid),
          getProducts(currentUser.uid),
        ]);
        setInvoices(invData || []);
        setProducts(prodData || []);
      } catch (err) {
        console.error("Failed to load reports data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [currentUser]);

  // Filter invoices by selected date range
  const filteredInvoices = invoices.filter((inv) => {
    if (dateFilter === "all" || !inv.invoiceDate) return true;
    const now = new Date();

    if (dateFilter === "thisMonth") {
      return (
        invDate.getMonth() === now.getMonth() &&
        invDate.getFullYear() === getFullYear()
      );
    }

    if (dateFilter === "last30") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return invDate >= thirtyDaysAgo;
    }
    return true;
  });

  // Core Financial Metrics
  const totalRevenue = filteredInvoices.reduce(
    (sum, inv) => sum + (Number(inv.total) || 0),
    0,
  );

  const collectedRevenue = filteredInvoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  const pendingReceivables = filteredInvoices
    .filter((inv) => inv.status !== "Paid")
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  const totalGstCollected = filteredInvoices.reduce(
    (sum, inv) => sum + (Number(inv.taxAmount) || 0),
    0,
  );

  // Inventory Valuation (Purchase vs Retail)
  const stockCostValue = products.reduce(
    (sum, p) =>
      sum + (Number(p.currentStock) || 0) * (Number(p.purchasePrice) || 0),
    0,
  );

  const stockRetailValue = products.reduce(
    (sum, p) =>
      sum + (Number(p.currentStock) || 0) * (Number(p.sellingPrice) || 0),
    0,
  );

  // Aggregate Top-Selling Prodicts from filtered invoices
  const productSalesMap = {};
  filteredInvoices.forEach((inv) => {
    (inv.items || []).forEach((item) => {
      const key = item.product || "Unnamed Item";
      if (!productSalesMap[key]) {
        productSalesMap[key] = { name: key, qtySold: 0, revenue: 0 };
      }
      const qty = Number(item.quantity) || 0;
      const lineTotal = qty * (Number(item.rate) || 0);
      productSalesMap[key].qtySold += qty;
      productSalesMap[key].revenue += lineTotal;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <p className="text-sm text-gray-500">Generating business reports...</p>
      </div>
    );
  }
  return (
    <div className='"min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 print:bg-white print:p-0"'>
      <div className="max-w-6xl mx-auto">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900 print:hidden"
        >
          ← Back to Dashboard
        </Link>

        {/* HEADER & CONTROLS */}
        <div className="mt-2 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Businees Reports
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Sales performance, tax summary, and inventory valuation
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            >
              <option value="all"> All time</option>
              <option value="thisMonth">This Month</option>
              <option value="last30">Last 30 Days</option>
            </select>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition cursor-pointer"
            >
              <Printer size={16} /> Export PDF
            </button>
          </div>
        </div>

        {/* FINANCIAL KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Total Billed Revenue</span>
              <TrendingUp size={16} className="text-blue-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ₹
              {totalRevenue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Across {filteredInvoices.length} invoice(s)
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Collected Payments</span>
              <IndianRupee size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-semibold text-emerald-600 mt-2">
              ₹
              {collectedRevenue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">Paid Invoices</p>
          </div>

          <div className="text-xs text-gray-400 mt-1">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Pending Receivables</span>
              <ReceiptText size={16} className="text-amber-600" />
            </div>
            <p className="text-2xl font-semibold text-amber-600 mt-2">
              ₹
              {pendingReceivables.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">Awaiting payment</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Total GST Liability</span>
              <Package size={16} className="text-indigo-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ₹
              {totalGstCollected.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">Output tax collected</p>
          </div>
        </section>

        {/* INVENTORY VALUATION & TOP SELLING PRODUCTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory Valuation Breakdown */}
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Inventory Valuation
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Current stock value at cost vs selling price
            </p>

            <div className="space-y-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 block">
                  Purchase Cost Value
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ₹{stockCostValue.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 block">
                  Estimated Retail Value
                </span>
                <span className="text-lg font-semibold text-emerald-600">
                  ₹{stockRetailValue.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100">
                <span className="text-xs text-blue-700 block">
                  Projected Gross Margin
                </span>
                <span className="text-lg font-semibold text-blue-900">
                  ₹
                  {Math.max(
                    0,
                    stockRetailValue - stockCostValue,
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </section>

          {/* Top Selling Products Table */}
          <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Top Selling Products
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Ranked by billed revenue (excluding GST)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                  <tr>
                    <th className="text-left px-5 py-3">Products</th>
                    <th className="text-left px-5 py-3">Units Sold</th>
                    <th className="text-left px-5 py-3">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-5 py-8 text-center text-gray-500"
                      >
                        No sales data recorded for this period
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((prod) => (
                      <tr key={prod.name} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-900">
                          {prod.name}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                          ₹
                          {prod.revenue.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Reports;
