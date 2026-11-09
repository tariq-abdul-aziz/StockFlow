import { useAuth } from "../context/AuthContext";
import { saveProduct } from "../services/firestoreService";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { getGstByHsn } from "../components/data/hsnCodes";
import { products as defaultProducts } from "../components/data/products";

const AddProducts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    productName: "",
    sku: "",
    category: "",
    currentStock: 0,
    lowStockLevel: 5,
    serialTracking: false,
    purchasePrice: "",
    sellingPrice: "",
    gst: 0,
    hsn: "",
    stockHistory: [],
    serialNumbers: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Automatically auto-fill GST when HSN is entered or matched
      if (name === "hsn") {
        const matchedGst = getGstByHsn(value);
        if (matchedGst !== null) {
          updated.gst = matchedGst;
        }
      }

      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!currentUser?.uid) {
      alert("You must be logged in to add a product.");
      return;
    }

    if (!product.productName.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!product.sku.trim()) {
      alert("Please enter SKU.");
      return;
    }

    if (!product.category.trim()) {
      alert("Please enter category.");
      return;
    }

    if (Number(product.lowStockLevel) < 0) {
      alert("Low stock level cannot be negative.");
      return;
    }
    if (product.purchasePrice !== "" && Number(product.purchasePrice) < 0) {
      alert("Purchase price cannot be negative.");
      return;
    }
    if (product.sellingPrice !== "" && Number(product.sellingPrice) < 0) {
      alert("Selling price cannot be negative.");
      return;
    }
    if (
      product.gst !== "" &&
      (Number(product.gst) < 0 || Number(product.gst) > 100)
    ) {
      alert("GST must be between 0 and 100.");
      return;
    }

    const newProduct = {
      ...product,
      id: Date.now(),
      currentStock: Number(product.currentStock) || 0,
      lowStockLevel: Number(product.lowStockLevel) || 0,
      purchasePrice:
        product.purchasePrice !== "" ? Number(product.purchasePrice) : "",
      sellingPrice:
        product.sellingPrice !== "" ? Number(product.sellingPrice) : "",
      gst: product.gst !== "" ? Number(product.gst) : 18,
      stockHistory: [],
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);
      await saveProduct(currentUser.uid, newProduct);
      alert("Product saved to Cloud Firestore!");
      navigate("/inventory");
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving products: " + (error.message || error));
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-semibold text-gray-900">Add Product</h1>

          <p className="mt-1 text-sm text-gray-500">
            Add new product to inventory
          </p>
        </div>

        <section className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="grid gird-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={product.productName}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2"
            />

            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={product.sku}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2"
            />

            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Enter category, e.g. Laptop"
              className="border border-gray-200 rounded-lg px-3 py-2"
            />

            <input
              type="number"
              name="lowStockLevel"
              min="0"
              placeholder="Low Stock Level"
              value={product.lowStockLevel}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2"
            />

            <input
              type="number"
              name="purchasePrice"
              min="0"
              placeholder="Purchase Price"
              value={product.purchasePrice}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2"
            />

            <input
              type="number"
              name="sellingPrice"
              min="0"
              placeholder="Selling Price"
              value={product.sellingPrice}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2"
            />

            <input
              type="number"
              name="gst"
              min="0"
              max="100"
              placeholder="GST"
              value={product.gst}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2"
            />

            <input
              type="text"
              name="hsn"
              placeholder="HSN"
              value={product.hsn}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2"
            />
          </div>

          <div className="mt-5 flex items-center gap-2">
            <input
              type="checkbox"
              name="serialTracking"
              checked={product.serialTracking}
              onChange={handleChange}
            />

            <label className="text-sm text-gray-700">
              Enable Serial Tracking
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/inventory")}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 border border-gray-200 rounded-lg cursor-pointer"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddProducts;
