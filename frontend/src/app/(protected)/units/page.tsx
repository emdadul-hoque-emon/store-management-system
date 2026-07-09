import UnitForm from "@/components/modules/units/UnitForm";
import { Input } from "@/components/ui/input";
import { serverFetch } from "@/lib/serverFetch";
import { Edit, Plus, Trash2, X } from "lucide-react";
import React from "react";

interface Unit {
  id: number;
  name: string;
  shortName: string;
  baseUnit: string;
  conversionFactor: number;
}

const page = async () => {
  const res = await serverFetch.get("/v1/unit");
  const units = await res.json();
  console.log(units);
  return (
    <div className="h-full overflow-auto bg-surface px-4 py-6 md:px-6 lg:px-8">
      {/* <!-- Main Canvas --> */}
      <main className="ml-sidebar-width p-gutter max-w-container-max mx-auto">
        {/* <!-- Header Section --> */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-1">
              Units Management
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Configure and monitor measurement metrics for inventory
              distribution.
            </p>
          </div>
          <UnitForm>
            <button className="bg-secondary-container hover:brightness-110 text-on-secondary-fixed px-6 py-2.5 rounded shadow-sm flex items-center gap-2 transition-all active:scale-95 group">
              <span className="material-symbols-outlined font-bold text-sm">
                <Plus />
              </span>
              <span className="font-label-md text-label-md uppercase tracking-wider">
                Add New Unit
              </span>
            </button>
          </UnitForm>
        </div>
        {/* <!-- Filter and Search Row --> */}
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase mr-2">
              Filters:
            </span>
            <button className="h-6 px-3 bg-primary text-on-primary rounded font-label-md text-[10px] flex items-center gap-1">
              ALL UNITS
              <span className="material-symbols-outlined text-[12px]">
                <X size={12} />
              </span>
            </button>
            <button className="h-6 px-3 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded font-label-md text-[10px] transition-colors">
              ACTIVE
            </button>
            <button className="h-6 px-3 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded font-label-md text-[10px] transition-colors">
              BULK ONLY
            </button>
            <button className="h-6 px-3 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded font-label-md text-[10px] transition-colors">
              LIQUID
            </button>
          </div>
          <div className="flex items-center gap-3">
            <form>
              <Input name="searchTerm" placeholder="Search units..." />
            </form>
          </div>
        </div>
        {/* <!-- Data Grid --> */}
        <div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-16 text-center">
                  ID
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                  Unit Name
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                  Short Code
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-center">
                  Base Unit?
                </th>

                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {units.data.map((unit: Unit, index: number) => (
                <tr className="hover:bg-surface-container transition-colors group">
                  <td className="px-6 py-4 font-mono-data text-mono-data text-on-surface-variant text-center">
                    #{(index + 1).toString().padStart(3, "0")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-body-md text-body-md font-semibold text-primary">
                        {unit.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-surface-container-high border border-outline-variant rounded font-mono-data text-mono-data">
                      {unit.shortName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="material-symbols-outlined text-secondary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {unit.baseUnit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:text-secondary-container transition-colors">
                      <span className="material-symbols-outlined text-lg">
                        <Edit size={14} />
                      </span>
                    </button>
                    <button className="p-1 hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-lg">
                        <Trash2 size={14} />
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <!-- Pagination --> */}
          {/* <div className="bg-surface-container-low px-6 py-4 flex items-center justify-between border-t border-outline-variant">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Showing 1 to 5 of 24 units
            </span>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high disabled:opacity-30">
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded font-label-md text-label-md">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high font-label-md text-label-md">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high font-label-md text-label-md">
                3
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high">
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          </div> */}
        </div>
        {/* <!-- System Stats / Bento Grid --> */}
        {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Active Units
              </span>
              <span className="material-symbols-outlined text-secondary-container">
                trending_up
              </span>
            </div>
            <div className="font-display-lg text-display-lg text-primary mb-2">
              18
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">
              Across 4 main categories
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">
                straighten
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Conversion Rules
              </span>
              <span className="material-symbols-outlined text-secondary-container">
                sync_alt
              </span>
            </div>
            <div className="font-display-lg text-display-lg text-primary mb-2">
              42
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">
              Active automated mapping links
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">
                calculate
              </span>
            </div>
          </div>
          <div className="bg-primary-container p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-surface-lowest font-headline-sm text-headline-sm mb-2">
                Audit Status
              </h3>
              <p className="text-on-primary-container text-body-sm">
                Last validation: Today, 04:30 AM
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1 bg-on-primary-container/20 rounded-full overflow-hidden">
                <div className="h-full bg-secondary-container w-4/5"></div>
              </div>
              <span className="text-secondary-container font-mono-data text-xs">
                80% Accuracy
              </span>
            </div>
          </div>
        </div> */}
      </main>
      {/* <!-- Contextual FAB (Hidden for Task View usually, but good for Industrial UI) --> */}
      {/* <div className="fixed bottom-8 right-8">
        <button className="bg-primary text-secondary-container w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
          <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">
            help
          </span>
        </button>
      </div> */}
      {/* <!-- Quick Entry Drawer (Hidden State) --> */}
      {/* <div
        className="fixed inset-y-0 right-0 w-96 bg-surface-container-lowest shadow-2xl translate-x-full transition-transform duration-300 ease-in-out z-[100] border-l border-outline-variant"
        id="quick-drawer"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline-md text-headline-md text-primary">
              Add Unit
            </h2>
            <button className="p-2 hover:bg-surface-container-high rounded-full">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <form className="space-y-6 flex-1">
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant uppercase mb-2">
                Full Name
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md rounded"
                placeholder="e.g. Metric Ton"
                type="text"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant uppercase mb-2">
                Short Code
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md rounded"
                placeholder="MT"
                type="text"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant uppercase mb-2">
                Category
              </label>
              <select className="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md rounded">
                <option>Mass/Weight</option>
                <option>Volume</option>
                <option>Packaging</option>
                <option>Count</option>
              </select>
            </div>
            <div className="flex items-center gap-3 py-2">
              <div className="relative inline-block w-10 h-6">
                <input
                  className="peer appearance-none w-10 h-6 bg-outline-variant rounded-full checked:bg-secondary-container cursor-pointer transition-colors"
                  type="checkbox"
                />
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 pointer-events-none"></span>
              </div>
              <span className="font-body-md text-body-md text-primary">
                Set as Base Unit
              </span>
            </div>
          </form>
          <div className="flex gap-4 pt-6 border-t border-outline-variant">
            <button className="flex-1 px-4 py-3 border border-outline-variant font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-high transition-colors">
              Cancel
            </button>
            <button className="flex-1 px-4 py-3 bg-secondary-container text-on-secondary-fixed font-label-md text-label-md uppercase tracking-wider hover:brightness-110 transition-all">
              Save Unit
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default page;
