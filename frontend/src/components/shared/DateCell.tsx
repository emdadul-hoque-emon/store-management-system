"use client";

import { formatDateTime } from "@/lib/formatters";

interface DateCellProps {
  date: string | number | Date;
}

export function DateCell({ date }: DateCellProps) {
  return <span className="text-sm">{formatDateTime(new Date(date))}</span>;
}
