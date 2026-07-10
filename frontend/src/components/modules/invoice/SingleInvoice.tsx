"use client";
import { InvoiceDocument } from "@/components/modules/invoice/InvoiceDocument";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getMockInvoice } from "@/lib/mock-invoices";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { IStore } from "@/types/store";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  ImageIcon,
  Printer,
} from "lucide-react";
import { notFound } from "next/navigation";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { InvoicePdf } from "./InvoicePdf";

export default function InvoiceViewPage({
  invoice,
  store,
}: {
  invoice: Invoice;
  store: IStore;
}) {
  if (!invoice) return notFound();

  const handlePrint = async () => {
    const blob = await pdf(
      <InvoicePdf invoice={invoice} store={store} />,
    ).toBlob();

    saveAs(blob, `invoice-${invoice.invoiceNo}.pdf`);
  };
  return (
    <div>
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 print:p-0 print:max-w-none">
        <div className="space-y-4">
          <div className="w-full max-w-4xl  print:hidden">
            <div className="flex items-center justify-end gap-2">
              <Button className="text-xs" size="sm" onClick={handlePrint}>
                <Download data-icon="inline-start" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                className="text-xs"
                size="sm"
                onClick={handlePrint}
              >
                <Printer data-icon="inline-start" />
                Print Invoice
              </Button>
            </div>
          </div>
          <div>
            <InvoiceDocument invoice={invoice} store={store} />
          </div>
        </div>
      </main>

      <style>{`
        @media print {
          @page { margin: 1.5cm; }
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          #invoice-document {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
