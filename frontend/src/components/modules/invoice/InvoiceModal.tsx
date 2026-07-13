import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Invoice } from "@/types/invoice";
import React from "react";
import InvoiceForm from "./InvoiceForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice?: Invoice;
};

const InvoiceModal = ({ open, onClose, onSuccess, invoice }: Props) => {
  const isEditMode = !!invoice;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl lg:min-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Invoice" : "Create Invoice"}
          </DialogTitle>
          <DialogDescription>
            Please fill out the form below to {isEditMode ? "update" : "create"}{" "}
            the invoice.
          </DialogDescription>
        </DialogHeader>

        <InvoiceForm invoice={invoice} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
