import React from "react";

const InvoiceSummary = ({ summary, setSummary }) => {
  const subtotal = Number(summary.subTotal) || 0;
  const taxRate = Number(summary.taxRate) || 0;

  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSummary((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900">
          Invoice Summary
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter invoice amount and applicable tax
        </p>
      </div>

      <div className="max-w-md ml-auto space-y-4">
        {/* SUBTOTAL */}
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm text-gray-600">Subtotal</label>

          <div className="relative w-44">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              ₹
            </span>

            <input
              type="number"
              name="subtotal"
              min="0"
              value={summary.subtotal}
              onChange={handleChange}
              placeholder="0"
              className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm text-right outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-sm text-gray-600">Tax</label>
          <div className="relative w-44">
            <input
              type="number"
              name="taxRate"
              min="0"
              max="100"
              value={summary.taxRate}
              onChange={handleChange}
              placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-3 pr-8 py-2.5 text-sm text-right outline-none focus:border-gray-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              %
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-500">Tax Amount</span>
          <span className="font-medium text-gray-700">
            ₹
            {taxAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-semibold text-gray-900">
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
