import React, { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router";
import { products as defaultProducts } from "../components/data/products";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const savedProducts =
    JSON.parse(localStorage.getItem("products")) || defaultProducts;

  const product = savedProducts.find((item) => item.id === Number(id));

  const serialNumbers = product?.serialNumbers || [];

  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-xl font-semibold">Product not found</h1>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (Number(editedProduct.lowStockLevel) < 0) {
      alert("Low stock level cannot be negative.");
      return;
    }
    if (Number(editedProduct.purchasePrice) < 0){
      alert("Purchase price cannot be negative.")
      return;
    }
    if (Number(editedProduct.sellingPrice) < 0){
      alert("Selling price cannot be negative.")
      return;
    }
    if (
      Number(editedProduct.gst) < 0 ||
      Number(editedProduct.gst) > 100
    ) {
      alert("GST must be between 0 and 100.");
      return;
    }
    
    const updatedProducts = savedProducts.map((item) =>
      item.id === editedProduct.id
        ? {
            ...editedProduct,
            lowStockLevel: Number(editedProduct.lowStockLevel),
            purchasePrice: Number(editedProduct.purchasePrice),
            sellingPrice: Number(editedProduct.sellingPrice),
            gst: Number(editedProduct.gst),
          }
        : item,
    );
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setIsEditing(false);
    alert("Product updated successfully.");
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => {
            if (location.state?.fromInventory){
               navigate(-1);
            } else {
              navigate("/inventory", {
                replace: true,
              });
            }
          }}
          className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer"
        >
          ← Back to Inventory
        </button>

        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {editedProduct.productName}
          </h1>

          <p className="mt-1 text-sm text-gray-500">SKU: {editedProduct.sku}</p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-800"
          >
            Edit Product
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEditedProduct(product);
                setIsEditing(false);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm cursor-pointer"
            >
              Save
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
          to={`/stock-in?product=${product.id}`}
          state={{
            fromProductDetails: true,
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
          + Stock In</Link>
          <Link
          to={`/stock-out?product=${product.id}`}
          state={{
            fromProductDetails: true,
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
          - Stock Out</Link>
        </div>

        {/* CURRENT STOCK */}
        <section className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Current Stock</p>
              <p className="text-lg font-semibold">
                {editedProduct.currentStock}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Low Stock Level</p>

              {isEditing ? (
                <input
                  type="number"
                  name="lowStockLevel"
                  min="0"
                  value={editedProduct.lowStockLevel}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              ) : (
                <p className="text-lg font-semibold">
                  {editedProduct.lowStockLevel}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* PRODUCT INFORMATION - PRICE + GST + HSN Details */}
        <section className="mt-5 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Product Information
          </h2>

          <div className="flex justify-between text-center">
            {/* PURCHASE PRICE */}
            <div>
              <p className="text-sm text-gray-500">Purchase Price</p>

              {isEditing ? (
                <input
                  type="number"
                  name="purchasePrice"
                  min="0"
                  value={editedProduct.purchasePrice}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              ) : (
                <p className="mt-1 font-semibold">
                  ₹{" "}
                  {Number(editedProduct.purchasePrice).toLocaleString("en-IN")}
                </p>
              )}
            </div>

            {/* SELLING PRICE */}
            <div>
              <p className="text-sm text-gray-500">Selling Price</p>

              {isEditing ? (
                <input
                  type="number"
                  name="sellingPrice"
                  min="0"
                  value={editedProduct.sellingPrice}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              ) : (
                <p>
                  ₹ {Number(editedProduct.sellingPrice).toLocaleString("en-IN")}
                </p>
              )}
            </div>

            {/* GST */}
            <div>
              <p className="text-sm text-gray-500">GST</p>

              {isEditing ? (
                <input
                  type="number"
                  name="gst"
                  min="0"
                  max="100"
                  value={editedProduct.gst}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              ) : (
                <p className="mt-1 font-semibold text-gray-900">
                  {product.gst}%
                </p>
              )}
            </div>

            {/* HSN */}
            <div>
              <p className="text-sm text-gray-500">HSN</p>

              {isEditing ? (
                <input
                  type="number"
                  name="hsn"
                  value={editedProduct.hsn}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              ) : (
                <p className="mt-1 font-semibold text-gray-900">
                  {product.hsn}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* STOCK HISTORY */}
        <section className="mt-5 bg-white border border-gray-200 rounded-xl p-5">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Stock History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recent stock movement for this product
            </p>
          </div>

          {product.stockHistory.length === 0 ? (
            <p className="text-sm text-gray-500">No stock history available.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {product.stockHistory.map((history) => (
                <div
                  key={history.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-sm text-gray-500 w-16">
                      {history.date}
                    </span>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {history.type}
                      </p>

                      {history.reason && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {history.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-sm font-semibold ${history.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {history.quantity > 0 ? "+" : ""}
                    {history.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SERIAL NUMBERS TRACKING */}
        <section className="mt-5 bg-white border border-gray-200 rounded-xl p-5">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Serial Numbers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Serial numbers linked to this product
            </p>
          </div>

          {!product.serialTracking ? (
            <p className="text-sm text-gray-500">
              Serial tracking is not enabled for this product
            </p>
          ) : serialNumbers.length === 0 ? (
            <p className="text-sm text-gray-500">No serial numbers available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {serialNumbers.map((serialNumber) => (
                <div className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700">
                  {serialNumber}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
