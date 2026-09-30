import React, { useState } from "react";
import CustomerDetails from "../components/invoices/CustomerDetails";
import InvoiceMeta from "../components/invoices/InvoiceMeta";
import InvoiceSummary from "../components/invoices/InvoiceSummary";
import InvoiceActions from "../components/invoices/InvoiceActions";
import { Link } from "react-router";

const CreateInvoice = () => {
  // customer form data
  const [customer, setCustomer] = useState({
    customerName: "",
    phone: "",
    gstin: "",
    email: "",
    billingAddress: "",
  });

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
  });

  const [summary, setSummary] = useState({
    subTotal: "",
    taxRate: "",
  });

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
            />
            <InvoiceMeta 
            invoiceDetails={invoiceDetails}
            setInvoiceDetails={setInvoiceDetails}
            />
            <InvoiceSummary summary={summary} setSummary={setSummary} />
            <InvoiceActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
