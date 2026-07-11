"use client";
import React, { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface SelectFilterProps {
  paramsName: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

const SelectFilter = ({
  options,
  paramsName,
  placeholder = "Filter by",
}: SelectFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [currentValue, setCurrentValue] = useState("All");

  const handleChange = (value: string) => {
    setCurrentValue(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") {
      params.delete(paramsName);
    } else if (value) {
      params.set(paramsName, value);
    } else {
      params.delete(paramsName);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Select
      value={currentValue}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger id={paramsName}>
        <SelectValue placeholder={placeholder || "Filter by"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={"all"} value="All">
          All
        </SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectFilter;
