import React from "react";
import {FilePlusCorner, FileText, Download, Upload, ScanQrCode} from "lucide-react"

const QuickAction = () => {
      const actionData = [
    {
      id: 1,
      title: "Create Invoice",
      icon: FilePlusCorner,
      bgColor: "bg-blue-50",
      shadowColor: "inset-shadow-blue-200",
      iconColor: "#045DC9",
      textColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Pro Forma",
      icon: FileText,
      bgColor: "bg-indigo-50",
      shadowColor: "inset-shadow-indigo-200",
      iconColor: "#4F46E5",
      textColor: "text-indigo-600",
    },
    {
      id: 3,
      title: "Stock In",
      icon: Download,
      bgColor: "bg-amber-50",
      shadowColor: "inset-shadow-amber-200",
      iconColor: "#D97706",
      textColor: "text-amber-600",
    },
    {
      id: 4,
      title: "Stock Out",
      icon: Upload,
      bgColor: "bg-orange-50",
      shadowColor: "inset-shadow-orange-200",
      iconColor: "#EA580C",
      textColor: "text-orange-600",
    },
    {
      id: 5,
      title: "Scan Serial Number",
      icon: ScanQrCode,
      bgColor: "bg-emerald-50",
      shadowColor: "inset-shadow-emerald-200",
      iconColor: "#059669",
      textColor: "text-emerald-600",
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
            <div
              key={item.id}
              className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:border-gray-300 transition-colors cursor-pointer"
            >
              <div className="cardsDetails flex items-center gap-1">
              <IconComponent size={28} color={item.iconColor} />
                <span className="text-sm font-light text-gray-500">
                  {item.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAction;
