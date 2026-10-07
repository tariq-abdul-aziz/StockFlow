import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { products as defaultProducts } from "../data/products";

const InvoiceItems = ({ items, setItems }) => {
  // Load current inventory products from LocalStorage
  const [inventory] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const handleProductSelect = (id, selectedProductId) => {
    const selected = inventory.find((p) => p.id === Number(selectedProductId));

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              productId: selected ? selected.id : "",
              product: selected ? selected.productName : "",
              rate: selected ? selected.sellingPrice : "",
            }
          : item,
      ),
    );
  };

  const handleItemChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const addItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now(),
        productId: "",
        product: "",
        quantity: 1,
        rate: "",
      },
    ]);
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  return (
    <section className="mt-5 bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Invoice Items
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Add products or services to this invoice.
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            {/* Product Dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Product
              </label>

              <select
                value={item.productId || ""}
                onChange={(e) => handleProductSelect(item.id, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-gray-400"
              >
                <option value="">Select a product</option>
                {inventory.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.productName} {prod.sku}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(item.id, "quantity", e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              />
            </div>

            {/* Rate */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Rate
              </label>

              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={item.rate}
                onChange={(e) =>
                  handleItemChange(item.id, "rate", e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              />
            </div>

            {/* Action */}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              disabled={item.length === 1}
              className="flex items-center justify-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InvoiceItems;
