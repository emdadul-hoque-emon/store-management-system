"use client";
import { Search } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchFilterProps {
  placeholder?: string;
  paramsName?: string;
}

const SearchFilter = ({
  placeholder = "Search...",
  paramsName = "searchTerm",
}: SearchFilterProps) => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramsName) || "");
  const debouncedValue = useDebounce(value, 500);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const initialValue = searchParams.get(paramsName) || "";

    if (initialValue === debouncedValue) return;

    if (debouncedValue) {
      params.set(paramsName, debouncedValue);
    } else {
      params.delete(paramsName);
    }

    params.set("page", "1");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [debouncedValue, paramsName, searchParams, router]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        type="search"
        name={paramsName}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
        className="pl-10"
      />
    </div>
  );
};

export default SearchFilter;
