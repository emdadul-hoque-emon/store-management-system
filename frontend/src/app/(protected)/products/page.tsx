import { Suspense } from "react";
import { serverFetch } from "@/lib/serverFetch";
import { IResponse } from "@/types/response";
import { IProduct } from "@/types/product";
import ProductTable from "@/components/modules/products/ProductTable";
import ProductManagementHeader from "@/components/modules/products/ProductManagementHeader";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TablePagination from "@/components/shared/TablePagination";
import SearchFilter from "@/components/shared/SearchFilter";
import RefreshButton from "@/components/shared/RefreshButton";
import { IUnit } from "@/types/unit";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const {
    limit = "10",
    page = "1",
    search = "",
    orderBy = "",
    order = "",
  } = await searchParams;
  const res = await serverFetch.get(
    `/v1/product?search=${search}&limit=${limit}&page=${page}&orderBy=${orderBy}&order=${order}`,
  );
  const data: IResponse<IProduct[]> = await res.json();

  return (
    <div className="h-full overflow-auto px-4 py-6 md:px-6 lg:px-8 space-y-6">
      <ProductManagementHeader />
      <div className="flex gap-2">
        <SearchFilter
          placeholder="Search products with name"
          paramsName="search"
        />
        {/* <SelectFilter
          options={[{ label: "Active", value: "ACTIVE" }]}
          paramsName="status"
        /> */}
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <ProductTable products={data.data} />
        <TablePagination
          currentPage={data.meta.page}
          totalPages={Math.ceil(data.meta.total / data.meta.limit)}
          limit={data.meta.limit}
        />
      </Suspense>
    </div>
  );
};

export default page;
