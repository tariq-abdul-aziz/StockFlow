import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  ReceiptText,
  NotepadText,
  ShelvingUnit,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  NotebookPen,
  Users,
  Presentation,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/invoices", icon: ReceiptText, label: "Invoices" },
    { to: "/proforma", icon: NotepadText, label: "Pro Forma" },
    { to: "/inventory", icon: ShelvingUnit, label: "Inventory" },
    { to: "/stock-in", icon: ArrowDownNarrowWide, label: "Stock In" },
    { to: "/stock-out", icon: ArrowUpNarrowWide, label: "Stock Out" },
    { to: "/notepad", icon: NotebookPen, label: "Notepad" },
    { to: "/customers", icon: Users, label: "Customers" },
    { to: "/reports", icon: Presentation, label: "Reports" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <h3 className="font-semibold tracking-tight text-gray-900">
          StockFlow
        </h3>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/20"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          z-50
          w-64
          min-h-screen
          bg-white
          border-r border-gray-200
          px-4 py-6
          transform transition-transform duration-200
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* BRAND */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-semibold tracking-tight text-gray-900 text-lg">
            StockFlow
          </h3>

          {/* MOBILE CLOSE BUTTON */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut size={19} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
