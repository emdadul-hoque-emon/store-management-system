import { IUnit } from "./unit";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  barcode: string;
  image: string;
  unit: IUnit;
}

export interface InvoiceProduct extends IProduct {
  quantity: number;
  total: number;
}
