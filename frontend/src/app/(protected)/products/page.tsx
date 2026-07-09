import {
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import ProductForm from "@/components/modules/products/ProductForm";
import React from "react";
import { serverFetch } from "@/lib/serverFetch";
import { IResponse } from "@/types/response";
import { IProduct } from "@/types/product";
import { Input } from "@/components/ui/input";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { limit = "10", page = "1", search = "" } = await searchParams;
  const res = await serverFetch.get(
    `/v1/product?search=${search}&limit=${limit}&page=${page}`,
  );
  const data: IResponse<IProduct[]> = await res.json();

  return (
    <div className="h-full overflow-auto bg-surface px-4 py-6 md:px-6 lg:px-8">
      <main className="ml-sidebar-width p-gutter">
        {/* <!-- Header Actions --> */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <nav className="flex text-on-surface-variant font-label-md text-[10px] uppercase tracking-widest mb-2">
              <a className="hover:text-primary" href="#">
                Inventory
              </a>
              <span className="mx-2">/</span>
              <span className="text-primary font-bold">Products List</span>
            </nav>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Warehouse Inventory
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container-lowest text-on-surface font-label-md hover:bg-surface-container-high transition-colors">
              <span
                className="material-symbols-outlined text-[18px]"
                data-icon="file_download"
              >
                <DownloadIcon size={18} />
              </span>
              Export CSV
            </button>
            <ProductForm>
              <button className="bg-secondary-container hover:brightness-110 text-on-secondary-fixed px-6 py-2.5 rounded shadow-sm flex items-center gap-2 transition-all active:scale-95 group">
                <span className="material-symbols-outlined font-bold text-sm">
                  <Plus />
                </span>
                <span className="font-label-md text-label-md uppercase tracking-wider">
                  Add New Product
                </span>
              </button>
            </ProductForm>
          </div>
        </div>
        {/* <!-- Filter Chips Section --> */}
        <div className="flex flex-wrap items-center gap-3 pb-4">
          {/* <span className="text-on-surface-variant font-label-md uppercase tracking-wider text-[11px] mr-2">
            Quick Filters:
          </span> */}
          <form className="w-full flex items-center gap-2 border border-outline-variant rounded px-3 py-1.5">
            <Input
              type="text"
              placeholder="Search products..."
              className="bg-transparent border-none focus-visible:ring-0 text-on-surface-variant font-label-md text-[11px]"
            />
            <button className="px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant font-label-md text-[11px] hover:border-primary hover:text-primary transition-all">
              Search
            </button>
          </form>
          {/* Category Chips */}
          {/* <div className="flex gap-2 mr-4 border-r border-outline-variant pr-4">
            <button className="px-3 py-1.5 rounded bg-primary text-surface-lowest font-label-md text-[11px] transition-all">
              All Categories
            </button>
            <button className="px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant font-label-md text-[11px] hover:border-primary hover:text-primary transition-all">
              Heavy Machinery
            </button>
            <button className="px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant font-label-md text-[11px] hover:border-primary hover:text-primary transition-all">
              Electrical
            </button>
            <button className="px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant font-label-md text-[11px] hover:border-primary hover:text-primary transition-all">
              Raw Materials
            </button>
          </div> */}
          {/* <!-- Stock Status Chips --> */}
          {/* <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant font-label-md text-[11px] hover:border-primary hover:text-primary transition-all flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> In
              Stock
            </button>
            <button className="px-3 py-1.5 rounded bg-secondary-container/20 border border-secondary-container text-secondary font-label-md text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>{" "}
              Low Stock
            </button>
            <button className="px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant font-label-md text-[11px] hover:border-primary hover:text-primary transition-all flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Out of
              Stock
            </button>
          </div> */}
        </div>
        {/* <!-- Inventory List / Table --> */}
        <div className="bg-surface-container-lowest border border-outline-variant shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant">
                <th className="px-6 py-3 font-label-md text-on-surface-variant uppercase text-[11px] tracking-widest w-12">
                  <input
                    className="rounded-sm border-outline-variant text-secondary-container focus:ring-secondary-container"
                    type="checkbox"
                  />
                </th>
                <th className="px-6 py-3 font-label-md text-on-surface-variant uppercase text-[11px] tracking-widest">
                  Product Name
                </th>
                <th className="px-6 py-3 font-label-md text-on-surface-variant uppercase text-[11px] tracking-widest">
                  Barcode
                </th>
                <th className="px-6 py-3 font-label-md text-on-surface-variant uppercase text-[11px] tracking-widest">
                  Unit
                </th>
                <th className="px-6 py-3 font-label-md text-on-surface-variant uppercase text-[11px] tracking-widest">
                  Stock
                </th>
                <th className="px-6 py-3 font-label-md text-on-surface-variant uppercase text-[11px] tracking-widest">
                  Price
                </th>
                <th className="px-6 py-3 font-label-md text-on-surface-variant uppercase text-[11px] tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {/* <!-- Row 1 --> */}
              {data.data.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-surface-bright transition-colors group"
                >
                  <td className="px-6 py-3">
                    <input
                      className="rounded-sm border-outline-variant text-secondary-container focus:ring-secondary-container"
                      type="checkbox"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-[14px] text-primary">
                        {product.name}
                      </span>
                      {/* <span className="font-mono-data text-[10px] text-on-surface-variant">
                        SKU: {product.sku}
                      </span> */}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-mono-data text-on-surface-variant">
                    {product.barcode}
                  </td>
                  <td className="px-6 py-3 font-mono-data text-on-surface-variant">
                    {product.unit.name}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-[16px] text-primary">
                        {product.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-[16px] text-primary">
                        {product.price}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center flex items-center justify-center gap-2">
                    <button
                      className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      data-icon="more_vert"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      data-icon="more_vert"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <!-- Pagination --> */}
          <div className="bg-surface-container-high/50 border-t border-outline-variant px-6 py-3 flex items-center justify-between">
            <span className="text-on-surface-variant text-[11px] font-label-md">
              Showing {(data.meta.page - 1) * data?.meta.limit + 1}-
              {(data.meta.page - 1) * data?.meta.limit + data.data.length} of{" "}
              {data?.meta.total} products
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-surface-container-highest transition-colors rounded disabled:opacity-30">
                <span
                  className="material-symbols-outlined"
                  data-icon="chevron_left"
                >
                  <ChevronLeft size={18} />
                </span>
              </button>
              <div className="flex gap-1 mx-2">
                <button className="w-7 h-7 flex items-center justify-center bg-primary text-primary-foreground text-[11px] font-bold rounded">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center hover:bg-surface-container-highest text-[11px] font-bold rounded">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center hover:bg-surface-container-highest text-[11px] font-bold rounded">
                  3
                </button>
                <span className="flex items-center justify-center w-7 h-7">
                  ...
                </span>
                <button className="w-7 h-7 flex items-center justify-center hover:bg-surface-container-highest text-[11px] font-bold rounded">
                  257
                </button>
              </div>
              <button className="p-1 hover:bg-surface-container-highest transition-colors rounded">
                <span
                  className="material-symbols-outlined"
                  data-icon="chevron_right"
                >
                  <ChevronRight size={18} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
