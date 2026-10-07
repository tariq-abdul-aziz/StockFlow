import React, { useState } from "react";
import { FilePlusCorner} from "lucide-react";
import { Link } from "react-router";

const Invoices = () => {
  // Get real saved invoices from LocalStorage when the page loads
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });

  // Box to store whatever text you type in the search bar
  const [searchTerm, setSearchTerm] = useState("");

  // Box to store the chosen status filter (e.g. Paid or Pending)
  const [statusFilter, setStatusFilter] = useState("");

  // Filter invoices by customer name, invoice number, or status
  const filteredInvoices = invoices.filter((inv) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
    inv.invoiceNumber?.toLowerCase().includes(search) ||
    inv.customer?.customerName?.toLowerCase().includes(search) ||
    inv.customer?.phone?.includes(search);

    const matchesStatus =
    statusFilter === "" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search and manage all invoice
          </p>
        </div>

        <section className="bg-white border border-gray-200 rounded-xl">
          {/* SECTION HEADER */}
          <div className="p-4 sm-p-5 border-b border-gray-200 flex gap-5 items-center">
            <h2 className="text-base font-semibold text-gray-900">INVOICES</h2>
            <Link to="/invoices/create">
              <button className="cursor-pointer inset-shadow-blue-200 text-xs font-semibold text-blue-600 flex gap-1 items-center">
                <FilePlusCorner size={18} color="#045DC9" />
                Create Invoice
              </button>
            </Link>
          </div>

          {/* SEARCH + FILTER */}
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search invoice / customer / phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />

            {/* FILTER */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Real-time invoices table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <tr>
                  <th className="text-left px-5 py-3">Invoice #</th>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                      No invoices found. Click "+ Create Invoice" to add one.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.invoiceNumber} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-mono font-medium text-gray-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-5 py-4 text-gray-700">
                        {inv.customer?.customerName || "Walk-in Customer"}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {inv.invoiceDate || "-"}
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-gray-900">
                        ₹{Number(inv.total || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${inv.status === "Paid" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                        >
                          {inv.status || "Pending"}
                        </span>
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
  );
};

export default Invoices;
