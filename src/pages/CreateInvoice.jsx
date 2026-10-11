import React, { useState, useEffect } from "react";
import CustomerDetails from "../components/invoices/CustomerDetails";
import InvoiceMeta from "../components/invoices/InvoiceMeta";
import InvoiceSummary from "../components/invoices/InvoiceSummary";
import InvoiceActions from "../components/invoices/InvoiceActions";
import { Link, useNavigate } from "react-router";
import { products as defaultProducts } from "../components/data/products";
import InvoiceItems from "../components/invoices/InvoiceItems";

const CreateInvoice = () => {
  // customer form data
  const [customer, setCustomer] = useState({
    customerName: "",
    phone: "",
    gstin: "",
    email: "",
    billingAddress: "",
  });

  // Load all saved customers from LocalStorage so we can pick one from a dropdown
  const [savedCustomers] = useState(() => {
    const saved = localStorage.getItem("customers");
    return saved ? JSON.parse(saved) : [];
  });

  // Automatically create the next invoice number (e.g. INV-001) using LocalStorage history
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastNumber = Number(localStorage.getItem("lastInvoiceNumber") || 0);
    const nextNumber = lastNumber + 1;
    const generateInvoiceNumber = `INV-${String(nextNumber).padStart(3, "0")}`;

    setInvoiceDetails({
      invoiceNumber: generateInvoiceNumber,
      invoiceDate: today,
      dueDate: today,
    });
  }, []);

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
  });

  const [summary, setSummary] = useState({
    subtotal: 0,
    taxRate: 0,
    total: 0,
  });

  const [items, setItems] = useState([
    {
      id: Date.now(),
      productId: "",
      product: "",
      quantity: "",
      rate: "",
      gst: 18,
    },
  ]);

  const [notes, setNotes] = useState(() => {
    return localStorage.getItem("defaultInvoiceNotes") || "";
  });

  useEffect(() => {
    localStorage.setItem("defaultInvoiceNotes", notes);
  }, [notes]);

  // Recalculate subtotal, total, tax, and grand total whenever items change
    useEffect(() => {
      let subtotalCalc = 0;
      let taxCalc = 0;

      items.forEach((item) => {
        const lineBase = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
        const lineTax = (lineBase * (Number(item.gst) || 0)) / 100;
        subtotalCalc += lineBase;
        taxCalc += lineTax;
      });

      setSummary({
        subtotal: subtotalCalc,
        taxAmount: taxCalc,
        total: subtotalCalc + taxCalc,
      });
  }, [items]);

  const navigate = useNavigate();

  // Automatically generate invoice number and set today's date when page opens
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastNumber = Number(localStorage.getItem("lastInvoiceNumber") || 0);
    const nextNumber = lastNumber + 1;
    const autoInvoiceNumber = `INV-${String(nextNumber).padStart(3, "0")}`;

    setInvoiceDetails({
      invoiceNumber: autoInvoiceNumber,
      invoiceDate: today,
      dueDate: today,
    });
  }, []);

  // Check required fields and save new invoice into LocalStorage
  const handleSaveInvoice = () => {
    if (!customer.customerName.trim()) {
      alert("Please enter customer name.")
      return;
    }

    // Validate each item and check against available stock
    for (const item of items) {
      if (!item.product) {
        alert("Please select a product for all items.");
        return;
      }
      const qty = Number(item.quantity);
      if (!qty || qty <= 0) {
        alert(`Please enter a valid quantity for ${item.product}.`);
        return;
      }
      if (item.availableStock !== null && item.availableStock !== undefined && qty > item.availableStock) {
        alert(`Quantity for "${item.product}" cannot exceed available stock (${item.availableStock}).`);
        return;
      }
    }
    if (!summary.subtotal || Number(summary.subtotal) <= 0) {
      alert("Please enter a valid subtotal amount.");
      return;
    }

    const subTotalNum = Number(summary.subtotal) || 0;
    const taxRateNum = Number(summary.taxRate) || 0;
    const taxAmount = (subTotalNum * taxRateNum) / 100;
    const total = subTotalNum + taxAmount;

    // Build the complete invoice object
    const newInvoice = {
      id: Date.now(),
      invoiceNumber: invoiceDetails.invoiceNumber,
      invoiceDate: invoiceDetails.invoiceDate,
      dueDate: invoiceDetails.dueDate,
      customer,
      items,
      subtotal: summary.subtotal,
      taxAmount: summary.taxAmount,
      total: summary.total,
      notes,
      status: "Pending",
    };

    // Deduct stock from products in localstorage
    const savedProducts = JSON.parse(localStorage.getItem("products")) || defaultProducts;

    const formattedDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    const updatedProducts = savedProducts.map((prod) => {
      // Find matching item billed in this invoice
      const matchedItem = items.find((it) => Number(it.productId) === Number(prod.id));
      if (!matchedItem) return prod;

      const deductQty = Number(matchedItem.quantity) || 0;
      const nextStock = Math.max(0, Number(prod.currentStock || 0) - deductQty);

      // Create new stock history entry linked to this invoice
      const historyEntry = {
        id: Date.now() + Math.random(),
        date: formattedDate,
        type: "Stock Out",
        reason: `Customer Sale (${invoiceDetails.invoiceNumber})`,
        invoiceNumber: invoiceDetails.invoiceNumber,
        quantity: -deductQty,
      };

      return {
        ...prod,
        currentStock: nextStock,
        stockHistory: [historyEntry, ...(prod.stockHistory || [])],
      };
    });
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // Save updated invoices to localStorage
    const existingInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    localStorage.setItem("invoices", JSON.stringify([newInvoice, ...existingInvoices]));

    // Updated last invoice counter
    const currentCounter = Number(invoiceDetails.invoiceNumber.replace("INV-", ""));
    localStorage.setItem("lastInvoiceNumber", currentCounter.toString());

    const currentNumber = Number(invoiceDetails.invoiceNumber.replace("INV-", ""));
    localStorage.setItem("lastInvoiceNumber", currentNumber.toString());

    alert("Invoice saved successfully!");
    navigate("/invoices");
  };

  // handle customer input
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle invoice details
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoiceDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/invoices"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Invoices
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Invoice
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new invoice for a customer
          </p>
          <div className="flex flex-col">
            <CustomerDetails 
            customer={customer}
            setCustomer={setCustomer}
            savedCustomers={savedCustomers}
            />

            <InvoiceMeta 
            invoiceDetails={invoiceDetails}
            setInvoiceDetails={setInvoiceDetails}
            />
            
            <InvoiceItems 
            items={items}
            setItems={setItems}
            />

            <InvoiceSummary summary={summary} setSummary={setSummary} />

            {/* Notes / Terms Section */}
            <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mt-5">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Notes / Terms
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add payment, terms, bank details, or additional notes
                </p>
              </div>

              <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Example: Payment is due within 15 days. Bank details: AC: 1234567890, IFSC: ABCD0001234"
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 resize-none"
              ></textarea>
            </section>

            <InvoiceActions 
            onSave={handleSaveInvoice}
            invoiceData={invoiceDetails}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
