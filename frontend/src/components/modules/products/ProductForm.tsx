"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProduct } from "@/types/product";
import { IUnit } from "@/types/unit";
import React, { useEffect } from "react";

type Props = {
  product?: IProduct;
  onClose?: () => void;
  onSuccess?: () => void;
};

const ProductForm = ({ product, onClose, onSuccess }: Props) => {
  const isEditMode = !!product;

  const [selectedUnit, setSelectedUnit] = React.useState<IUnit | null>(
    product?.unit || null,
  );
  const [unit, setUnit] = React.useState<IUnit[]>([]);

  useEffect(() => {
    const fetchUnits = async () => {
      const res = await fetch(`http://localhost:4000/api/v1/unit`, {
        cache: "force-cache",
      });
      const data = await res.json();
      setUnit(data.data);
    };
    fetchUnits();
  }, []);

  useEffect(() => {
    if (product?.unit) {
      setSelectedUnit(product.unit);
    }
  }, [product?.unit]);
  return (
    <form className="relative h-full">
      <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary">
            {isEditMode ? "Edit" : "Create"} Product
          </h2>
          {isEditMode && (
            <p className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mt-1">
              ID: {product?.id}
            </p>
          )}
        </div>
      </div>
      {/* <!-- Form Content --> */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
        {/* <!-- Section: Primary Info --> */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="name"
                className="font-label-md text-label-md text-on-surface-variant"
              >
                PRODUCT NAME
              </FieldLabel>
              <Input
                className="rounded-md"
                type="text"
                id="name"
                defaultValue={isEditMode ? product?.name : ""}
                placeholder="Enter product name"
              />
            </Field>
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="barcode"
                className="font-label-md text-label-md text-on-surface-variant"
              >
                BARCODE
              </FieldLabel>
              <Input
                className="rounded-md"
                type="text"
                id="barcode"
                defaultValue={isEditMode ? product?.barcode : ""}
                placeholder="Enter product barcode"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="category"
                className="font-label-md text-label-md text-on-surface-variant"
              >
                CATEGORY
              </FieldLabel>
              <div className="relative">
                <Select>
                  <SelectTrigger id="category" disabled className="rounded-md">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chemicals">Chemicals</SelectItem>
                    <SelectItem value="Machinery">Machinery</SelectItem>
                    <SelectItem value="Structural">Structural</SelectItem>
                    <SelectItem value="Safety Gear">Safety Gear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Field>
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="unit"
                className="font-label-md text-label-md text-on-surface-variant"
              >
                UNIT
              </FieldLabel>
              <div className="relative">
                <Select
                  onValueChange={(value) => {
                    const selected = unit.find((u) => u.name === value);
                    setSelectedUnit(selected || null);
                  }}
                  value={selectedUnit?.name || ""}
                >
                  <SelectTrigger id="unit" className="rounded-md">
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unit.map((unit) => (
                      <SelectItem key={unit.id} value={unit.name}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Field>
          </div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="price"
                className="font-label-md text-label-md text-on-surface-variant"
              >
                BASE PRICE (USD)
              </FieldLabel>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-mono-data">
                  $
                </span>
                <Input
                  id="price"
                  className="rounded-md pl-8"
                  step="0.01"
                  type="number"
                  defaultValue={isEditMode ? product?.price : ""}
                  placeholder="Enter product price"
                />
              </div>
            </Field>
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="stock"
                className="font-label-md text-label-md text-on-surface-variant"
              >
                CURRENT STOCK
              </FieldLabel>
              <Input
                id="stock"
                className="rounded-md"
                type="number"
                defaultValue={isEditMode ? product?.stock : ""}
                placeholder="Enter current stock"
              />
            </Field>
          </div>
        </div>
      </div>
      <div className="flex gap-3 absolute bottom-0 left-0 w-full border-t border-outline-variant bg-surface-container-lowest px-8 py-4">
        <Button
          onClick={() => onClose?.()}
          variant="outline"
          className="rounded-none flex-1 py-5"
        >
          Cancel
        </Button>
        <Button className="flex-1 rounded-none py-5">Save Changes</Button>
      </div>
    </form>
  );
};

export default ProductForm;
