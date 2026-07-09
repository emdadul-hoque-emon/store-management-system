import InvoiceFilters from "@/components/modules/invoice/InvoiceFilters";
import { serverFetch } from "@/lib/serverFetch";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  Filter,
  FileText,
  PencilLine,
  Plus,
  Printer,
  TriangleAlert,
  TrendingUp,
  Search,
} from "lucide-react";
import Link from "next/link";

const kpis = [
  {
    title: "Total Outstanding",
    value: "$412,890",
    delta: "+4.2%",
    icon: Clock3,
    deltaClassName: "text-error",
    progress: 70,
  },
  {
    title: "Paid Today",
    value: "$28,450",
    delta: "From 14 verified transactions",
    icon: CheckCircle2,
    deltaClassName: "text-green-600",
    deltaIcon: TrendingUp,
  },
  {
    title: "Overdue Invoices",
    value: "08",
    delta: "Invoices",
    icon: AlertTriangle,
    deltaClassName: "text-error",
    avatars: true,
  },
];

const invoices = [
  {
    id: "#INV-90210",
    customer: "Global Logistics Corp",
    customerId: "CUST-882",
    issued: "Oct 24, 2023",
    due: "Nov 07, 2023",
    amount: "$12,450.00",
    status: "Paid",
    statusClassName: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: "#INV-90211",
    customer: "Nexus Systems Ltd.",
    customerId: "CUST-419",
    issued: "Oct 26, 2023",
    due: "Nov 09, 2023",
    amount: "$8,210.00",
    status: "Pending",
    statusClassName: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "#INV-90212",
    customer: "AeroCore Dynamics",
    customerId: "CUST-220",
    issued: "Oct 15, 2023",
    due: "Oct 29, 2023",
    amount: "$21,000.50",
    status: "Overdue",
    statusClassName: "bg-red-100 text-red-800 border-red-200",
    overdue: true,
  },
  {
    id: "#INV-90213",
    customer: "Swift Freight NV",
    customerId: "CUST-701",
    issued: "Oct 28, 2023",
    due: "Nov 11, 2023",
    amount: "$4,500.00",
    status: "Paid",
    statusClassName: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: "#INV-90214",
    customer: "Quantum Tech Inc",
    customerId: "CUST-012",
    issued: "Oct 29, 2023",
    due: "Nov 12, 2023",
    amount: "$33,400.00",
    status: "Pending",
    statusClassName: "bg-amber-100 text-amber-800 border-amber-200",
  },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const search = (await searchParams).search || "";
  const page = parseInt((await searchParams).page || "1", 10);
  const limit = parseInt((await searchParams).limit || "10", 10);
  const res = await serverFetch.get(
    `/v1/invoice?search=${search}&page=${page}&limit=${limit}`,
  );

  const data = await res.json();

  return (
    <div className="flex-1 space-y-gutter bg-surface p-gutter industrial-grid h-[calc(100%-20px)] overflow-auto ">
      <div className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-headline-lg font-headline-lg text-primary">
              Invoices
            </h1>
            <p className="font-body-md text-on-surface-variant">
              Manage and track billing across the global supply chain.
            </p>
          </div>
          <Link
            href="/invoices/new"
            className="flex items-center gap-2 bg-secondary-container px-6 py-3 font-label-md text-label-md font-bold uppercase tracking-widest text-on-secondary-container shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.title}
              className="border border-outline-variant bg-surface-container-lowest p-6"
            >
              <div className="flex items-start justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                  {kpi.title}
                </span>
                <kpi.icon className="h-4 w-4 text-outline" />
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-display-lg font-display-lg text-primary">
                  {kpi.value}
                </span>
                {kpi.deltaIcon ? (
                  <span className={kpi.deltaClassName}>
                    <kpi.deltaIcon className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span
                    className={`${kpi.deltaClassName} font-label-md text-label-md`}
                  >
                    {kpi.delta}
                  </span>
                )}
              </div>

              {typeof kpi.progress === "number" ? (
                <div className="mt-4 h-1 w-full bg-surface-container-high">
                  <div
                    className="h-full bg-secondary-container"
                    style={{ width: `${kpi.progress}%` }}
                  />
                </div>
              ) : null}

              {kpi.delta && !kpi.deltaIcon && !kpi.avatars && !kpi.progress ? (
                <div className="mt-4 text-body-sm text-on-surface-variant">
                  {kpi.delta}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <InvoiceFilters />

        <div className="overflow-hidden border border-outline-variant bg-surface-container-lowest">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low *:text-center">
                  <th className="px-6 py-3 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    Customer
                  </th>
                  <th className="px-6 py-3 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    Date Issued
                  </th>
                  <th className="px-6 py-3 text-right font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {data.data.length === 0 ? (
                  <tr className="w-full text-center flex justify-center items-center py-3">
                    <td
                      colSpan={6}
                      className="py-4 text-on-surface-variant col-span-6"
                    >
                      No Invoice Found
                    </td>
                  </tr>
                ) : (
                  data.data.map((invoice: any) => (
                    <tr
                      key={invoice.id}
                      className={`group transition-colors hover:bg-surface-container *:text-center ${
                        invoice.overdue ? "bg-red-50/20" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-mono-data text-mono-data text-primary">
                        #INV-{invoice.invoiceNo.toString().padStart(6, "0")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">
                            {invoice.customerName}
                          </span>
                          <span>01787286529</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body-md text-on-surface-variant">
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
                      </td>
                      <td className="px-6 py-4 text-right font-mono-data text-mono-data font-semibold">
                        {invoice.total}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-sm border px-2 py-1 text-[10px] font-bold uppercase `}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            className="p-1 hover:text-secondary-container"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="p-1 hover:text-secondary-container"
                            title="Edit"
                          >
                            <PencilLine className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="p-1 hover:text-secondary-container"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low px-6 py-4">
            <p className="font-body-sm text-on-surface-variant">
              Showing {(data.meta.page - 1) * data?.meta.limit + 1}-
              {(data.meta.page - 1) * data?.meta.limit + data.data.length} of{" "}
              {data?.meta.total} invoices
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="border border-outline-variant p-1 disabled:opacity-30"
                disabled
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center bg-primary-container font-label-md text-label-md text-primary-foreground"
                >
                  1
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center font-label-md text-label-md hover:bg-surface-container-high"
                >
                  2
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center font-label-md text-label-md hover:bg-surface-container-high"
                >
                  3
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center font-label-md text-label-md"
                >
                  ...
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center font-label-md text-label-md hover:bg-surface-container-high"
                >
                  5
                </button>
              </div>
              <button
                type="button"
                className="border border-outline-variant p-1 hover:bg-surface-container-high"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
