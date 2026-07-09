export interface Product {
  id: string;
  barcode: string;
  name: string;
  description: string;
  unitPrice: number;
  unit: string;
  category: string;
}

export const PRODUCT_CATALOG: Product[] = [
  {
    id: "p1",
    barcode: "8901234567890",
    name: "Wireless Keyboard",
    description: "Wireless Keyboard MK550",
    unitPrice: 49.99,
    unit: "pcs",
    category: "Electronics",
  },
  {
    id: "p2",
    barcode: "8901234567891",
    name: "USB-C Hub 7-in-1",
    description: "USB-C Hub 7-in-1 Multiport",
    unitPrice: 34.99,
    unit: "pcs",
    category: "Electronics",
  },
  {
    id: "p3",
    barcode: "8901234567892",
    name: "Monitor Stand",
    description: "Adjustable Aluminum Monitor Stand",
    unitPrice: 29.99,
    unit: "pcs",
    category: "Office",
  },
  {
    id: "p4",
    barcode: "8901234567893",
    name: "Mechanical Pencil Set",
    description: "0.5mm Mechanical Pencil 12-pack",
    unitPrice: 12.5,
    unit: "box",
    category: "Stationery",
  },
  {
    id: "p5",
    barcode: "8901234567894",
    name: "Printer Paper A4",
    description: "A4 80gsm Copy Paper 500 sheets",
    unitPrice: 8.99,
    unit: "ream",
    category: "Stationery",
  },
  {
    id: "p6",
    barcode: "8901234567895",
    name: "Ergonomic Mouse",
    description: "Vertical Ergonomic Wireless Mouse",
    unitPrice: 39.99,
    unit: "pcs",
    category: "Electronics",
  },
  {
    id: "p7",
    barcode: "8901234567896",
    name: "Desk Lamp LED",
    description: "LED Desk Lamp with USB Charging",
    unitPrice: 24.99,
    unit: "pcs",
    category: "Office",
  },
  {
    id: "p8",
    barcode: "8901234567897",
    name: "Stapler Heavy Duty",
    description: "25-Sheet Heavy Duty Stapler",
    unitPrice: 15.0,
    unit: "pcs",
    category: "Stationery",
  },
  {
    id: "p9",
    barcode: "8901234567898",
    name: "Notebook Hardcover",
    description: "A5 Dotted Hardcover Notebook",
    unitPrice: 9.99,
    unit: "pcs",
    category: "Stationery",
  },
  {
    id: "p10",
    barcode: "8901234567899",
    name: "HDMI Cable 2m",
    description: "High-Speed HDMI 2.0 Cable 2m",
    unitPrice: 11.99,
    unit: "pcs",
    category: "Electronics",
  },
  {
    id: "p11",
    barcode: "7501234567890",
    name: "Web Cam HD 1080p",
    description: "Full HD 1080p USB Webcam",
    unitPrice: 59.99,
    unit: "pcs",
    category: "Electronics",
  },
  {
    id: "p12",
    barcode: "7501234567891",
    name: "Whiteboard Markers",
    description: "Dry Erase Markers 8-color Set",
    unitPrice: 7.49,
    unit: "set",
    category: "Stationery",
  },
  {
    id: "p13",
    barcode: "7501234567892",
    name: "Cable Management Kit",
    description: "Under-Desk Cable Organizer Kit",
    unitPrice: 18.0,
    unit: "pcs",
    category: "Office",
  },
  {
    id: "p14",
    barcode: "7501234567893",
    name: "Surge Protector 6-port",
    description: "6-Port Power Strip with Surge",
    unitPrice: 22.99,
    unit: "pcs",
    category: "Electronics",
  },
  {
    id: "p15",
    barcode: "7501234567894",
    name: "Blue Light Glasses",
    description: "Anti Blue Light Computer Glasses",
    unitPrice: 16.99,
    unit: "pcs",
    category: "Office",
  },
];

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return PRODUCT_CATALOG.slice(0, 8);
  const q = query.toLowerCase();
  return PRODUCT_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.barcode.includes(q),
  );
}

export function findByBarcode(barcode: string): Product | undefined {
  return PRODUCT_CATALOG.find((p) => p.barcode === barcode);
}
