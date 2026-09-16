import React, { useState } from "react";

const CustomerDetails = () => {
  // customer form data
  const [customer, setCustomer] = useState({
    customerName: "",
    phone: "",
    gstin: "",
    email: "",
    billingAddress: "",
  });
  // handle customer input
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      <section className="bg-white border- border-gray-200 rounded-xl p-4 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            Customer Details
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Select an existing customer or enter customer details
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid:cols-2 lg:grid:cols-3 gap-4">
          {/* Customer Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Customer Name
            </label>

            <input
              type="text"
              name="customerName"
              placeholder="Enter customer name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
              value={customer.customerName}
              onChange={handleCustomerChange}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
              value={customer.phone}
              onChange={handleCustomerChange}
            />
          </div>

          {/* GSTIN */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">GSTIN</label>

            <input
              type="text"
              name="gstin"
              placeholder="Enter GSTIN"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm uppercase outline-none focus:border-gray-400"
              value={customer.gstin}
              onChange={handleCustomerChange}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
              value={customer.email}
              onChange={handleCustomerChange}
            />
          </div>

          {/* Billing Address */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Billing Address
            </label>

            <input
              type="text"
              name="billingAddress"
              placeholder="Enter billing address"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
              value={customer.billingAddress}
              onChange={handleCustomerChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerDetails;
