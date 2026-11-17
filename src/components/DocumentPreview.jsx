import { ArrowLeft, Printer, Share2 } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const DocumentPreview = ({
  type = "Invoice",
  backTo = "/Invoices",
  backLabel = "Back to Invoices",
  documentData,
  extraActions = null,
}) => {
  if (!documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `${type} ${documentData.number}`,
      title: `${type} ${documentData.number} for ${documentData.customer?.customerName || "Customer"}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(`${type} link copied to clipboard!`);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };
  const subTotal = Number(documentData.subTotal ?? 0);
  const taxAmount = Number(documentData.taxAmount ?? 0);
  const total = Number(documentData.total ?? subTotal + taxAmount);
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 print:p-0 print:bg-white">
      {/* Top controls bar - hidden on print */}
      <div className='className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden"'>
        <Link
          to={backTo}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> {backLabel}
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {extraActions}

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

      {/* Document */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-8 sm:p-12 shadow-sm print:shadow-none print:border-none print:p-0 print:max-w-full">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              StockFlow
            </h1>
            <p>Invoice & Inventory Solutions</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">
              {type}
            </span>
            <h2 className="text-2xl font-mono font-bold text-gray-900 mt-0.5">
              {documentData.number}
            </h2>
            {documentData.status && (
              <span
                className={`inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  documentData.status === "Paid"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {documentData.status}
              </span>
            )}
          </div>
        </div>

        {/* Meta & Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-gray-200 text-sm">
          <div>
            <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider mb-2">
              {type === "Pro Forma" ? "Quotation For" : "Billed To"}
            </h3>
            <p className="font-bold text-gray-900 text-base">
              {documentData.customer?.customerName || "Walk-in Customer"}
            </p>
            {documentData.customer?.phone && (
              <p className="text-gray-600 mt-1">
                Phone: {documentData.customer.phone}
              </p>
            )}
            {documentData.customer?.email && (
              <p className="text-gray-600">
                Email: {documentData.customer.email}
              </p>
            )}
            {documentData.customer?.gstin && (
              <p className="text-gray-600 font-mono mt-0.5">
                GSTIN: {documentData.customer.gstin}
              </p>
            )}
            {documentData.customer?.billingAddress && (
              <p className="text-gray-600 mt-1 whitespace-pre-line">
                {documentData.customer.billingAddress}
              </p>
            )}
          </div>

          <div className="sm:text-right space-y-1.5">
            <div>
              <span className="text-gray-500">{type} Number: </span>
              <span className="font-medium text-gray-900">
                {documentData.number || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">
                {type === "Pro Forma" ? "Issue Date: " : "Invoice Date: "}
              </span>
              <span className="font-medium text-gray-900">
                {documentData.date || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">
                {type === "Pro Forma" ? "Valid Until: " : "Due Date: "}
              </span>
              <span className="font-medium text-gray-900">
                {documentData.dueDate || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Item Table */}
        <div className="p-8 border-b border-grya-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-400 text-center uppercase">
                <th className="pb-3 text-left">Item Description</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Rate</th>
                <th className="pb-3 text-right">GST %</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y text-center divide-gray-100">
              {(documentData.items | []).map((item, idx) => {
                const lineTotal =
                  (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                return (
                  <tr key={item.id || idx}>
                    <td className="py-4 font-medium text-gray-900 text-left">
                      <div>{item.product || "Untitled Product"}</div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500 font-normal mt-0.5">
                        {item.hsn && <span>HSN: {item.hsn}</span>}
                        {item.selectedSerials?.length > 0 && (
                          <span>SN: {item.selectedSerials.join(", ")}</span>
                        )}
                      </div>
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
                    <td className="py-4 font-medium text-gray-600 text-right">
                      {item.gst ?? documentData.defaultTaxRate ?? 18}%
                    </td>
                    <td className="py-4 font-medium text-gray-900 text-right">
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
          <div className="w-full sm:w-72 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                ₹
                {subTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>GST</span>
              <span className="font-medium text-gray-900">
                ₹
                {taxAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between text-gray-900 font-bold border-t border-gray-200 pt-2 text-base">
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
        {documentData.notes && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Notes & Terms
            </h4>
            <p className="text-xs text-gray-600 whitespace-pre-line">
              {documentData.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPreview;
