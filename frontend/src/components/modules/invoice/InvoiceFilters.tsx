"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { CalendarDays, Download, Search, Printer } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { startTransition } from "react";

type Props = {};

const filters = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Paid",
    value: "paid",
  },
  {
    label: "Partial",
    value: "partial",
  },
];

const InvoiceFilters = (props: Props) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    setSearchQuery(search);
    setSelectedFilter(status);
  }, [searchParams]);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchQuery.trim()) {
      params.set("search", debouncedSearchQuery.trim());
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.replace(`/invoices?${params.toString()}`);
    });
  }, [debouncedSearchQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    const date = formData.get("date") as string;

    if (!search && !date) return;

    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    if (date) params.set("date", date);
    else params.delete("date");

    startTransition(() => {
      router.push(`/invoices?${params.toString()}`);
    });
  };

  const handleFilterChange = (status: string) => {
    setSelectedFilter(status);
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set("status", status);
    else params.delete("status");
    startTransition(() => {
      router.push(`/invoices?${params.toString()}`);
    });
  };
  return (
    <div className="flex flex-wrap items-center gap-4 border border-outline-variant bg-surface-container-lowest p-4">
      <form className="relative min-w-60 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-outline-variant bg-transparent py-2 pl-10 pr-4 font-body-md focus:border-secondary-container focus:ring-0"
          placeholder="Search by ID or Customer..."
          name="search"
          type="search"
        />
      </form>

      <div className="flex items-center overflow-hidden rounded-sm border border-outline-variant">
        {filters.map((f) => (
          <button
            type="button"
            key={f.value}
            className={`px-4 py-2 font-label-md text-label-md transition-colors ${
              selectedFilter === f.value
                ? "bg-primary-container text-primary-foreground"
                : "hover:bg-surface-container-high"
            }`}
            onClick={() => handleFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="flex items-center gap-2 border border-outline-variant px-4 py-2 font-label-md text-label-md transition-colors hover:bg-surface-container-high"
      >
        <CalendarDays className="h-4 w-4" />
        Date Range
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="border border-outline-variant p-2 transition-colors hover:bg-surface-container-high"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="border border-outline-variant p-2 transition-colors hover:bg-surface-container-high"
        >
          <Printer className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default InvoiceFilters;
