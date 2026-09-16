import React from "react";
import { Save, Printer, Share2 } from "lucide-react";

const InvoiceActions = ({ onSave, invoiceData }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Invoice ${invoiceData?.invoiceNumber || ""}`,
      text: `Invoice ${invoiceData?.invoiceNumber || ""}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Invoice link copied.");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">

        {/* SHARE */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Share2 size={17} />
          Share
        </button>

        {/* PRINT */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Printer size={17} />
          Print
        </button>

        {/* SAVE */}
        <button
          type="button"
          onClick={onSave}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Save size={17} />
          Save Invoice
        </button>

      </div>
    </section>
  );
};

export default InvoiceActions;