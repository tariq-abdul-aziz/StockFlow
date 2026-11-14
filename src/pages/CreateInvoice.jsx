import React, { useState, useEffect } from "react";
import CustomerDetails from "../components/invoices/CustomerDetails";
import InvoiceMeta from "../components/invoices/InvoiceMeta";
import InvoiceSummary from "../components/invoices/InvoiceSummary";
import InvoiceActions from "../components/invoices/InvoiceActions";
import { Link, useNavigate } from "react-router";
import InvoiceItems from "../components/invoices/InvoiceItems";
import { useAuth } from "../context/AuthContext";
import {
  getCustomers,
  getInvoices,
  getProducts,
  saveCustomer,
  saveInvoice,
  saveProduct,
} from "../services/firestoreService";

const CreateInvoice = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [savedCustomers, setSavedCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);

  // customer form data
  const [customer, setCustomer] = useState({
    customerId: null,
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
    subtotal: 0,
    taxAmount: 0,
    total: 0,
  });

  const [items, setItems] = useState([
    {
      id: Date.now(),
      productId: "",
      product: "",
      hsn: "",
      quantity: "",
      rate: "",
      gst: 18,
    },
  ]);

  const [notes, setNotes] = useState(() => {
    return localStorage.getItem("defaultInvoiceNotes") || "";
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load customers, products, and next invoice number from Firebase
  useEffect(() => {
    const loadCloudData = async () => {
      if (!currentUser?.uid) return;
      try {
        const [custList, prodList, invList] = await Promise.all([
          getCustomers(currentUser.uid),
          getProducts(currentUser.uid),
          getInvoices(currentUser.uid),
        ]);

        setSavedCustomers(custList);
        setInventory(prodList);

        const today = new Date().toISOString().split("T")[0];
        let maxNum = 0;
        invList.forEach((inv) => {
          const num = Number((inv.invoiceNumber || "").replace("INV-", ""));
          if (!isNaN(num) && num > maxNum) maxNum = num;
        });

        setInvoiceDetails({
          invoiceNumber: `INV-${String(maxNum + 1).padStart(3, "0")}`,
          invoiceDate: today,
          dueDate: today,
        });
      } catch (err) {
        console.error("Failed to load invoice data:", err);
      }
    };
    loadCloudData();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("defaultInvoiceNotes", notes);
  }, [notes]);

  // Recalculate subtotal, tax, and grand total whenever items change
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

  const handleSaveInvoice = async () => {
    if (isSubmitting || !currentUser?.uid) return;

    if (!customer.customerName.trim()) {
      alert("Please enter customer name");
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
      if (
        item.availableStock !== null &&
        item.availableStock !== undefined &&
        qty > item.availableStock
      ) {
        alert(
          `Quantity for "${item.product}" cannot exceed available stock (${item.availableStock}).`,
        );
        return;
      }

      // If product has serial tracking, verify exact serial count is picked
      if (item.serialTracking) {
        const selectedCount = (item.selectedSerials || []).length;
        if (selectedCount !== qty) {
          alert(
            `Please select exactly ${qty} serial number(s) for "${item.product}". Currently selected: ${selectedCount}`,
          );
          return;
        }
      }
    }

    if (!summary.subtotal || Number(summary.subtotal) <= 0) {
      alert("Please enter a valid subtotal amount.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Save customer if new
      let assignedCustomerId = customer.customerId;
      const matched = savedCustomers.find(
        (c) =>
          (assignedCustomerId && String(c.id) === String(assignedCustomerId)) ||
          (customer.phone && c.phone?.trim() === customer.phone.trim()) ||
          c.name?.trim().toLowerCase() ===
            customer.customerName.trim().toLowerCase(),
      );

      if (matched) {
        assignedCustomerId = matched.id;
      } else {
        assignedCustomerId = Date.now();
        await saveCustomer(currentUser.uid, {
          id: assignedCustomerId,
          name: customer.customerName.trim(),
          phone: customer.phone?.trim() || "",
          email: customer.email?.trim() || "",
          gstin: customer.gstin?.trim() || "",
          billingAddress: customer.billingAddress?.trim() || "",
        });
      }

      // 2. Save invoice to Firebase
      const newInvoice = {
        id: Date.now(),
        invoiceNumber: invoiceDetails.invoiceNumber,
        invoiceDate: invoiceDetails.invoiceDate,
        dueDate: invoiceDetails.dueDate,
        customer: { ...customer, customerId: assignedCustomerId },
        items,
        subtotal: summary.subtotal,
        taxAmount: summary.taxAmount,
        total: summary.total,
        notes,
        inventoryDeducted: true,
        status: "Pending",
      };

      await saveInvoice(currentUser.uid, newInvoice);

      // 3. Deduct stock in Firebase
      const formattedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      for (const item of items) {
        const prod = inventory.find(
          (p) => String(p.id) === String(item.productId),
        );
        if (!prod) continue;

        const deductQty = Number(item.quantity) || 0;
        const nextStock = Math.max(
          0,
          Number(prod.currentStock || 0) - deductQty,
        );

        const historyEntry = {
          id: Date.now() + Math.random(),
          date: formattedDate,
          type: "Stock Out",
          reason: `Customer Sale (${invoiceDetails.invoiceNumber})`,
          invoiceNumber: invoiceDetails.invoiceNumber,
          quantity: -deductQty,
        };

        const remainingSerials =
          prod.serialTracking && item.selectedSerials?.length
            ? (prod.serialNumbers || []).filter(
                (sn) => !item.selectedSerials.includes(sn),
              )
            : prod.serialNumbers || [];

        await saveProduct(currentUser.uid, {
          ...prod,
          currentStock: nextStock,
          serialNumbers: remainingSerials,
          stockHistory: [historyEntry, ...(prod.stockHistory || [])],
        });
      }

      alert("Invoice saved successfully!");
      navigate("/invoices");
    } catch (err) {
      console.error("Failed to save invoice:", err);
      alert("Error saving invoice: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
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
              inventory={inventory}
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
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
