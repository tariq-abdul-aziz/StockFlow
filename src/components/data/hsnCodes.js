export const HSN_DIRECTORY = [
  // IT & Electronics
  { hsn: "84713010", description: "Laptops / Notebooks", gst: 18 },
  { hsn: "8471", description: "Automatic data processing machines & computers", gst: 18 },
  { hsn: "84433290", description: "Printers / Facsimile", gst: 18 },
  { hsn: "85176290", description: "Routers, Switches & Networking Equipment", gst: 18 },
  { hsn: "85285200", description: "Computer Monitors", gst: 18 },
  { hsn: "84717020", description: "Hard Disk Drives / SSDs", gst: 18 },
  { hsn: "85044090", description: "Power Adapters / Inverters / UPS", gst: 18 },
  { hsn: "85171300", description: "Smartphones", gst: 18 },
  { hsn: "8518", description: "Microphones, Speakers & Headphones", gst: 18 },
  { hsn: "85235100", description: "Solid-state storage devices / USB flash drives", gst: 18 },

  // Electricals & Machinery
  { hsn: "8501", description: "Electric motors and generators", gst: 18 },
  { hsn: "8544", description: "Insulated wires and cables", gst: 18 },
  { hsn: "8415", description: "Air conditioning machines", gst: 28 },
  { hsn: "8418", description: "Refrigerators and freezers", gst: 28 },

  // Furniture & Office
  { hsn: "9403", description: "Office Furniture", gst: 18 },
  { hsn: "4820", description: "Registers, notebooks, paper stationery", gst: 12 },
  { hsn: "9608", description: "Ball point pens and markers", gst: 12 },

  // Textiles & Essentials
  { hsn: "6109", description: "T-shirts, singlets, and other vests", gst: 5 },
  { hsn: "6203", description: "Men's suits, jackets, trousers", gst: 12 },
  { hsn: "6403", description: "Footwear", gst: 12 },

  // Services (SAC)
  { hsn: "998313", description: "IT infrastructure and network management services", gst: 18 },
  { hsn: "998314", description: "Internet telecommunication services", gst: 18 },
  { hsn: "998713", description: "Maintenance & repair services of computers", gst: 18 }
];

export const getGstByHsn = (hsnInput) => {
  if (!hsnInput) return null;
  const clean = hsnInput.trim();
  const matched = HSN_DIRECTORY.find((item) => item.hsn === clean);
  return matched ? matched.gst : null;
};