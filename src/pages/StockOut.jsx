import React, { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { products as defaultProducts } from "../components/data/products";

const StockOut = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const productFromUrl = searchParams.get("product");

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");

    return savedProducts ? JSON.parse(savedProducts) : defaultProducts;
  });

  const [selectedProductId, setSelectedProductId] = useState(
    productFromUrl || "",
  );
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("Customer Sale");
  const [selectedSerials, setSelectedSerials] = useState([]);

  const selectedProduct = products.find(
    (product) => product.id === Number(selectedProductId),
  );

  const handleSerialChange = (serialNumber) => {
    setSelectedSerials((currentSerials) =>
      currentSerials.includes(serialNumber)
        ? currentSerials.filter((serial) => serial !== serialNumber)
        : [...currentSerials, serialNumber],
    );
  };

  const handleStockOut = () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    const stockQuantity = Number(quantity);

    if (!Number.isInteger(stockQuantity) || stockQuantity <= 0) {
      alert("Please enter a valid whole-number quantity.");
      return;
    }

    if (stockQuantity > Number(selectedProduct.currentStock)) {
      alert("Stock Out quantity cannot current stock.");
      return;
    }

    if (
      selectedProduct.serialTracking &&
      selectedSerials.length !== stockQuantity
    ) {
      alert(`Please select exactly ${stockQuantity} serial numbers.`);
      return;
    }

    const isCorrection = reason === "Incorrect Stock In";
    const historyEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      type: isCorrection ? "Stock Adjustment" : "Stock Out",

      reason,

      quantity: -stockQuantity,
    };

    const updatedProducts = products.map((product) => {
      if (product.id !== selectedProduct.id) {
        return product;
      }

      return {
        ...product,
        currentStock: Number(product.currentStock) - stockQuantity,

        stockHistory: [historyEntry, ...(product.stockHistory || [])],

        serialNumbers: product.serialTracking
          ? (product.serialNumbers || []).filter(
              (serial) => !selectedSerials.includes(serial),
            )
          : product.serialNumbers || [],
      };
    });

    localStorage.setItem("products", JSON.stringify(updatedProducts));

    setProducts(updatedProducts);

    alert("Stock removed successfully.");

    if (location.state?.fromProductDetails) {
      navigate(-1);
    } else {
      navigate(`/inventory/${selectedProduct.id}`, {
        replace: true,
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer"
        >
          ← Back
        </button>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Stock Out</h1>

          <p className="mt-1 text-sm text-gray-500">
            Remove outgoing stock from inventory
          </p>
        </div>

        <section className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Product
              </label>

              <select
                value={selectedProductId}
                onChange={(event) => {
                  setSelectedProductId(event.target.value);
                  setQuantity("");
                  setSelectedSerials([]);
                }}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              >
                <option value="">Select Product</option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                    disabled={Number(product.currentStock) === 0}
                  >
                    {product.productName} — {product.sku}
                    {Number(product.currentStock) === 0
                      ? " — Out of Stock"
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Current Stock</p>
                <p className="text-xl font-semibold text-gray-900">
                  {selectedProduct.currentStock}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                max={selectedProduct?.currentStock || ""}
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setSelectedSerials([]);
                }}
                placeholder="Enter Quantity"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Reason
              </label>

              <select
                value={reason}
                onChange={(evt) => setReason(evt.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              >
                <option value="Customer Sale">Customer Sale</option>
                <option value="Incorrect Stock In">Incorrect Stock In</option>
                <option value="Damaged Stock">Damaged Stock</option>
                <option value="Lost Stock">Lost Stock</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {selectedProduct?.serialTracking && (
              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Select Serial Numbers
                  </label>

                  <span className="text-xs text-gray-500">
                    Selected: {selectedSerials.length}/{quantity || 0}
                  </span>
                </div>

                {(selectedProduct.serialNumbers || []).length === 0 ? (
                  <p className="mt-2 text-sm text-red-600">
                    No serial numbers are available for this product
                  </p>
                ) : (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.serialNumbers.map((serialNumber) => (
                      <label
                        key={serialNumber}
                        className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSerials.includes(serialNumber)}
                          onChange={() => handleSerialChange(serialNumber)}
                        />

                        <span className="text-sm text-gray-700">
                          {serialNumber}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                if (location.state?.fromProductDetails){
                  navigate(-1)
                } else {
                  navigate("/inventory");
                }
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleStockOut}
              disabled={!selectedProduct}
              className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Stock
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StockOut;
