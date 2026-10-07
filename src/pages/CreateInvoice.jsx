import React, { useState, useEffect } from "react";
import CustomerDetails from "../components/invoices/CustomerDetails";
import InvoiceMeta from "../components/invoices/InvoiceMeta";
import InvoiceSummary from "../components/invoices/InvoiceSummary";
import InvoiceActions from "../components/invoices/InvoiceActions";
import { Link, useNavigate } from "react-router";
import { products } from "../components/data/products";
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
    subtotal: "",
    taxRate: localStorage.getItem("defaultTaxRate") ?? "18",
  });

  useEffect(() => {
    if (summary.taxRate !== "") {
      localStorage.setItem("defaultTaxRate", summary.taxRate);
    }
  }, [summary.taxRate]);

  const [items, setItems] = useState([
    {
      id: Date.now(),
      product: "",
      quantity: 1,
      rate: "",
    },
  ]);

    useEffect(() => {
    const calculatedSubtotal = items.reduce((sum, item) => {
      return sum + (Number(item.quantity || 0) * (Number(item.rate) || 0))
    }, 0);

    setSummary((prev) => ({
      ...prev, subtotal: calculatedSubtotal > 0 ? calculatedSubtotal : prev.subtotal,
    }));
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
      subtotal: subTotalNum,
      taxRate: taxRateNum,
      total,
      status: "Pending",
    };

    // Save updated list to LocalStorage
    const existingInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    localStorage.setItem("invoices", JSON.stringify([newInvoice, ...existingInvoices]));

    // Updated last invoice counter for future numbering
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
