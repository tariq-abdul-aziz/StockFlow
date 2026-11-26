import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ScanLine,
  Plus,
  Trash2,
  Copy,
  CloudUpload,
  ArrowDownToLine,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getProducts,
  saveProduct,
  getSerialBatches,
  saveSerialBatch,
} from "../services/firestoreService";
import SerialScannerModal from "../components/SerialScannerModal";

const STORAGE_KEY = "scannedSerialPad";

const Notepad = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Temporary staging list in LocalStorage while scanning & editing
  const [serialList, setSerialList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const [batchLabel, setBatchLabel] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [showScanner, setShowScanner] = useState(
    searchParams.get("scan") === "true",
  );
  const [copied, setCopied] = useState(false);
  const [savingcloud, setSavingCloud] = useState(false);

  // Saved Cloud Batches & Inventory Products
  const [savedBatches, setSavedBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [savingStock, setSavingStock] = useState(false);

  // Sync draft list to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialList));
  }, [serialList]);

  // Fetch products & cloud-saved serial batches
  useEffect(() => {
    const loadCloudData = async () => {
      if (!currentUser?.uid) return;
      try {
        const [prodList, batches] = await Promise.all([
          getProducts(currentUser.uid),
          getSerialBatches(currentUser.uid),
        ]);
        setProducts(prodList || []);
        setSavedBatches(batches || []);
      } catch (err) {
        console.log("Failed to load Notepad cloud data:", err);
      }
    };
    loadCloudData();
  }, [currentUser]);

  const handleAddSerial = (value) => {
    const clean = value.trim();
    if (!clean) return;
    if (serialList.some((item) => item.value === clean)) {
      alert(`Serial "${clean} is already in your staging list."`);
      return;
    }
    setSerialList((prev) => [
      { id: Date.now + Math.random(), value: clean },
      ...prev,
    ]);
  };

  const handleEditSerial = (id, newValue) => {
    setSerialList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, value: newValue } : item,
      ),
    );
  };

  const handleRemoveSerial = (id) => {
    setSerialList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCopyAll = async () => {
    if (serialList.length === 0) return;
    await navigator.clipboard.writeText(
      serialList.map((s) => s.value).join("\n"),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save staging list to Firebase Cloud and clear localstorage
  const handleSaveToCloud = async () => {
    if (!currentUser?.uid || serialList.length === 0 || savingcloud) return;

    const cleanSerials = serialList.map((s) => s.value.trim()).filter(Boolean);

    if (cleanSerials.length === 0) {
      alert("Please enter at least one valid serial number.");
      return;
    }

    const newBatch = {
      id: Date.now(),
      label:
        batchLabel.trim() ||
        `Batch ${new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}`,
      serials: cleanSerials,
    };

    try {
      setSavingCloud(true);
      const saved = await saveSerialBatch(currentUser.uid, newBatch);
      setSavedBatches((prev) => [saved, ...prev]);
      setSerialList([]);
      setBatchLabel("");
      localStorage.removeItem(STORAGE_KEY);
      alert("Serial batch saved to cloud and local draft cleared!");
    } catch (err) {
      console.error("Failed to save batch to cloud:", err);
      alert("Error saving to cloud: ", err.message);
    } finally {
      setSavingCloud(false);
    }
  };

  // Push staging list directly into a Product's Inventory & clear LocalStorage
  const handlePushToInventory = async () => {
    if (!selectedProductId) {
      alert("Please select a target product.");
      return;
    }
    if (serialList.length === 0 || savingStock) return;

    const targetProduct = products.find(
      (p) => String(p.id) === String(selectedProductId),
    );
    if (!targetProduct) return;

    const cleanSerials = serialList.map((s) => s.value.trim()).filter(Boolean);

    const existingSerials = targetProduct.serialNumbers || [];
    const duplicates = cleanSerials.filter((sn) =>
      existingSerials.includes(sn),
    );
    if (duplicates.length > 0) {
      alert(
        `These serials already exist in ${targetProduct.productName}: ${duplicates.join(", ")}`,
      );
      return;
    }

    const qtyToAdd = cleanSerials.length;
    const historyEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      type: "Stock-In",
      reason: "Scanned via Serial Pad",
      quantity: qtyToAdd,
    };

    const updatedProduct = {
      ...targetProduct,
      serialTracking: true,
      currentStock: Number(targetProduct.currentStock || 0) + qtyToAdd,
      serialNumbers: [...existingSerials, ...cleanSerials],
      stockHistory: [historyEntry, ...(targetProduct.stockHistory || [])],
    };

    try {
      setSavingStock(true);
      await saveProduct(currentUser.uid, updatedProduct);
      setSerialList([]);
      localStorage.removeItem(STORAGE_KEY);
      alert(
        `Added ${qtyToAdd} unit(s) & serials to ${targetProduct.productName}!`,
      );
      navigate(`/inventory/${targetProduct.id}`);
    } catch (err) {
      console.error("Failed to update inventory:", err);
      alert("Error updating inventory: " + err.message);
    } finally {
      setSavingStock(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-2 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Serial Scanner & Notepad
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Scan or type serials into your local draft, verify them, then save
              to cloud or push to Inventory
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition cursor-pointer shadow-sm"
          >
            <ScanLine size={18} />
            Open Lens Scanner
          </button>
        </div>

        {/* Manual Quick Add */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddSerial(manualInput);
              setManualInput("");
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Or type / USB-scan a serial number here and press Enter..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:border-gray-400"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 cursor-pointer"
            >
              <Plus size={16} /> Add
            </button>
          </form>
        </section>

        {/* Local Draft Staging List */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
          <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">
                  Local Draft List ({serialList.length})
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Unsaved Local Draft
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Edit any misread characters below before saving to cloud or
                inventory
              </p>
            </div>

            {serialList.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy All
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSerialList([]);
                    localStorage.removeItem(STORAGE_KEY);
                  }}
                  className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 cursor-pointer"
                >
                  Clear Draft
                </button>
              </div>
            )}
          </div>

          {serialList.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Your local draft is empty. Click{" "}
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="text-blue-600 font-medium hover:underline cursor-pointer"
              >
                Open Lens Scanner
              </button>{" "}
              to scan serial numbers.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {serialList.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50"
                >
                  <span className="text-xs font-mono text-gray-400 w-6">
                    #{index + 1}
                  </span>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleEditSerial(item.id, e.target.value)}
                    className="flex-1 border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-sm font-mono text-gray-900 outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSerial(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Remove serial"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Save to cloud or push to inventory */}
        {serialList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Save Batch */}
            <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Save Batch to Cloud Notepad
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Stores this list in Firebase and clears your local draft
                </p>
                <input
                  type="text"
                  value={batchLabel}
                  onChange={(e) => setBatchLabel(e.target.value)}
                  placeholder="Optional label (e.g. Dell Shipment #4)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-gray-400"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveToCloud}
                disabled={savingcloud}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
              >
                <CloudUpload size={16} />
                {savingcloud ? "Saving" : "Save to Cloud"}
              </button>
            </section>

            {/* Push Straight to Product Stock-In */}
            <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Stock In Directly to Product
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Adds {serialList.length} unit(s) & serials to inventory and
                  clears draft
                </p>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white mb-3 outline-none focus:border-gray-400"
                >
                  <option value="">-- Select Target Product --</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.productName}({prod.sku}) — Stock:{" "}
                      {prod.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handlePushToInventory}
                disabled={savingStock}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition cursor-pointer disabled:opacity-50"
              >
                <ArrowDownToLine size={16} />
                {savingStock
                  ? "Updating Inventory..."
                  : `Stock In (${serialList.length} Units)`}
              </button>
            </section>
          </div>
        )}

        {/* Saved Serial Batches History */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">
              Saved Serial Batches ({savedBatches.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Previously saved serial lists stored in your account
            </p>
          </div>

          {savedBatches.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-500">
              No saved batches yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {savedBatches.map((batch) => (
                <div key={batch.id} className="p-4 sm:p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {batch.label}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {(batch.serials || []).length} serial(s)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          (batch.serials || []).join("\n"),
                        );
                        alert("Batch serials copied to clipboard!");
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <Copy size={13} /> Copy Batch
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(batch.serials || []).map((sn, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-700"
                      >
                        {sn}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showScanner && (
        <SerialScannerModal
          onClose={() => setShowScanner(false)}
          onAddSerial={(serial) => handleAddSerial(serial)}
        />
      )}
    </div>
  );
};

export default Notepad;
