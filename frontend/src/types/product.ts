export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  barcode: string;
  image: string;
  unit: {
    name: string;
    shortName: string;
  };
}

export interface InvoiceProduct extends IProduct {
  quantity: number;
  total: number;
}
