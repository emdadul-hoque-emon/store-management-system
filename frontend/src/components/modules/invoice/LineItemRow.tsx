"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LineItem } from "@/types/invoice";
import { InvoiceProduct, IProduct } from "@/types/product";

interface LineItemRowProps {
  item: InvoiceProduct;
  onChange: (
    id: string,
    field: keyof InvoiceProduct,
    value: string | number,
  ) => void;
  onRemove: (id: string) => void;
  index: number;
}

export function LineItemRow({
  item,
  onChange,
  onRemove,
  index,
}: LineItemRowProps) {
  const total = item.quantity * item.price;

  return (
    <tr className="group border-b border-border last:border-0">
      <td className="py-2 pr-3 text-sm text-muted-foreground w-8">
        {index + 1}
      </td>
      <td className="py-2 pr-3">
        <p>{item.name}</p>
      </td>
      <td className="py-2 pr-3 w-24">
        <p>{item.quantity}</p>
      </td>
      <td className="py-2 pr-3 w-32">
        <div className="relative">
          <p>${item.price}</p>
        </div>
      </td>
      <td className="py-2 pr-3 w-28 text-right font-medium text-sm">
        ${total}
      </td>
      <td className="py-2 w-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          aria-label="Remove item"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </td>
    </tr>
  );
}
