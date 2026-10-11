import React from "react";

const InvoiceSummary = ({ summary }) => {
  const subtotal = Number(summary?.subtotal) || 0;
  const taxAmount = Number(summary?.taxAmount) || 0;
  const total = Number(summary?.total) || 0;

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900">
          Invoice Summary
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Summary calculated from individual item GST
        </p>
      </div>

      <div className="max-w-md ml-auto space-y-4">
        {/* SUBTOTAL */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-sm text-gray-900 font-medium">
            ₹
            {subtotal.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* GST Total */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">GST</span>
          <span className="text-gray-900 font-medium">
            ₹
            {taxAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Grand Total</span>
          <span className="text-gray-900 font-medium">
            ₹
            {total.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </section>
  );
};

export default InvoiceSummary;
