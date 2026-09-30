import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Users, Search, Plus, Phone, Mail, MapPin, X } from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("customers");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Rahul Sharma",
            phone: "9876543210",
            email: "rahul@example.com",
            gstin: "07AAAAA0000A1Z5",
            billingAddress: "Cannaught Place, New Delhi",
          },
        ];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: "",
    billingAddress: "",
  });

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  const handleopenAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: "", phone: "", email: "", billingAddress: "" });
    setShowModal(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Name and Phone are required.");
      return;
    }

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id ? { ...formData, id: c.id } : c,
        ),
      );
    } else {
      const newCustomer = {
        ...formData,
        id: Date.now(),
      };
      setCustomers((prev) => [newCustomer, ...prev]);
    }
    setShowModal(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.gstin && c.gstin.toLowerCase().includes(searchTerm.toLowerCase())),
  );
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="mt-2 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your client database and billing profiles
            </p>
          </div>
          <button
            onClick={handleopenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            <Plus size={18} /> Add Customer
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by customer name, phone, or GSTIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* CUSTOMERS TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead
                className="bg-gray-100 border-b border-gray-200 text-gray-600 text-mediu
              "
              >
                <tr>
                  <th className="text-left px-5 py-3">Customers</th>
                  <th className="text-left px-5 py-3">Contact</th>
                  <th className="text-left px-5 py-3">GSTIN</th>
                  <th className="text-left px-5 py-3">Billing Address</th>
                  <th className="text-left px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-5 py-4 text-gray-600 space-x-0.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone size={13} className="text-gray-400" />{" "}
                          {item.phone}
                        </div>
                        {item.email && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Mail /> {item.email}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs font-mono">
                        {item.gstin || "-"}
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs max-w-xs truncate">
                        {item.billingAddress || "-"}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCustomer ? "Edit Customer" : "New Customer"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="Enter phone"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) =>
                    setFormData({ ...formData, gstin: e.target.value.toUpperCase() })
                  }
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="GST Number"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                type="submit"
                className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
