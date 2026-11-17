import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getProformas } from "../services/firestoreService";
import DocumentPreview from "../components/DocumentPreview";

const ProFormaDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [proforma, setProforma] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProforma = async () => {
      if (!currentUser?.uid) return;
      try {
        const list = await getProformas(currentUser.uid);
        const matched = list.find(
          (pf) =>
            pf.details?.proformaNumber === id || String(pf.id) === String(id),
        );
        setProforma(matched || null);
      } catch (err) {
        console.error("Failed to fetch pro forma:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProforma();
  }, [currentUser, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading Pro Forma...
      </div>
    );
  }

  if (!proforma) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-600 font-medium mb-3">Pro Forma not found.</p>
        <Link
          to="/proforma"
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg"
        >
          Back to Pro Forma
        </Link>
      </div>
    );
  }

  const normalizedData = {
    number: proforma.details?.proformaNumber,
    date: proforma.details?.issueDate,
    dueDate: proforma.details?.validUntil,
    status: "Quotation",
    customer: proforma.customer,
    items: proforma.items,
    defaultTaxRate: proforma.taxRate ?? 18,
    subtotal: proforma.subTotal,
    taxAmount: proforma.taxAmount,
    total: proforma.total,
    notes: proforma.notes,
  };

  return (
    <DocumentPreview
      type="Pro Forma"
      backTo="/proforma"
      backLabel="Back to Pro Forma"
      documentData={normalizedData}
    />
  );
};

export default ProFormaDetails;