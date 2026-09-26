import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { products as defaultProducts } from "../components/data/products";
const AddProducts = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    productName: "",
    sku: "",
    category: "",
    currentStock: 0,
    lowStockLevel: 5,
    serialTracking: false,
    purchasePrice: "",
    sellingPrice: "",
    gst: 18,
    hsn: "",
    stockHistory: [],
    serialNumbers: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    if (!product.productName.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!product.sku.trim()){
      alert("Please enter SKU.");
      return;
    }

    if (!product.category.trim()) {
      alert("Please enter category.");
      return;
    }

    const normalizedCategory = product.category.trim().replace(/\s+/g," ");
    
    if (Number(product.lowStockLevel) < 0) {
      alert("Low stock level cannot be negative.");
      return;
    }
    if (
      product.purchasePrice !== "" &&
      Number(product.purchasePrice) < 0
    ) {
      alert("Purchase price cannot be negative.");
      return;
    }
    if (
      product.purchasePrice !== "" &&
      Number(product.purchasePrice) < 0
    ) {
      alert("Purchase price cannot be negative.");
      return;
    }
    if (
      product.sellingPrice !== "" &&
      Number(product.sellingPrice) < 0
    ) {
      alert("Selling price cannot be negative.");
      return;
    }
    if (
      product.gst !== "" &&
      (Number(product.gst) < 0 || Number(product.gst) > 100)
    ){
      alert("GST must be between 0 and 100.")
      return;
    }

    const savedProducts =
      JSON.parse(localStorage.getItem("products")) || defaultProducts;

    const skuExists = savedProducts.some(
      (item) => item.sku.toLowerCase() === product.sku.trim().toLowerCase(),
    );

    if (skuExists) {
      alert("SKU already exists.");
      return;
    }

    const newProduct = {
      ...product,
      id: Date.now(),
      category: normalizedCategory,
      sku: product.sku.trim().toUpperCase(),
      currentStock: Number(product.currentStock),
      lowStockLevel: Number(product.lowStockLevel),
      purchasePrice: Number(product.purchasePrice),
      sellingPrice: Number(product.sellingPrice),
      gst: Number(product.gst),
    };

    const updatedProducts = [...savedProducts, newProduct];

    localStorage.setItem("products", JSON.stringify(updatedProducts));

    navigate("/inventory");
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
              className="border border-gray-200 rounded-lg px-3 py-2.5"
            />

            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={product.sku}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2.5"
            />

            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Enter category, e.g. Laptop"
              className="border border-gray-200 rounded-lg px-3 py-2.5"
            >
            </input>

            <input
              type="number"
              name="lowStockLevel"
              min="0"
              placeholder="Low Stock Level"
              value={product.lowStockLevel}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2.5"
            />

            <input
              type="number"
              name="purchasePrice"
              min="0"
              placeholder="Purchase Price"
              value={product.purchasePrice}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2.5"
            />

            <input
              type="number"
              name="sellingPrice"
              min="0"
              placeholder="Selling Price"
              value={product.sellingPrice}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2.5"
            />

            <input
              type="number"
              name="gst"
              min="0"
              max="100"
              placeholder="GST"
              value={product.gst}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2.5"
            />

            <input
              type="text"
              name="hsn"
              placeholder="HSN"
              value={product.hsn}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2.5"
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
              onClick={() => navigate("inventory")}
              className="px-4 py-2 border-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              Save Product
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddProducts;
