import React, { useState } from "react";
import { Link } from "react-router";
import {
  ShoppingCart,
  FileText,
  Clock,
  AlertTriangle,
  Package,
  Boxes,
  TrendingDown,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { products as defaultProducts } from "./data/products";

const Cards = () => {
  // Load real-time invoices and products from localStorage
  const [invoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });

  const [products] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  // Today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  // Today's Sales Total
  const todaysSales = invoices
    .filter((inv) => inv.invoiceDate === todayStr)
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  // Pending Payments Total & Count
  const pendingInvoices = invoices.filter((inv) => inv.status === "Pending");
  const pendingAmount = pendingInvoices.reduce(
    (sum, inv) => sum + (Number(inv.total) || 0),
    0,
  );

  // Inventory Metrics
  const totalStockQty = products.reduce(
    (sum, prod) => sum + (Number(prod.currentStock) || 0),
    0,
  );

  const inventoryValuation = products.reduce((sum, prod) => {
    const price = Number(prod.purchasePrice || prod.sellingPrice || 0);
    return sum + (Number(prod.currentStock) || 0) * price;
  }, 0);

  const lowStockItems = products.filter(
    (prod) =>
      Number(prod.currentStock) > 0 &&
      Number(prod.currentStock) <= Number(prod.lowStockLevel),
  );

  const outOfStockItems = products.filter(
    (prod) => Number(prod.currentStock) === 0,
  );

  const mydata = [
    {
      id: 1,
      title: "Today's Sales",
      value: `₹ ${todaysSales.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      })}`,
      change: `${invoices.filter((inv) => inv.invoiceDate === todayStr).length} new today`,
      icon: ShoppingCart,
      bgColor: "bg-blue-50",
      shadowColor: "inset-shadow-blue-200",
      iconColor: "#045DC9",
      textColor: "text-blue-600",
      to: "/invoices",
    },
    {
      id: 2,
      title: "Invoices",
      value: invoices.length.toString(),
      change: `${invoices.filter((inv) => inv.status === "Paid").length} paid`,
      icon: FileText,
      bgColor: "bg-indigo-50",
      shadowColor: "inset-shadow-indigo-200",
      iconColor: "#4F46E5",
      textColor: "text-indigo-600",
      to: "/invoices",
    },
    {
      id: 3,
      title: "Pending Payment",
      value: `₹ ${pendingAmount.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      })}`,
      change: `${pendingInvoices.length} unpaid invoices`,
      icon: Clock,
      bgColor: "bg-amber-50",
      shadowColor: "inset-shadow-amber-200",
      iconColor: "#D97706",
      textColor: "text-amber-600",
      to: "/invoices",
    },
    {
      id: 4,
      title: "Low Stock Items",
      value: `${lowStockItems.length} Items`,
      change: "Needs reorder",
      icon: AlertTriangle,
      bgColor: "bg-orange-50",
      shadowColor: "inset-shadow-orange-200",
      iconColor: "#EA580C",
      textColor: "text-orange-600",
      to: "/inventory",
    },
    {
      id: 5,
      title: "Inventory Summary",
      value: `₹ ${inventoryValuation.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      })}`,
      change: `${new Set(products.map((p) => p.category).filter(Boolean)).size} categories`,
      icon: Package,
      bgColor: "bg-emerald-50",
      shadowColor: "inset-shadow-emerald-200",
      iconColor: "#059669",
      textColor: "text-emerald-600",
      to: "/inventory",
    },
    {
      id: 6,
      title: "Total Stock Qty",
      value: `${totalStockQty.toLocaleString("en-IN")} Pcs`,
      change: "In warehouse",
      icon: Boxes,
      bgColor: "bg-purple-50",
      shadowColor: "inset-shadow-purple-200",
      iconColor: "#9333EA",
      textColor: "text-purple-600",
      to: "/inventory",
    },
    {
      id: 7,
      title: "Low Stock",
      value: `${lowStockItems.length} Items`,
      change: "Below minimum",
      icon: TrendingDown,
      bgColor: "bg-rose-50",
      shadowColor: "inset-shadow-rose-200",
      iconColor: "#E11D48",
      textColor: "text-rose-600",
      to: "/inventory",
    },
    {
      id: 8,
      title: "Out of Stock",
      value: `${outOfStockItems.length} Items`,
      change: "Unavailable now",
      icon: XCircle,
      bgColor: "bg-red-50",
      shadowColor: "inset-shadow-red-200",
      iconColor: "#DC2626",
      textColor: "text-red-600",
      to: "/inventory",
    },
  ];
  return (
    <div className="cardsContainer grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {mydata.map((item) => {
        // Grab the icon for this specific card
        const IconComponent = item.icon;
        return (
          <Link
            key={item.id}
            to={item.to}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition-colors"
          >
            {/* Dynamic Icon */}
            <IconComponent size={32} color={item.iconColor} />
            <div className="cardsDetails flex flex-col items-start min-w-0">
              {/* Dynamic Text Details */}
              <span className="text-sm font-light text-gray-500">
                {item.title}
              </span>
              <h3 className="font-semibold text-lg sm:text-xl truncate">
                {item.value}
              </h3>
              <div
                className={`flex items-center text-[10px] ${item.textColor}`}
              >
                <ChevronRight size={15} />
                <span>{item.change}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Cards;
