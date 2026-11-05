import React from "react";
import {FilePlusCorner, FileText, Download, Upload, ScanQrCode} from "lucide-react"
import { Link } from "react-router";

const QuickAction = () => {
  const actionData = [
    {
      id: 1,
      title: "Create Invoice",
      icon: FilePlusCorner,
      iconColor: "#045DC9",
      to: "/invoices/create",
    },
    {
      id: 2,
      title: "Pro Forma",
      icon: FileText,
      iconColor: "#4F46E5",
      to: "/proforma",
    },
    {
      id: 3,
      title: "Stock In",
      icon: Download,
      iconColor: "#D97706",
      to: "/stock-in",
    },
    {
      id: 4,
      title: "Stock Out",
      icon: Upload,
      iconColor: "#EA580C",
      to: "/stock-out",
    },
    {
      id: 5,
      title: "Scan Serial Number",
      icon: ScanQrCode,
      iconColor: "#059669",
      to: "/inventory",
    },
  ];
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
      {/* Create Invoice, Pro Forma, Stock In, Stock Out, Scan Serial Number */}
      <div className="cardsContainer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {actionData.map((item) => {
          // Grab the icon for this specific card
          const IconComponent = item.icon;
          return (
            <Link
              key={item.id}
              to={item.to}
              className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:border-gray-300 transition-colors cursor-pointer"
            >
              <div className="cardsDetails flex items-center gap-2">
              <IconComponent size={24} color={item.iconColor} />
                <span className="text-sm font-light text-gray-500">
                  {item.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAction;
