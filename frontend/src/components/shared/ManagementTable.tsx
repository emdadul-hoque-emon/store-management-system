"use client";
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from "lucide-react";
import { ReactNode, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ManagementTableRow from "./ManagementTableRow";
import { useRouter, useSearchParams } from "next/navigation";

export interface IColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
  sortKey?: string;
}

interface IManagementTableProps<T> {
  data: T[];
  columns: IColumn<T>[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  getRowKey?: (row: T) => string;
  emptyMessage?: string;
  isRefreshing?: boolean;
}

function ManagementTable<T>({
  data,
  columns = [],
  emptyMessage = "No records found",
  getRowKey,
  isRefreshing = false,
  onDelete,
  onEdit,
  onView,
}: IManagementTableProps<T>) {
  const hasActions = onView || onEdit || onDelete;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSortBy = searchParams.get("orderBy") || "";
  const currentSortOrder = searchParams.get("order") || "desc";

  const handleSort = (sortKey: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentSortBy === sortKey) {
      const newOrder = currentSortOrder === "asc" ? "desc" : "asc";
      params.set("order", newOrder);
    } else {
      params.set("orderBy", sortKey.toString());
      params.set("order", "asc");
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const getSortIcon = (sortKey?: string) => {
    if (!sortKey) return null;

    if (currentSortOrder !== sortKey) {
      return <ArrowUpDown className="size-4 ml-2 text-muted-foreground" />;
    }
    return currentSortOrder === "asc" ? (
      <ArrowUp className="size-4 ml-2 text-muted-foreground" />
    ) : (
      <ArrowDown className="size-4 ml-2 text-muted-foreground" />
    );
  };

  return (
    <>
      <div className="rounded-lg border relative">
        {isRefreshing && (
          <div className="absoulte inset-0 bg-background/50 backdrop-blur-[2px] flex justify-center items-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Refreshing...</p>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, colIndex) => (
                <TableHead key={colIndex} className={column.className}>
                  {column.sortKey ? (
                    <span
                      onClick={() => handleSort(column.sortKey!)}
                      className="flex items-center p-2 transition-colors hover:text-foreground cursor-pointer select-none font-medium"
                    >
                      {column.header}
                      {getSortIcon(column.sortKey)}
                    </span>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {hasActions && <TableHead className="w-17.5">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data?.map((row, rowIndex) => (
                <ManagementTableRow
                  key={getRowKey ? getRowKey(row) : rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  columns={columns}
                  hasActions={hasActions}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default ManagementTable;
