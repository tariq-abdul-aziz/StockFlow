import React from "react";
import { useState } from "react";
import { FilePlusCorner, ChevronLeft } from "lucide-react";
import { Link } from "react-router";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />

            {/* FILTER */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                <option value="">Date</option>
              </select>

              <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                <option value="">Status</option>
              </select>

              <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                <option value="">Payment</option>
              </select>

              <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                <option value="">Customer</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Invoices;
