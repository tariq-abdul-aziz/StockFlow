import React from "react";
import { ArrowUp, ArrowDown, ChevronRight } from "lucide-react";

const ActivitySection = () => {
  const recentActivity = [
    {
      id: "INV-1025",
      customer: "Customer A",
      amount: "₹ 12,500",
      status: "Paid",
      date: "Today, 2:45 PM",
    },
    {
      id: "INV-1024",
      customer: "Customer B",
      amount: "₹ 8,200",
      status: "Pending",
      date: "Yesterday",
    },
    {
      id: "INV-1023",
      customer: "Customer C",
      amount: "₹ 5,500",
      status: "Paid",
      date: "12 Aug 2026",
    },
  ];
  const stockActivity = [
    {
      id: 1,
      stockIN: "Stock In",
      qty: "+20",
      Product: "Product A",
      icon: ArrowUp,
      bgColor: "bg-green-50",
      shadowColor: "inset-shadow-rose-200",
      iconColor: "#E11D48",
      textColor: "text-rose-600",
      date: "Today, 2:45 PM",
    },
    {
      id: 2,
      stockIN: "Stock Out",
      qty: "-10",
      Product: "Product B",
      icon: ArrowDown,
      bgColor: "bg-red-50",
      shadowColor: "inset-shadow-red-200",
      iconColor: "#DC2626",
      textColor: "text-red-600",
      date: "Yesterday",
    },
    {
      id: 3,
      stockIN: "Stock In",
      qty: "+50",
      Product: "Product C",
      icon: ArrowUp,
      bgColor: "bg-green-50",
      shadowColor: "inset-shadow-rose-200",
      iconColor: "#E11D48",
      textColor: "text-rose-600",
      date: "12 Aug 2026",
    },
  ];
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-5">
      {/* RECENT ACTIVITY */}
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
          <button className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
            View all
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-gray-800 leading-none">
                    {item.customer}
                  </p>
                  <span className="text-xs text-gray-400 font-mono mt-1 inline-block">
                    {item.id} • {item.date}
                  </span>
                </div>
              </div>

              {/* Right: Amount + Status Badge */}
              <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                <div>
                  <span className="inline-block w-24 text-xs  font-semibold text-gray-900 text-right">
                    {item.amount}
                  </span>
                </div>
                <div className="w-16 text-right">
                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      item.status === "Paid"
                        ? "bg-emerald-50 text-emarald-600 border border-emerald-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STOCK ACTIVITY */}
      <div className="w-full bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Stock Activity
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Recent Stock Movement
            </p>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
            View all Stock Activity <ChevronRight />
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50">
          {stockActivity.map((stock) => {
            const Icon = stock.icon;
            return (
              <div
                key={stock.id}
                className="flex items-center justify-between gap-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs text-gray-800 leading-none">
                      {stock.stockIN}
                    </p>
                    <span className="text-xs text-gray-400 font-mono mt-1 inline-block">
                      {stock.qty} • {stock.date}
                    </span>
                  </div>
                </div>

                {/* Right: Product + Icon Badge */}
                <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                  <span className="inline-block max-w-20 sm:w-24 text-xs font-semibold text-gray-900 text-right truncate">
                    {stock.Product}
                  </span>
                  <div
                    className={`flex items-center justify-center p-1.5 rounded-full border ${stock.bgColor} ${stock.textColor} ${stock.borderColor}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivitySection;
