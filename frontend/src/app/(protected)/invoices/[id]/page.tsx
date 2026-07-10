import InvoiceViewPage from "@/components/modules/invoice/SingleInvoice";
import { serverFetch } from "@/lib/serverFetch";
import { Invoice } from "@/types/invoice";
import { IResponse } from "@/types/response";
import { IStore } from "@/types/store";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const res = await serverFetch.get(`/v1/invoice/${id}`);
  const data: IResponse<Invoice> = await res.json();

  const storeRes = await serverFetch.get(`/v1/store/${data.data.storeId}`);
  const storeData: IResponse<IStore> = await storeRes.json();
  return (
    <div>
      {data?.success ? (
        <InvoiceViewPage invoice={data.data} store={storeData.data} />
      ) : (
        <p>Invoice not found</p>
      )}
    </div>
  );
};

export default page;
