import React, { useState } from "react";
import { ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { products as defaultProducts } from "./data/products";

const ActivitySection = () => {
  const navigate = useNavigate();

  // Fetch real invoice from localStorage
  const [invoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch products to aggregate stock movement history
  const [products] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  // Take the 3 most recent invoices
  const recentInvoices = invoices.slice(0, 3);

  // Aggregate all stock histories across all products and sort newest first
  const allStockActivity = products
    .flatMap((product) =>
      (product.stockHistory || []).map((entry) => ({
        ...entry,
        productName: product.productName,
        productId: product.id,
      })),
    )
    .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
    .slice(0, 3);
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-5">
      {/* RECENT INVOICES */}
      <div className="w-full bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Recent Invoices
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage and track recent customer payments
            </p>
          </div>
          <Link
            to="/invoices"
            className="flex items-center gap-1 text-xs font-medium text-gray-200 hover:text-gray-900 transition-colors"
          >
            View all
          </Link>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50">
          {recentInvoices.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">
              No recent invoices found.
            </p>
          ) : (
            recentInvoices.map((item) => (
              <div
                key={item.invoiceNumber || item.id}
                onClick={() => navigate(`/invoices/${item.invoiceNumber}`)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs text-gray-800 font-medium leading-none">
                      {item.customer?.customerName || "Walk-in Customer"}
                    </p>
                    <span className="text-xs text-gray-400 font-mono mt-1 inline-block">
                      {item.invoiceNumber} • {item.invoiceDate || "Today"}
                    </span>
                  </div>
                </div>

                {/* Right: Amount + Status Badge */}
                <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                  <div>
                    <span className="inline-block w-24 text-xs font-semibold text-gray-900 text-right">
                      ₹
                      {Number(item.total || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="w-16 text-right">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${item.status === "Paid" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                    >
                      {item.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RECENT STOCK ACTIVITY */}
      <div className="w-full bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Stock Activity
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Recent stock movement
            </p>
          </div>
          <Link
            to="/inventory"
            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            View all stock Activity <ChevronRight size={14} />
          </Link>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50">
          {allStockActivity.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">
              No stock activity logged yet.
            </p>
          ) : (
            allStockActivity.map((stock, idx) => {
              const isStockIn =
                stock.type === "Stock In" ||
                stock.type === "Stock-In" ||
                stock.quantity > 0;
              const Icon = isStockIn ? ArrowUp : ArrowDown;

              return (
                <div
                  key={stock.id || idx}
                  onClick={() => navigate(`/inventory/${stock.productId}`)}
                  className="flex items-center justify-between gap-3 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-800 font-medium leading-none">
                        {stock.type}
                        {stock.reason ? ` (${stock.reason})` : ""}
                      </p>
                      <span className="text-xs text-gray-400 font-mono mt-1 inline-block">
                        {stock.quantity > 0
                          ? `+${stock.quantity}`
                          : stock.quantity}{" "}
                        • {stock.date}
                      </span>
                    </div>
                  </div>

                  {/* Right: Product + Icon Badge */}
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    <span className="inline-block max-w-28 sm:w-32 text-xs font-semibold text-gray-900 text-right truncate">
                      {stock.productName}
                    </span>
                    <div
                      className={`flex items-center justify-center p-1.5 rounded-full border ${
                        isStockIn
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitySection;
