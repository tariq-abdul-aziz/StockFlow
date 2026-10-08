import React, { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Printer, Share2 } from "lucide-react";

const InvoiceDetails = () => {
  const { id } = useParams();

  const [invoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });

  const invoice = invoices.find(
    (inv) => inv.invoiceNumber == id || String(inv.id) === String(id),
  );

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Invoice Not Found
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          The invoice with reference <span className="font-mono">{id}</span>{" "}
          does not exist.
        </p>
        <Link
          to="/invoices"
          className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm"
        >
          Back to Invoices
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Invoice ${invoice.invoiceNumber}`,
      text: `Invoice ${invoice.invoiceNumber} for ${invoice.customer?.customerName || "Customer"}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Invoice link copied to clipboard!");
      }
    } catch (err) {
      console.err("Share failed:", err);
    }
  };

  const subtotal = Number(invoice.subtotal || invoice.subtotal || 0);
  const taxRate = Number(invoice.taxRate || 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = Number(invoice.total || subtotal + taxAmount);
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 print:p-0 print:bg-white">
      Top Controls Bar - Hidden on print
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to="/invoices"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Back to Invoices
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer shadow-sm"
          >
            <Share2 size={16} /> Share
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition cursor-pointer shadow-sm"
          >
            <Printer size={16} /> Print / Download PDF
          </button>
        </div>
      </div>
      {/* Invoice Document Canvas */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-700 rounded-xl p-8 sm:p-12 shadow-sm print:shadow-none print:border-none print:p-0 print:max-w-full">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              StockFlow
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Invoice & Inventory Solutions
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">
              Invoice
            </span>
            <h2 className="text-2xl font-mono font-bold text-gray-900 mt-0.5">
              {InvoiceDetails.invoiceNumber}
            </h2>
            <span
              className={`inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                invoice.status === "Paid"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {invoice.status || "Pending"}
            </span>
          </div>
        </div>

        {/* Invoice Meta & Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-gray-200 text-sm">
          <div>
            <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider mb-2">
              Billed To
            </h3>
            <p className="font-bold text-gray-900 text-base">
              {invoice.customer?.customerName || "Walk-in Customer"}
            </p>
            {invoice.customer?.phone && (
              <p className="text-gray-600 mt-1">
                Phone: {invoice.customer.phone}
              </p>
            )}
            {invoice.customer?.email && (
              <p className="text-gray-600">Email: {invoice.customer.email}</p>
            )}
            {invoice.customer?.gstin && (
              <p className="text-gray-600 font-mono mt-0.5">
                GSTIN: {invoice.customer.gstin}
              </p>
            )}
            {invoice.customer?.billingAddress && (
              <p className="text-gray-600 mt-1 whitespace-pre-line">
                {invoice.customer.billingAddress}
              </p>
            )}
          </div>

          <div className="sm:text-right space-y-1.5">
            <div>
              <span className="text-gray-500">Invoice Date: </span>
              <span className="font-medium text-gray-900">
                {invoice.invoiceDate || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Due Date: </span>
              <span className="font-medium text-gray-900">
                {invoice.dueDate || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Item Table */}
        <div className="py-8 border-b border-gray-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase">
                <th className="pb-3">Item Description</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Rate</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(invoice.items || []).map((item, idx) => {
                const lineTotal =
                  (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                return (
                  <tr key={item.id || idx}>
                    <td className="py-4 font-medium text-gray-900">
                      {item.product || "Untitled Product"}
                    </td>
                    <td className="py-4 font-medium text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="py-4 font-medium text-gray-600">
                      ₹
                      {Number(item.rate || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 text-right font-medium text-gray-900">
                      ₹
                      {lineTotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="pt-6 flex justify-end">
          <div className="w-full sm:w-72 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                ₹
                {subtotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Tax ({taxRate}%)</span>
              <span className="font-medium text-gray-900">
                ₹
                {taxAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div>
              <span>Total</span>
              <span>
                ₹
                {total.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Notes / Footer */}
        {invoice.notes && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Notes & Terms
            </h4>
            <p className="text-xs text-gray-600 whitespace-pre-line">
              {invoice.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
