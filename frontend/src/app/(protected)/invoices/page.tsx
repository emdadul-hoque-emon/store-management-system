import InvoiceFilters from "@/components/modules/invoice/InvoiceFilters";
import InvoiceManagementHeader from "@/components/modules/invoice/InvoiceManagementHeader";
import InvoiceTable from "@/components/modules/invoice/InvoiceTable";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import TablePagination from "@/components/shared/TablePagination";
import TableSkeleton from "@/components/shared/TableSkeleton";
import { serverFetch } from "@/lib/serverFetch";
import { auth } from "@/lib/session";
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
import { Suspense } from "react";

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
    <div className="h-full overflow-auto px-4 py-6 md:px-6 lg:px-8 space-y-6">
      <InvoiceManagementHeader />
      <div className="flex gap-2">
        <SearchFilter
          placeholder="Search invoice with customer name & phone"
          paramsName="search"
        />
        {/* <SelectFilter
          options={[{ label: "Active", value: "ACTIVE" }]}
          paramsName="status"
        /> */}
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
        <InvoiceTable invoices={data.data} />
        <TablePagination
          currentPage={data.meta.page}
          totalPages={Math.ceil(data.meta.total / data.meta.limit)}
          limit={data.meta.limit}
        />
      </Suspense>
    </div>
  );
}
