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
import type {
  Invoice,
  InvoiceData,
  InvoiceItem,
  LineItem,
} from "@/types/invoice";
import { InvoiceProduct } from "@/types/product";
import { serverFetch } from "@/lib/serverFetch";
import { Button } from "@/components/ui/button";
import { ProductLookup } from "@/components/modules/invoice/ProductLookup";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DialogFooter } from "@/components/ui/dialog";

interface InvoiceFormProps {
  invoice?: Invoice;
  onSuccess?: () => void;
}

const tableHeader = [
  { label: "#", width: "w-8" },
  { label: "Description" },
  { label: "Qty" },
  { label: "Price" },
  { label: "Total" },
  { label: "", width: "w-8" },
];

type InputMode = "manual" | "image";

export default function InvoiceForm({ invoice }: InvoiceFormProps) {
  const isEditMode = !!invoice;
  const [inputMode, setInputMode] = useState<InputMode>(
    isEditMode ? invoice.type : "manual",
  );
  const [products, setProducts] = useState<InvoiceItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    invoice?.imageUrl || null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!invoice?.id) return;
      const data = await serverFetch.get(`/v1/invoice/${invoice.id}/items`);
      const invoiceData = await data.json();
      setProducts(invoiceData.data);
      console.log(invoiceData, "effect res");
    };
    fetchInvoiceData();
  }, [invoice?.id]);

  const handlePrint = () => window.print();

  const handleAddProduct = (product: InvoiceItem) => {
    // @ts-ignore
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
    // try {
    //   setIsSaving(true);
    //   setError(null);
    //   if (!customerName || !customerPhone) {
    //     setError("Please enter customer name and phone number.");
    //     return;
    //   }
    //   if (inputMode === "image") {
    //     const formData = new FormData();
    //     formData.append("storeId", storeId);
    //     formData.append("customerName", customerName);
    //     formData.append("customerPhone", customerPhone);
    //     formData.append("total", "0");
    //     formData.append("file", imageFile!);
    //     const res = await fetch(`http://localhost:4000/api/v1/invoice`, {
    //       method: "POST",
    //       body: formData,
    //       credentials: "include",
    //     });
    //     const data = await res.json();
    //     console.log(data);
    //   } else {
    //     if (products.length === 0) {
    //       setError("Please add at least one product to the invoice.");
    //       return;
    //     }
    //     const res = await fetch(`http://localhost:4000/api/v1/invoice`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         customerName,
    //         customerPhone: customerPhone.toString(),
    //         storeId,
    //         total: products.reduce((acc, p) => acc + p.total, 0).toString(),
    //         items: products.map((p) => ({
    //           productId: p.id,
    //           quantity: p.quantity,
    //           price: p.price,
    //           total: p.total.toString(),
    //         })),
    //         notes,
    //         taxRate,
    //       }),
    //       credentials: "include",
    //     });
    //     const data = await res.json();
    //   }
    // } catch (error) {
    //   console.log(error);
    //   setError("An error occurred while saving the invoice.");
    // } finally {
    //   setIsSaving(false);
    // }
  };

  const handleFileChange = (file: File | null) => {
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 2000,
      });
    }
  }, [error]);

  console.log(invoice);

  return (
    <form className="relative h-[calc(100%-20px)] overflow-auto pt-2 pb-12">
      <div
        className={`grid gap-6 ${
          previewVisible
            ? "lg:grid-cols-[1fr_420px]"
            : "lg:grid-cols-1 max-w-2xl mx-auto"
        }`}
      >
        <div className="space-y-5 relative">
          <section>
            <p>Bill To (Client Details)</p>

            <div className="grid grid-cols-2 gap-3">
              <Field className="space-y-0.5">
                <FieldLabel htmlFor="customerName" className="text-xs">
                  Name
                </FieldLabel>
                <Input
                  id="customerName"
                  name="customerName"
                  defaultValue={isEditMode ? invoice?.customerName : ""}
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
                  defaultValue={isEditMode ? invoice?.customerPhone : ""}
                  name="customerPhone"
                  placeholder="(123) 456-7890"
                  className="h-8 text-sm"
                />
              </div>
            </div>
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
              <ImageUpload onFileChange={handleFileChange} preview={preview} />
            ) : (
              <div>
                <ProductLookup onAddItem={handleAddProduct} />
                {products.length > 0 ? (
                  <div className="overflow-x-auto mb-2">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          {tableHeader.map((header) => (
                            <TableHead
                              key={header.label}
                              className="py-1.5 pr-3 text-left text-xs text-muted-foreground font-medium"
                            >
                              {header.label}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product, index) => (
                          <TableRow key={product.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {/* @ts-ignore */}
                              {product?.name ?? product.product.name}
                            </TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell>${product.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                  // value={taxRate}
                  // onChange={(e) => setTaxRate(Number(e.target.value))}
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
                  // value={notes}
                  // onChange={(e) => setNotes(e.target.value)}
                  placeholder="Payment terms, thank you note…"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      <DialogFooter className="fixed w-full -translate-x-1/2 left-1/2 lg:w-[calc(100%-260px)] h-12 bottom-0 z-30 bg-card/80 backdrop-blur-sm flex justify-center items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              {/* <Button
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
              </Button> */}
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
      </DialogFooter>
    </form>
  );
}
