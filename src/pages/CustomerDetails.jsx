import { ArrowLeft, Phone, Mail, MapPin, ReceiptText, Eye } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const CustomerDetails = () => {
  const { id } = useParams();

  // Load saved customers from localStorage
  const [customers] = useState(() => {
    const saved = localStorage.getItem("customers");
    return saved ? JSON.parse(saved) : [];
  });

  const customer = customers.find((c) => String(c.id) === String(id));

  const navigate = useNavigate();

  // Load invoices to compute invoice history and tools
  cosnt[invoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });

  // Filter invoices for this specific customer
  const customerInvoices = invoices.filter((inv) => {
    const invPhone = inv.customer?.phone?.trim();
    const invName = inv.customer?.customerName?.trim().toLowerCase();
    const targetPhone = customer?.phone?.trim();
    const targetName = customer?.name?.trim().toLowerCase();

    return (
      (targetPhone && invPhone === targetPhone) ||
      (targetName && invName === targetName)
    );
  });

  const totalBilled = customerInvoices.reduce(
    (sum, inv) => sum + (Number(inv.total) || 0),
    0,
  );

  const pendingAmount = customerInvoices
    .filter((inv) => inv.status === "Pending")
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Customer Not Found
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          No customer found with ID <span className="font-mono">{id}</span>
          <Link
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm"
            to="/customers"
          >
            Back to Customers
          </Link>
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Back to Customers
        </Link>

        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
          <p className="mt-1 text-sm text-gray-500">Customer Profile</p>
        </div>

        {/* Contact & Billing Information */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Contact & Billing Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-xs text-gray-500 block mb-1">
                Phone Number
              </span>
              <div className="flex items-center gap-1.5 font-medium text-gray-800">
                <Phone size={14} className="text-gray-400" />
                {customer.phone || "-"}
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500 block mb-1">
                Email Address
              </span>
              <div className="flex items-center gap-1.5 font-medium text-gray-800">
                <Mail size={14} className="text-gray-400" />
                {customer.email || "-"}
              </div>
            </div>

            <div>
              <span className="tetx-xs text-gray-500 block mb-1">GSTIN</span>
              <span className="font-mono font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block">
                {customer.gstin || "Unregistered"}
              </span>
            </div>

            <div>
              <span className="text-xs texct-gray-500 block mb-1">
                Billing Address
              </span>
              <div className="flex item-start gap-1.5 text-gray-700">
                <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <span>{customer.billingAddress || "-"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-xs font-medium text-gray-500">
              Total Invoices
            </span>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {customerInvoices.length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-xs font-medium text-gray-500">
              Total Billed
            </span>
            <p className="text-2xl font-semibold text-emerald-600 mt-1">
              ₹
              {totalBilled.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-xs font-medium text-gray-500">
              Outstanding Balance
            </span>
            <p className="text-2xl font-semibold text-amber-600 mt-1">
              ₹
              {pendingAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </section>

        {/* Invoice History Table */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ReceiptText size={18} className="text-gray-600" />
              <h2 className="text-base font-semibold text-gray-900">
                Invoice History
              </h2>
              <Link
                to="/invoices/create"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                + Create Invoice
              </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                        <tr>
                            <th className="text-left px-5 py-3">Invoice #</th>
                            <th className="text-left px-5 py-3">Date</th>
                            <th className="text-left px-5 py-3">Amount</th>
                            <th className="text-left px-5 py-3">Status</th>
                            <th className="text-left px-5 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customerInvoices.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                                    No invoices found for this customer.
                                </td>
                            </tr>
                        ) : (
                            customerInvoices.map((inv) => (
                                <tr key={inv.invoiceNumber} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 font-mono font-medium text-gray-900">
                                        {inv.invoiceNumber}
                                    </td>
                                    <td className="px-5 py-4 text-gray-500">
                                        {inv.invoiceDate || "-"}
                                    </td>
                                    <td className="px-5 py-4 text-right font-medium text-gray-900">
                                        ₹{Number(inv.total || 0).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span
                                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                            inv.status === "Paid"
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                            : "bg-amber-50 text-amber-600 border border-amber-100"
                                        }`}
                                        >
                                            {inv.status || "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <button
                                        type="button"
                                        onClick={() => navigate(`/invoices/${inv.invoiceNumber}`)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                        >
                                            <Eye size={13} className="text-gray-500" />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CustomerDetails;
