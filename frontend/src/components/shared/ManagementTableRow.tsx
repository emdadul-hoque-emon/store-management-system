"use client";
import React, { useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { IColumn } from "./ManagementTable";

interface ManagementTableRowProps<T> {
  row: T;
  rowIndex: number;
  columns: IColumn<T>[];
  hasActions: ((row: T) => void) | undefined;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

const ManagementTableRow = ({
  row,
  rowIndex,
  columns,
  hasActions,
  onView,
  onEdit,
  onDelete,
}: ManagementTableRowProps<any>) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  return (
    <TableRow key={rowIndex}>
      {columns.map((cell, cellIdx) => (
        <TableCell key={cellIdx} className={cell.className}>
          {typeof cell.accessor === "function"
            ? cell.accessor(row)
            : String(row[cell.accessor])}
        </TableCell>
      ))}
      {hasActions && (
        <TableCell>
          <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem
                  onClick={() => {
                    onView(row);
                    setOpenDropdown(false);
                  }}
                >
                  <Eye className="mr-2 size-4" />
                  View
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(row);
                    setOpenDropdown(false);
                  }}
                >
                  <Edit className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => {
                    onDelete(row);
                    setOpenDropdown(false);
                  }}
                >
                  <Trash className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  );
};

export default ManagementTableRow;
