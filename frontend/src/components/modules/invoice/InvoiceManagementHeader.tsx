"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { DownloadIcon, Plus } from "lucide-react";
import InvoiceModal from "./InvoiceModal";
import { IUnit } from "@/types/unit";

const InvoiceManagementHeader = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <InvoiceModal
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title="Invoice Management"
        description="Manage Invoice information and details"
        actions={[
          {
            label: "Add Invoice",
            icon: Plus,
            onClick: () => setIsDialogOpen(true),
          },
          {
            label: "Export CSV",
            icon: DownloadIcon,
            onClick: () => {},
          },
        ]}
      />
    </>
  );
};

export default InvoiceManagementHeader;
