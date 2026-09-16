import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { products as defaultProducts } from "../components/data/products";

const StockIn = () => {
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
  const [serialNumbers, setSerialNumbers] = useState("");

  const selectedProduct = products.find(
    (product) => product.id === Number(selectedProductId),
  );

  const handleStockIn = () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    const stockQuantity = Number(quantity);

    if (!Number.isInteger(stockQuantity) || stockQuantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    let newSerialNumbers = [];

    if (selectedProduct.serialTracking) {
      newSerialNumbers = serialNumbers
        .split("\n")
        .map((serial) => serial.trim())
        .filter(Boolean);

      if (newSerialNumbers.length !== stockQuantity) {
        alert(`Please enter exactly ${stockQuantity} serial numbers.`);
        return;
      }

      const normalizedNewSerials = newSerialNumbers.map((serial) =>
        serial.toLowerCase(),
      );

      const hasInputDuplicates =
        new Set(normalizedNewSerials).size !== normalizedNewSerials.length;

      if (hasInputDuplicates) {
        alert("Duplicate serial numbers are not allowed");
        return;
      }

      const existingSerials = (selectedProduct.serialNumbers || []).map(
        (serial) => serial.toLowerCase(),
      );

      const alreadyExists = normalizedNewSerials.some((serial) =>
        existingSerials.includes(serial),
      );

      if (alreadyExists) {
        alert("One or more serial numbers already exist.");
        return;
      }
    }

    const historyEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      type: "Stock-In",
      quantity: stockQuantity,
    };

    const updatedProducts = products.map((product) => {
      if (product.id !== selectedProduct.id) {
        return product;
      }

      return {
        ...product,
        currentStock: Number(product.currentStock) + stockQuantity,

        stockHistory: [historyEntry, ...(product.stockHistory || [])],

        serialNumbers: product.serialTracking
          ? [...(product.serialNumbers || []), ...newSerialNumbers]
          : product.serialNumbers || [],
      };
    });

    localStorage.setItem("products", JSON.stringify(updatedProducts));

    setProducts(updatedProducts);

    alert("Stock added successfully.");

    if (location.state?.fromProductDetails) {
      navigate(-1);
    } else {
      navigate(`/inventory/${selectedProduct.id}`, {
        replace: true,
      });
    }

    navigate(`/inventory/${selectedProduct.id}`);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-5 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer"
        >
          ← Back
        </button>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Stock In</h1>

          <p className="mt-1 text-sm text-gray-500">
            Add incoming stock to inventory
          </p>
        </div>

        <section className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="space-y-5">
            {/* PRODUCT */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Product
              </label>

              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setSerialNumbers("");
                }}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              >
                <option value="">Select Product</option>

                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.productName} - {product.sku}
                  </option>
                ))}
              </select>
            </div>

            {/* CURRENT STOCK */}
            {selectedProduct && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Current Stock</p>

                <p className="text-xl font-semibold text-gray-900">
                  {selectedProduct.currentStock}
                </p>
              </div>
            )}

            {/* QUANTITY */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter Quantity"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              />
            </div>

            {/* SERIAL NUMBER */}
            {selectedProduct?.serialTracking && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Serial Numbers
                </label>

                <textarea
                  value={serialNumbers}
                  onChange={(e) => setSerialNumbers(e.target.value)}
                  placeholder={`Enter ${quantity || ""} serial numbers, one per line`}
                  rows={5}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Enter one serial number per line.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                if (location.state?.fromProductDetails){
                  navigate(-1);
                } else {
                  navigate("/inventory");
                }
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleStockIn}
              className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm cursor-pointer"
            >
              Add Stock
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StockIn;
