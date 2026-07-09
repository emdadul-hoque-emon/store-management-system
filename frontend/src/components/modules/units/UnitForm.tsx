import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const UnitForm = ({ children }: Props) => {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side="right">
        <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">
              Edit Unit
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
          <div className="space-y-2">
            <label
              className="block font-label-md text-on-surface-variant"
              htmlFor="unit-name"
            >
              UNIT NAME
            </label>
            <input
              className="w-full border border-outline px-4 py-3 rounded-lg focus:ring-2 focus:ring-secondary-container focus:border-secondary-container bg-surface-container-lowest text-primary font-body-md"
              id="unit-name"
              type="text"
              value="Heavy Machinery Tier 1"
            />
          </div>
          <div className="space-y-2">
            <label
              className="block font-label-md text-on-surface-variant"
              htmlFor="short-code"
            >
              SHORT CODE
            </label>
            <div className="relative">
              <input
                className="w-full border border-outline pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-secondary-container focus:border-secondary-container bg-surface-container-lowest text-primary font-mono-data"
                id="short-code"
                type="text"
                value="HM-T1-09"
              />
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"
                data-icon="tag"
              >
                tag
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant italic">
              Must be a unique alphanumeric identifier (max 10 chars).
            </p>
          </div>
          <div className="space-y-2">
            <label
              className="block font-label-md text-on-surface-variant"
              htmlFor="status"
            >
              OPERATIONAL STATUS
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none border border-outline px-4 py-3 rounded-lg focus:ring-2 focus:ring-secondary-container focus:border-secondary-container bg-surface-container-lowest text-primary font-body-md"
                id="status"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="decommissioned">Decommissioned</option>
              </select>
              <span
                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                data-icon="expand_more"
              >
                expand_more
              </span>
            </div>
          </div>
          <div className="p-4 bg-surface-container-low rounded border border-outline-variant border-l-4 border-l-secondary-container">
            <h4 className="font-label-md mb-2">LAST INSPECTION</h4>
            <div className="flex justify-between text-body-sm">
              <span className="text-on-surface-variant">Inspection Date:</span>
              <span className="font-medium">Nov 14, 2023</span>
            </div>
            <div className="flex justify-between text-body-sm mt-1">
              <span className="text-on-surface-variant">Technician:</span>
              <span className="font-medium">Robert Chen</span>
            </div>
          </div>
        </div>
        <SheetFooter>
          <div className="flex gap-3">
            <SheetClose className="flex-1 w-full">
              <Button variant="outline" className="rounded-none w-full py-5">
                Cancel
              </Button>
            </SheetClose>
            <Button className="flex-1 w-full rounded-none py-5">
              Save Changes
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UnitForm;
