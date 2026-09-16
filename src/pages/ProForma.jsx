import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {Link} from "react-router"

const ProForma = () => {
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };
  const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return formatDate(newDate);
  };

  const [customer, setCustomer] = useState({
    customerName: "",
    phone: "",
    email: "",
    gstin: "",
    billingAddress: "",
  });

  const [proformaDetails, setProformaDetails] = useState({
    proformaNumber: "",
    issueDate: "",
    validUntil: "",
  });

  const [items, setItems] = useState([
    {
      id: 1,
      product: "",
      quantity: 1,
      rate: "",
    },
  ]);
  const [taxRate, setTaxRate] = useState(18);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const today = new Date();

    const issueDate = formatDate(today);
    const validUntil = addDays(today, 7);

    const lastNumber = Number(localStorage.getItem("lastProformaNumber") || 0);

    const nextNumber = lastNumber + 1;

    const formattedNumber = `PF-${String(nextNumber).padStart(3, "0")}`;

    setProformaDetails({
      proformaNumber: formattedNumber,
      issueDate,
      validUntil,
    });
  }, []);

  const handleItemChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now(),
        product: "",
        quantity: 1,
        rate: "",
      },
    ]);
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subTotal = items.reduce((total, item) => {
    return total + Number(item.quantity) * Number(item.rate);
  }, 0);

  const taxAmount = (subTotal * Number(taxRate)) / 100;

  const total = subTotal + taxAmount;

  const handleSave = () => {
    if (!customer.customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }
    if (!proformaDetails.proformaNumber.trim()) {
      alert("Please enter Pro Forma number.");
      return;
    }
    if (!proformaDetails.issueDate) {
      alert("Please select issue date.");
      return;
    }
    if (!proformaDetails.validUntil) {
      alert("Please select valid until date.");
      return;
    }
    if (
      new Date(proformaDetails.validUntil) < new Date(proformaDetails.issueDate)
    ) {
      alert("Valid Until date cannot be before Issue Date.");
      return;
    }
    const hasInvalidItem = items.some(
      (item) =>
        !item.product.trim() ||
        Number(item.quantity) <= 0 ||
        Number(item.rate) <= 0,
    );
    if (hasInvalidItem) {
      alert("Please complete all item details correctly.");
      return;
    }
    const proforma = {
      customer,
      details: proformaDetails,
      items,
      taxRate: Number(taxRate),
      subTotal,
      taxAmount,
      total,
      notes,
    };
    const currentNumber = Number(
      proformaDetails.proformaNumber.replace("PF-", ""),
    );
    localStorage.setItem("lastProformaNumber", currentNumber.toString());
    console.log("Pro Forma:", proforma);
    alert("Pro Forma is ready to save.");
  };
  return (
    <div className="proformaContainer max-h-screen bg-gray-50 p-4 sm:p-6 lg:-8">
      <div className="subContainer max-w-5xl mx-auto">
        {/* PAGE HEADER */}
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>
        <div className="upper mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Pro Forma
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a quotation for a customer
          </p>
        </div>

        <div className="inputs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customer.customerName}
            onChange={(e) =>
              setCustomer({
                ...customer,
                customerName: e.target.value,
              })
            }
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
          />

          <input
            type="tel"
            placeholder="Phone"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({
                ...customer,
                phone: e.target.value,
              })
            }
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={customer.email}
            onChange={(e) =>
              setCustomer({
                ...customer,
                email: e.target.value,
              })
            }
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
          />

          <input
            type="text"
            placeholder="Billing Address"
            value={customer.billingAddress}
            onChange={(e) =>
              setCustomer({
                ...customer,
                billingAddress: e.target.value,
              })
            }
            className="sm:col-span-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
          />
        </div>

        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-5">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Pro Forma Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Pro Forma Number
              </label>

              <input
                type="text"
                // placeholder="PF-001"
                value={proformaDetails.proformaNumber}
                readOnly
                onChange={(e) =>
                  setProformaDetails({
                    ...proformaDetails,
                    proformaNumber: e.target.value,
                  })
                }
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Issue Date
              </label>

              <input
                type="date"
                value={proformaDetails.issueDate}
                readOnly
                onChange={(e) =>
                  setProformaDetails({
                    ...proformaDetails,
                    issueDate: e.target.value,
                  })
                }
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Valid Until
              </label>

              <input
                type="date"
                value={proformaDetails.validUntil}
                min={proformaDetails.issueDate}
                max={
                  proformaDetails.issueDate
                    ? addDays(proformaDetails.issueDate, 7)
                    : ""
                }
                onChange={(e) =>
                  setProformaDetails({
                    ...proformaDetails,
                    validUntil: e.target.value,
                  })
                }
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Items</h2>

            <button
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg cursor-pointer hover:bg-gray-800"
              onClick={addItem}
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const amount = Number(item.quantity) * Number(item.rate);
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                >
                  {/* PRODUCT */}
                  <div className="sm:col-span-5">
                    <label className="text-sm font-medium text-gray-700">
                      Product
                    </label>

                    <input
                      type="text"
                      value={item.product}
                      onChange={(e) =>
                        handleItemChange(item.id, "product", e.target.value)
                      }
                      placeholder="Enter product"
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                    />
                  </div>

                  {/* QUANTITY */}
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Qty
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(item.id, "quantity", e.target.value)
                      }
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                    />
                  </div>

                  {/* RATE */}
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Rate
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(item.id, "rate", e.target.value)
                      }
                      placeholder="0"
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <div>₹{amount.toLocaleString("en-IN")}</div>
                  </div>

                  {/* REMOVE */}
                  <div className="sm:col-span-1">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="flex items-center justify-center w-full px-2 py-2.5 border border-red-500 rounded-lg text-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <X size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-5">
          <div className="max-w-md ml-auto space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">
                ₹{subTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-center items-center gap-2">
              <span className="text-sm text-gray-500">Tax</span>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-15 border border-gray-200 rounded-lg px-2 text-right"
                />
                <span>%</span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax Amount</span>
              <span className="font-medium">
                ₹{taxAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="font-semibold">Total</span>

              <span className="text-xl font-semibold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Notes / Terms
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add payment terms or additional information
            </p>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Example: This Pro Forma is valid for 15 days."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 resize-none"
          ></textarea>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-5">
          <div className="flex justify-end">
            <button
              className="px-5 oy-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 cursor-pointer"
              onClick={handleSave}
            >
              Save Pro Forma
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProForma;
