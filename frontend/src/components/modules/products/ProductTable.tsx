"use client";
import ManagementTable from "@/components/shared/ManagementTable";
import { IProduct } from "@/types/product";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { productColumns } from "./ProductColumns";
import ProductModal from "./ProductModal";

type Props = {
  products: IProduct[];
};

const ProductTable = ({ products }: Props) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<IProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (Product: IProduct) => {
    setViewingProduct(Product);
  };

  const handleEdit = (Product: IProduct) => {
    setEditingProduct(Product);
  };

  const handleDelete = (Product: IProduct) => {
    setDeletingProduct(Product);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);
  };
  return (
    <>
      <ProductModal
        product={editingProduct!}
        onClose={() => setEditingProduct(null)}
        onSuccess={() => {
          setEditingProduct(null);
          handleRefresh();
        }}
        open={!!editingProduct}
      />
      <ManagementTable
        data={products}
        columns={productColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};

export default ProductTable;
