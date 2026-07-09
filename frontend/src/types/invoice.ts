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
