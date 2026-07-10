import type { Invoice } from "@/types/invoice";
import { IStore } from "@/types/store";
import Image from "next/image";

const fmt = (val: string | number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    typeof val === "string" ? parseFloat(val) : val,
  );

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

interface InvoiceDocumentProps {
  invoice: Invoice;
  store: IStore;
}

export function InvoiceDocument({ invoice, store }: InvoiceDocumentProps) {
  return (
    <div
      id="invoice-document"
      className="bg-card text-foreground rounded-2xl border border-border shadow-sm font-sans"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-8 pt-4 pb-2 border-b border-border border-dashed">
        <div className="flex items-start justify-center gap-6">
          {/* Brand / Store */}
          <div className="flex flex-col items-center gap-1 w-full">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-full text-center">
                <p className="font-bold text-2xl text-foreground leading-tight">
                  {store.name}
                </p>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {store.address}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{store.phone}</p>
              </div>
            </div>
            <div className="w-full flex flex-col justify-between gap-1 items-center text-xs">
              <div className="w-full flex justify-between items-center">
                <p>Bill: #{invoice.invoiceNo}</p>
                <p>Cleark: {"John Doe"}</p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p>{fmtDate(invoice.createdAt)}</p>
                <p>
                  Time:{" "}
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="w-full flex justify-between items-center">
                <p>Customer Name: {invoice.customerName}</p>
                <p>Customer Phone: {invoice.customerPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Line items ─────────────────────────────────────────────────── */}
      <div className="pt-3 py-3 border-b border-border border-dashed">
        {invoice.type === "image" ? (
          <div className="flex justify-center items-center">
            <Image
              height={400}
              width={400}
              src={invoice.imageUrl as string}
              alt={`${invoice.id}`}
            />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dashed border-border">
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground w-6  pl-8! ">
                  #
                </th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                  Product
                </th>
                <th className="pb-2 text-right text-xs font-medium text-muted-foreground w-20">
                  Qty
                </th>
                <th className="pb-2 text-right text-xs font-medium text-muted-foreground w-28">
                  Unit Price
                </th>
                <th className="pb-2 text-right text-xs font-medium text-muted-foreground  pr-8! ">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="">
              {invoice.items.map((item, i) => (
                <tr key={item.id}>
                  <td className="py-1 px-8! text-muted-foreground text-xs tabular-nums">
                    {i + 1}
                  </td>
                  <td className="py-3 pr-1">
                    <p className="font-medium text-foreground">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {item.product.barcode}
                    </p>
                  </td>
                  <td className="py-3 text-right tabular-nums text-muted-foreground">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right tabular-nums text-muted-foreground">
                    {fmt(item.price)}
                  </td>
                  <td className="py-3 text-right tabular-nums font-semibold text-foreground pr-8! ">
                    {fmt(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Totals ─────────────────────────────────────────────────────── */}
      <div className="px-8 py-5 flex justify-end">
        <div className="w-64 space-y-2.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Bill Amount</span>
            <span className="tabular-nums">{fmt(invoice.total)}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Paid Amount</span>
            <span className="tabular-nums ">{fmt(invoice.paid)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Bal. Amount</span>
            <span className="tabular-nums ">{fmt(invoice.due)}</span>
          </div>
        </div>
      </div>

      {/* ── Note ───────────────────────────────────────────────────────── */}
      {/* {invoice.note && (
        <>
          <Separator />
          <div className="px-8 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Note
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {invoice.note}
            </p>
          </div>
        </>
      )} */}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div className="px-8 py-5 bg-muted/50 rounded-b-2xl border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Thank you for your business &mdash; {store.name}
        </p>
      </div>
    </div>
  );
}
