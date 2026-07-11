"use client";
import { IColumn } from "@/components/shared/ManagementTable";
import { Star, MapPin } from "lucide-react";
import { IProduct } from "@/types/product";
import { DateCell } from "@/components/shared/DateCell";

export const productColumns: IColumn<IProduct>[] = [
  {
    header: "Name",
    accessor: (product) => (
      <div className="flex items-center gap-3">
        <div>
          <p className="font-semibold text-sm">{product.name}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Barcode",
    accessor: (product) => <span className="text-sm">{product.barcode}</span>,
  },
  {
    header: "Unit",
    accessor: (product) => (
      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
        {product.unit.name}
      </span>
    ),
  },
  {
    header: "Stock",
    accessor: (product) => (
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold">{product.stock}</span>
      </div>
    ),
  },
  {
    header: "Price",
    accessor: (product) => (
      <span className="text-sm font-semibold ">${product.price}</span>
    ),
    sortKey: "price",
  },
];
