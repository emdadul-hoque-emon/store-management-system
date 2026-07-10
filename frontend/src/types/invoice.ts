import { InvoiceProduct } from "./product";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  customerName: string;
  customerPhone: string;
  items: LineItem[];
  notes: string;
  taxRate: number;
}

// ─── Builder / editor types (used on the create page) ───────────────────────

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  items: LineItem[];
  notes: string;
  taxRate: number;
}

// ─── DB / view types (aligned with Drizzle schema) ──────────────────────────

export type InvoiceStatus = "paid" | "partial" | "due";
export type InvoiceType = "manual" | "image";

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  productName: string; // joined from products table
  quantity: number;
  price: string; // numeric as string (Drizzle returns strings for numeric)
  total: string;
  product: InvoiceProduct;
}

export interface Invoice {
  id: string;
  storeId: string;
  invoiceNo: number;
  customerName: string;
  customerPhone: string;
  subtotal: string;
  discount: string;
  total: string;
  paid: string;
  due: string;
  status: InvoiceStatus;
  type: InvoiceType;
  imageUrl?: string | null;
  note?: string | null;
  createdAt: string; // ISO date string
  storeName: string; // joined from store table
  storeAddress?: string;
  storePhone?: string;
  items: InvoiceItem[];
}
