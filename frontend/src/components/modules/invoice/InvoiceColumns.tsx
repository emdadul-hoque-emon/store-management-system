"use client";
import { IColumn } from "@/components/shared/ManagementTable";
import { Star, MapPin } from "lucide-react";
import { Invoice } from "@/types/invoice";
import { DateCell } from "@/components/shared/DateCell";

export const invoiceColumns: IColumn<Invoice>[] = [
  {
    header: "Invoice ID",
    accessor: (invoice) => (
      <div className="flex items-center gap-3">
        <div>
          <p className="font-semibold text-sm">
            #INV-{invoice.invoiceNo.toString().padStart(6, "0")}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Customer",
    accessor: (invoice) => (
      <div className="flex flex-col">
        <span className="font-semibold text-primary">
          {invoice.customerName}
        </span>
        <span>{invoice.customerPhone}</span>
      </div>
    ),
  },
  {
    header: "Date Issued",
    accessor: (invoice) => (
      <p>
        {new Date(invoice.createdAt)
          .toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .replace(",", "")}
      </p>
    ),
  },
  {
    header: "Total Amount",
    accessor: (invoice) => (
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold">${invoice.total}</span>
      </div>
    ),
    sortKey: "total",
  },
  {
    header: "Status",
    accessor: (invoice) => <span>{invoice.status}</span>,
  },
  {
    header: "Type",
    accessor: (invoice) => <span>{invoice.type}</span>,
  },
];
