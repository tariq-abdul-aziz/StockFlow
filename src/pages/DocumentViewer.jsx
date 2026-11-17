import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Printer, Share2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getInvoices, getProformas } from "../services/firestoreService";

const DocumentViewer = ({ type = "invoice" }) => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const isProforma = type === "proforma";
  const label = isProforma ? "Pro Forma" : "Invoice";
  const backPath = isProforma ? "/proforma" : "/invoices";
  const backLabel = isProforma ? "Back to Pro Forma" : "Back to Invoices";

  useEffect(() => {
    const fetchDoc = async () => {
      if (!currentUser?.uid) return;
      try {
        if (isProforma) {
          const all = await getProformas(currentUser.uid);
          const matched = all.find(
            (pf) =>
              pf.details?.proformaNumber === id ||
              String(pf.id) === String(id),
          );
          setDoc(matched || null);
        } else {
          const all = await getInvoices(currentUser.uid);
          const matched = all.find(
            (inv) =>
              inv.invoiceNumber === id || String(inv.id) === String(id),
          );
          setDoc(matched || null);
        }
      } catch (err) {
        console.error(`Failed to fetch ${label}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [currentUser, id, isProforma, label]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <p className="text-sm text-gray-500">Loading {label.toLowerCase()}...</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {label} Not Found
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          The {label.toLowerCase()} with reference{" "}
          <span className="font-mono">{id}</span> does not exist.
        </p>
        <Link
          to={backPath}
          className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm"
        >
          {backLabel}
        </Link>
      </div>
    );
  }

  // Read fields directly from either Invoice or Pro Forma structure
  const docNumber = isProforma ? doc.details?.proformaNumber : doc.invoiceNumber;
  const issueDate = isProforma ? doc.details?.issueDate : doc.invoiceDate;
  const secondDate = isProforma ? doc.details?.validUntil : doc.dueDate;
  const status = isProforma ? "Quotation" : doc.status || "Pending";

  const subtotal = Number(doc.subtotal ?? doc.subTotal ?? 0);
  const taxAmount = Number(
    doc.taxAmount ??
      doc.items?.reduce((sum, item) => {
        const lineBase =
          (Number(item.quantity) || 0) * (Number(item.rate) || 0);
        return sum + (lineBase * (Number(item.gst ?? doc.taxRate ?? 0))) / 100;
      }, 0) ??
      0,
  );
  const total = Number(doc.total ?? subtotal + taxAmount);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `${label} ${docNumber}`,
      text: `${label} ${docNumber} for ${doc.customer?.customerName || "Customer"}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(`${label} link copied to clipboard!`);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 print:p-0 print:bg-white">
      {/* Top Controls Bar - Hidden on print */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to={backPath}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> {backLabel}
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

      {/* Document Canvas */}
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
              {label}
            </span>
            <h2 className="text-2xl font-mono font-bold text-gray-900 mt-0.5">
              {docNumber}
            </h2>
            <span
              className={`inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                status === "Paid"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Meta & Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-gray-200 text-sm">
          <div>
            <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider mb-2">
              {isProforma ? "Quotation For" : "Billed To"}
            </h3>
            <p className="font-bold text-gray-900 text-base">
              {doc.customer?.customerName || "Walk-in Customer"}
            </p>
            {doc.customer?.phone && (
              <p className="text-gray-600 mt-1">Phone: {doc.customer.phone}</p>
            )}
            {doc.customer?.email && (
              <p className="text-gray-600">Email: {doc.customer.email}</p>
            )}
            {doc.customer?.gstin && (
              <p className="text-gray-600 font-mono mt-0.5">
                GSTIN: {doc.customer.gstin}
              </p>
            )}
            {doc.customer?.billingAddress && (
              <p className="text-gray-600 mt-1 whitespace-pre-line">
                {doc.customer.billingAddress}
              </p>
            )}
          </div>

          <div className="sm:text-right space-y-1.5">
            <div>
              <span className="text-gray-500">{label} Number: </span>
              <span className="font-medium text-gray-900">
                {docNumber || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">
                {isProforma ? "Issue Date: " : "Invoice Date: "}
              </span>
              <span className="font-medium text-gray-900">
                {issueDate || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">
                {isProforma ? "Valid Until: " : "Due Date: "}
              </span>
              <span className="font-medium text-gray-900">
                {secondDate || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Item Table */}
        <div className="py-8 border-b border-gray-200 uppercase">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-400 text-center">
                <th className="pb-3 text-left">Item Description</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Rate</th>
                <th className="pb-3 text-right">GST %</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y text-center divide-gray-100">
              {(doc.items || []).map((item, idx) => {
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
                      {item.gst ?? doc.taxRate ?? 18}%
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
        {doc.notes && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Notes & Terms
            </h4>
            <p className="text-xs text-gray-600 whitespace-pre-line">
              {doc.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;