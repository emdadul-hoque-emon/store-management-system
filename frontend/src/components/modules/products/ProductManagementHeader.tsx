"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { DownloadIcon, Plus } from "lucide-react";
import ProductModal from "./ProductModal";

const ProductManagementHeader = () => {
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
      <ProductModal
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title="Product Management"
        description="Manage Products information and details"
        actions={[
          {
            label: "Add Product",
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

export default ProductManagementHeader;
