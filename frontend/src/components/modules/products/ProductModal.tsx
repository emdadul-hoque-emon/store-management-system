"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { IProduct } from "@/types/product";
import React from "react";
import ProductForm from "./ProductForm";
import { IUnit } from "@/types/unit";

type Props = {
  product?: IProduct;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const ProductModal = (props: Props) => {
  return (
    <Sheet open={props.open} onOpenChange={props.onClose}>
      <SheetContent side="right">
        <ProductForm
          product={props.product}
          onClose={props.onClose}
          onSuccess={props.onSuccess}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ProductModal;
