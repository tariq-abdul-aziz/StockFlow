import React, {useState} from "react";

const InvoiceMeta = () => {
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
  });

  // handle invoice details
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoiceDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      {/* Invoice Details */}
      <section className="mt-5 bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            Invoice Details
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Invoice Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Invoice Number
            </label>

            <input
              type="text"
              name="invoiceNumber"
              value={invoiceDetails.invoiceNumber}
              onChange={handleInvoiceChange}
              placeholder="INV-1025"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Invoice Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Invoice Date
            </label>

            <input
              type="date"
              name="invoiceDate"
              value={invoiceDetails.invoiceDate}
              onChange={handleInvoiceChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Due Date
            </label>

            <input
              type="date"
              name="dueDate"
              value={invoiceDetails.dueDate}
              onChange={handleInvoiceChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvoiceMeta;
