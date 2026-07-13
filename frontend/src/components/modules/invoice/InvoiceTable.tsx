"use client";
import ManagementTable from "@/components/shared/ManagementTable";
import { Invoice } from "@/types/invoice";
import { IProduct } from "@/types/product";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ProductModal from "../products/ProductModal";
import { invoiceColumns } from "./InvoiceColumns";
import InvoiceForm from "./InvoiceForm";
import InvoiceModal from "./InvoiceModal";

type Props = {
  invoices: Invoice[];
};

const InvoiceTable = ({ invoices }: Props) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (invoice: Invoice) => {
    router.push(`/invoices/${invoice.id}`);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
  };

  const handleDelete = (invoice: Invoice) => {
    setDeletingInvoice(invoice);
  };

  const confirmDelete = async () => {
    if (!deletingInvoice) return;

    setIsDeleting(true);
  };
  return (
    <>
      <InvoiceModal
        open={!!editingInvoice}
        onClose={() => setEditingInvoice(null)}
        onSuccess={handleRefresh}
        invoice={editingInvoice as Invoice}
      />
      <ManagementTable
        data={invoices}
        columns={invoiceColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};

export default InvoiceTable;
