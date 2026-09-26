export const products = [
    {
      id: 1,
      productName: "Laptop A",
      sku: "LAP001",
      category: "Laptop",
      currentStock: 24,
      lowStockLevel: 5,
      serialTracking: true,
      purchasePrice: 45000,
      sellingPrice: 52000,
      gst: 18,
      hsn: "84713010",

      stockHistory: [
        {
          id: 1,
          date: "09 Aug",
          type: "Stock Out",
          quantity: -3,
        },
        {
          id: 2,
          date: "08 Aug",
          type: "Stock In",
          quantity: 10,
        },
        {
          id: 3,
          date: "05 Aug",
          type: "Stock Out",
          quantity: -2,
        },
      ],
      serialNumbers: Array.from(
        {length: 24},
        (_, index) => `LAP-SN-${String(index + 1).padStart(3, "0")}`
      ),
    },

    {
      id: 2,
      productName: "Printer B",
      sku: "PRI002",
      category: "Printer",
      currentStock: 4,
      lowStockLevel: 5,
      serialTracking: true,
      purchasePrice: 12000,
      sellingPrice: 15000,
      gst: 18,
      hsn: "84433290",
      stockHistory: [],
      serialNumbers: Array.from(
        {length: 4},
        (_, index) => `PRI-SN-${String(index + 1).padStart(3, "0")}`
      ),
    },

    {
      id: 3,
      productName: "Router C",
      sku: "ROU003",
      category: "Networking",
      currentStock: 0,
      lowStockLevel: 5,
      serialTracking: false,
      purchasePrice: 1800,
      sellingPrice: 2500,
      gst: 18,
      hsn: "85176290",
      stockHistory: [],
      serialNumbers: [],
    },
  ];