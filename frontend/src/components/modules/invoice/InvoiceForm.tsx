"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Upload,
  ChevronDown,
  ChevronUp,
  Download,
  Save,
  EyeOff,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LineItemRow } from "@/components/modules/invoice/LineItemRow";
import { ImageUpload } from "@/components/modules/invoice/ImageUpload";
import { cn } from "@/lib/utils";
import type { InvoiceData, LineItem } from "@/types/invoice";
import { InvoiceProduct } from "@/types/product";
import { serverFetch } from "@/lib/serverFetch";
import { Button } from "@/components/ui/button";
import { ProductLookup } from "@/components/modules/invoice/ProductLookup";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

const DEFAULT_DATA: InvoiceData = {
  customerName: "",
  customerPhone: "",
  items: [],
  notes: "",
  taxRate: 0,
};

interface InvoiceFormProps {
  data?: InvoiceData;
  onChange?: (data: InvoiceData) => void;
  storeId: string;
}

type InputMode = "manual" | "image";

export default function InvoiceForm({
  data = { ...DEFAULT_DATA },
  storeId,
}: InvoiceFormProps) {
  const [inputMode, setInputMode] = useState<InputMode>("manual");
  const [customerName, setCustomerName] = useState(data.customerName);
  const [customerPhone, setCustomerPhone] = useState(data.customerPhone);
  const [notes, setNotes] = useState(data.notes);
  const [taxRate, setTaxRate] = useState(data.taxRate);
  const [toExpanded, setToExpanded] = useState(true);
  const [products, setProducts] = useState<InvoiceProduct[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePrint = () => window.print();

  const handleItemsExtracted = (items: LineItem[]) => {
    setInputMode("manual");
  };

  const handleAddProduct = (product: InvoiceProduct) => {
    setProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (!existing) {
        const next = [
          ...prev,
          {
            ...product,
            quantity: 1,
            total: Number(product.price),
          },
        ];
        return next;
      }

      const next = prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              quantity: p.quantity + 1,
              total: (p.quantity + 1) * Number(p.price),
            }
          : p,
      );
      return next;
    });
  };

  const handleSaveInvoice = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (!customerName || !customerPhone) {
        setError("Please enter customer name and phone number.");
        return;
      }

      if (inputMode === "image") {
        const formData = new FormData();
        formData.append("storeId", storeId);
        formData.append("customerName", customerName);
        formData.append("customerPhone", customerPhone);
        formData.append("total", "0");
        formData.append("file", imageFile!);
        const res = await fetch(`http://localhost:4000/api/v1/invoice`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
      } else {
        if (products.length === 0) {
          setError("Please add at least one product to the invoice.");
          return;
        }
        const res = await fetch(`http://localhost:4000/api/v1/invoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName,
            customerPhone: customerPhone.toString(),
            storeId,
            total: products.reduce((acc, p) => acc + p.total, 0).toString(),
            items: products.map((p) => ({
              productId: p.id,
              quantity: p.quantity,
              price: p.price,
              total: p.total.toString(),
            })),
            notes,
            taxRate,
          }),
          credentials: "include",
        });

        const data = await res.json();
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while saving the invoice.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 2000,
      });
    }
  }, [error]);

  return (
    <form className="relative h-[calc(100%-20px)] overflow-auto pt-2">
      <div
        className={`grid gap-6 ${
          previewVisible
            ? "lg:grid-cols-[1fr_420px]"
            : "lg:grid-cols-1 max-w-2xl mx-auto"
        }`}
      >
        <div className="space-y-5 relative">
          <section>
            <button
              type="button"
              onClick={() => setToExpanded((v) => !v)}
              className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 hover:text-foreground transition-colors"
            >
              <span>Bill To (Client Details)</span>
              {toExpanded ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
            {toExpanded && (
              <div className="grid grid-cols-2 gap-3">
                <Field className="space-y-0.5">
                  <FieldLabel htmlFor="customerName" className="text-xs">
                    Name
                  </FieldLabel>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    className="h-8 text-sm"
                  />
                </Field>
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="customerPhone" className="text-xs">
                    Phone
                  </FieldLabel>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(123) 456-7890"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}
          </section>
          <Separator />
          {/* Line Items */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Items
              </h2>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setInputMode("manual")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                    inputMode === "manual"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <FileText className="size-3" />
                  Manual
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("image")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                    inputMode === "image"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Upload className="size-3" />
                  Upload Image
                </button>
              </div>
            </div>

            {inputMode === "image" ? (
              <ImageUpload
                onItemsExtracted={handleItemsExtracted}
                customerName={customerName}
                customerPhone={customerPhone}
                storeId={storeId}
                onFileChange={(file) => setImageFile(file)}
                imageFile={imageFile}
              />
            ) : (
              <div>
                <ProductLookup onAddItem={handleAddProduct} />
                {products.length > 0 ? (
                  <div className="overflow-x-auto mb-2">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-1.5 pr-3 text-left text-xs text-muted-foreground font-medium w-8">
                            #
                          </th>
                          <th className="py-1.5 pr-3 text-left text-xs text-muted-foreground font-medium">
                            Description
                          </th>
                          <th className="py-1.5 pr-3 text-left text-xs text-muted-foreground font-medium w-24">
                            Qty
                          </th>
                          <th className="py-1.5 pr-3 text-left text-xs text-muted-foreground font-medium w-32">
                            Unit Price
                          </th>
                          <th className="py-1.5 pr-3 text-right text-xs text-muted-foreground font-medium w-28">
                            Total
                          </th>
                          <th className="w-8" />
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, i) => (
                          <LineItemRow
                            key={product.id}
                            item={product}
                            index={i}
                            onChange={() => {}}
                            onRemove={() => {}}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-sm text-muted-foreground">
                      No items added yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
          <Separator />
          {/* Tax & Notes */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Additional
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <FieldLabel htmlFor="taxRate" className="text-xs">
                  Tax Rate (%)
                </FieldLabel>
                <Input
                  id="taxRate"
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  placeholder="0"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="notes" className="text-xs">
                  Notes
                </FieldLabel>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Payment terms, thank you note…"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      <footer className="fixed w-full lg:w-[calc(100%-260px)] h-12 bottom-0 z-30 bg-card/80 backdrop-blur-sm flex justify-center items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setPreviewVisible((v) => !v)}
                className="hidden md:flex text-xs"
              >
                {previewVisible ? (
                  <>
                    <EyeOff data-icon="inline-start" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye data-icon="inline-start" />
                    Show Preview
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="text-xs"
              >
                <Download data-icon="inline-start" />
                Export PDF
              </Button>
              <Button
                disabled={isSaving}
                onClick={handleSaveInvoice}
                className="text-xs"
              >
                <Save data-icon="inline-start" />
                {isSaving ? "Saving..." : "Save Invoice"}
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </form>
  );
}
