import React, { useState } from "react";
import { useNavigate } from "react-router";
import { products as defaultProducts } from "../components/data/products";
import { Link } from "react-router";

const Inventory = () => {
  // Temporary product data
  // Later ye backend/database se ayega

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [serialFilter, setSerialFilter] = useState("");
  const [sortBy, setSortBy] = useState(""); 
  // sortBy = kis field par sorting ho rahi hai
  const [sortDirection, setSortDirection] = useState("asc");
  // sortDirection = asc / desc

  const navigate = useNavigate();

  const [products] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : defaultProducts;
  });

  const categories = [
    ...new Set(
      products.map((product) => product.category).filter(Boolean)
    ),
  ].sort();
  
  const getStockStatus = (product) => {
    if (product.currentStock === 0) {
      return "Out";
    }

    if (product.currentStock <= product.lowStockLevel) {
      return "Low";
    }

    return "Good";
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStockFilter("");
    setSerialFilter("");
  };

  const hasActiveFilters =
    // Agar koi bhi filter/search active hai -> true
    searchTerm !== "" ||
    categoryFilter !== "" ||
    stockFilter !== "" ||
    serialFilter !== "";

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.trim().toLowerCase();

    // STOCK STATUS
    const productStatus = getStockStatus(product);

    // SEARCH
    const matchesSearch =
      product.productName.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      productStatus.toLowerCase().includes(search);

    // CATEGORY
    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;

    const matchesStock = stockFilter === "" || productStatus === stockFilter;

    // SERIAL TRACKING
    const matchesSerial =
      serialFilter === "" ||
      (serialFilter === "Yes" && product.serialTracking === true) ||
      (serialFilter === "No" && product.serialTracking === false);

    return matchesSearch && matchesCategory && matchesStock && matchesSerial;

    // Har Stock ko 4 tests pass karne hai
    // Search match?
    // Category match?
    // Stock Status match?
    // Serial Tracking match?
    // All pass -> SHOW PRODUCT

    // Agar ek bhi selected filter match nahi karta toh product hide ho jayega
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortBy) return 0;

    if (sortBy === "productName") {
      const comparison = a.productName.localeCompare(b.productName);

      return sortDirection === "asc"
      ? comparison
      : -comparison;
    }

    if (sortBy === "currentStock") {
      const comparison =
      Number(a.currentStock) - Number(b.currentStock);

      return sortDirection === "asc"
      ? comparison
      : -comparison;
    }

    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection((prev) =>
      prev === "asc" ? "desc" : "asc"
    );
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const totalProducts = products.length;

  const goodStockCount = products.filter(
    (product) => getStockStatus(product) === "Good",
  ).length;

  const lowStockCount = products.filter(
    (product) => getStockStatus(product) === "Low",
  ).length;

  const outOfStockCount = products.filter(
    (product) => getStockStatus(product) === "Out",
  ).length;

  const lowStockProducts = products.filter(
    (product) => product.currentStock <= product.lowStockLevel,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* PAGE HEADER */}
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-6 flex justify-between">
          <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>

          <p className="mt-1 text-sm text-gray-500">
            Search and manage your products and stock
          </p>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-end gap-4">
              <p className="text-sm text-gray-500">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
              <button
                className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        <Link
          to="/inventory/add"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
        >
          + Add Product
        </Link>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5 mt-2">
          {/* TOTAL PRODUCTS */}
          <button
            type="button"
            onClick={() => setStockFilter("")}
            className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-400 transition cursor-pointer"
          >
            <p className="text-sm text-gray-500">Total Products</p>

            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {totalProducts}
            </p>
          </button>

          {/* GOOD STOCK */}
          <button
            onClick={() => setStockFilter("Good")}
            className={`bg-white border rounded-xl p-4 text-left transition cursor-pointer ${
              stockFilter === "Good"
                ? "border-green-500 ring-1 ring-green-500"
                : "border-gray-200 hover:border-green-300"
            }`}
          >
            <p className="text-sm text-gray-500">Good Stock</p>

            <p className="mt-1 text-2xl font-semibold text-green-600">
              {goodStockCount}
            </p>
          </button>

          {/* LOW STOCK */}
          <button
            onClick={() => setStockFilter("Low")}
            className={`bg-white border rounded-xl p-4 text-left transition cursor-pointer ${
              stockFilter === "Low"
                ? "border-amber-500 ring-1 ring-amber-500"
                : "border-gray-200 hover:border-amber-300"
            }`}
          >
            <p className="text-sm text-gray-500">Low Stock</p>

            <p className="mt-1 text-2xl font-semibold text-green-600">
              {lowStockCount}
            </p>
          </button>

          {/* OUT OF STOCK */}
          <button
            onClick={() => setStockFilter("Out")}
            className={`bg-white border rounded-xl p-4 text-left transition cursor-pointer ${
              stockFilter === "Out"
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-200 hover:border-red-300"
            }`}
          >
            <p className="text-sm text-gray-500">Out of Stock</p>

            <p className="mt-1 text-2xl font-semibold text-green-600">
              {outOfStockCount}
            </p>
          </button>
        </section>

        {lowStockProducts.length > 0 && (
          <section className="mb-5 bg-white border border-gray-200 roundd-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold tyext-gray-900">
                Low Stock Alerts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Products that need attention
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {lowStockProducts.map((product) => {
                const status = getStockStatus(product);

                return (
                  <div
                    key={product.id}
                    onClick={() =>
                      navigate(`/inventory/${product.id}`, {
                        state: {
                          fromInventory: true,
                        },
                      })
                    }
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.productName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {product.sku}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          status === "Out" ? "text-red-600" : "text-amber-600"
                        }`}
                      >
                        {product.currentStock} left
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Reorder level: {product.lowStockLevel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* INVENTORY CARD */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-2">
          {/* SEARCH - functionality next step */}
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product / SKU"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />

            {/* FILTER - functionality later */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* CATEGORY FILTER */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none"
              >
                <option value="">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Stock Status Filter */}
              <select 
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none">
                <option value="">Stock Status</option>
                <option value="Good">Good</option>
                <option value="Low">Low</option>
                <option value="Out">Out</option>
              </select>

              {/* Serial Tracking Filter */}
              <select 
              value={serialFilter}
              onChange={(e) => setSerialFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none">
                <option value="">Serial Tracking</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200 border-b border-gray-200">
                <tr>
                  <th 
                  onClick={() => handleSort("productName")}
                  className="text-left px-5 py-3 font-medium text-gray-600 cursor-pointer select-none">
                    Product
                    {sortBy === "productName" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    SKU
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Category
                  </th>
                  <th 
                  onClick={() => handleSort("currentStock")}
                  className="text-center px-5 py-3 font-medium text-gray-600 cursor-pointer select-none">
                    Current Stock
                    {sortBy === "currentStock" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="text-center px-5 py-3 font-medium text-gray-600">
                    Serial Tracking
                  </th>
                  <th className="text-center px-5 py-3 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-center px-5 py-3 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {sortedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-8 text-center text-sm text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((product) => {
                    const status = getStockStatus(product);

                    return (
                      <tr
                        key={product.id}
                        onClick={() =>
                          navigate(`/inventory/${product.id}`, {
                            state: {
                              fromInventory: true,
                            },
                          })
                        }
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {product.productName}
                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {product.sku}
                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {product.category}
                        </td>

                        <td className="px-5 py-4 text-center font-medium">
                          {product.currentStock}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                          className={`text0xs font-medium ${product.serialTracking ? "text-green-600" : "text-gray-500"}`}
                          >
                            {product.serialTracking ? "Yes" : "No"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              status === "Good"
                                ? "bg-green-50 text-green-600"
                                : status === "Low"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-red-50 text-red-600"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                            onClick={(event) => {
                              event.stopPropagation();

                              navigate(`/stock-in?product=${product.id}`,{
                                state: {
                                  fromInventory: true,
                                },
                              });
                            }}
                            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              Stock In
                            </button>

                            <button
                            disabled={Number(product.currentStock) === 0}
                            onClick={(event) => {
                              event.stopPropagation();

                              navigate(`/stock-out?product=${product.id}`, {
                                state: {
                                  fromInventory: true,
                                },
                              });
                            }}
                            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Stock Out
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Inventory;
