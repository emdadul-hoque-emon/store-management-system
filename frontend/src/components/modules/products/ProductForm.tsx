"use client";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types/product";
import React from "react";

type Props = {
  product?: IProduct;
  onClose?: () => void;
  onSuccess?: () => void;
};

const ProductForm = ({ product, onClose, onSuccess }: Props) => {
  const isEditMode = !!product;
  return (
    <form>
      <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary">
            Edit Product
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mt-1">
            ID: PRD-992-KLA
          </p>
        </div>
      </div>
      {/* <!-- Form Content --> */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
        {/* <!-- Section: Primary Info --> */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                PRODUCT NAME
              </label>
              <input
                className="bg-surface border border-outline-variant rounded-none px-4 py-3 font-body-md text-body-md focus:ring-0"
                type="text"
                value="Industrial Grade Sealant"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                SKU CODE
              </label>
              <input
                className="bg-surface border border-outline-variant rounded-none px-4 py-3 font-mono-data text-mono-data focus:ring-0"
                type="text"
                value="CHM-SL-99"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                CATEGORY
              </label>
              <div className="relative">
                <select className="w-full bg-surface border border-outline-variant rounded-none px-4 py-3 font-body-md text-body-md appearance-none focus:ring-0">
                  <option>Chemicals</option>
                  <option>Machinery</option>
                  <option>Structural</option>
                  <option>Safety Gear</option>
                </select>
                <span
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                  data-icon="expand_more"
                >
                  expand_more
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                UNIT
              </label>
              <div className="relative">
                <select className="w-full bg-surface border border-outline-variant rounded-none px-4 py-3 font-body-md text-body-md appearance-none focus:ring-0">
                  <option>Litres (L)</option>
                  <option>Kilograms (kg)</option>
                  <option>Units (ea)</option>
                  <option>Metres (m)</option>
                </select>
                <span
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                  data-icon="expand_more"
                >
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Divider --> */}
        <div className="h-px bg-outline-variant w-full"></div>
        {/* <!-- Section: Inventory & Pricing --> */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                BASE PRICE (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-mono-data">
                  $
                </span>
                <input
                  className="w-full bg-surface border border-outline-variant rounded-none pl-8 pr-4 py-3 font-mono-data text-mono-data focus:ring-0"
                  step="0.01"
                  type="number"
                  value="85.50"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                CURRENT STOCK
              </label>
              <input
                className="bg-surface border border-outline-variant rounded-none px-4 py-3 font-mono-data text-mono-data focus:ring-0"
                type="number"
                value="4"
              />
            </div>
          </div>
        </div>
        {/* <!-- Descriptive Photo Placeholder --> */}
        {/* <div className="space-y-3">
            <label className="font-label-md text-label-md text-on-surface-variant">
              PRODUCT VISUAL
            </label>
            <div className="relative h-48 w-full border border-outline-variant group cursor-pointer overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                data-alt="A macro professional photograph of industrial grade sealant canisters stacked neatly in a clean warehouse environment. The lighting is crisp and cool-toned, with high contrast shadows. The canisters are labeled with minimal technical text. The background is a soft-focus industrial setting with steel shelving and concrete floors."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7PVrIDOS3GHDSzKtK9O7ks758EwoPfYmOY0mR7wp2xM31v1XIo4rQrLr_AKrTuM9ZNpoo89G3OoKwvONjSFRBTy4h31anmlAgH92OVN5EztEKUryavxKBMj31u_-b0aVRiqjwdyYIv8pe5SKCP57TufR40x6tsinJafBYW_zutNNLmNzXZCPIATMScRNeMWIJ5RrJpo6GQJRgnEkLFuW7vU3pFhq6isw0Oa8Nalai2JuC_2885pY0T7GLeIpJbDD-ClZJwSEYIJA')",
                }}
              ></div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <span
                    className="material-symbols-outlined text-primary"
                    data-icon="photo_camera"
                  >
                    photo_camera
                  </span>
                  <span className="font-label-md text-label-md text-primary">
                    REPLACE IMAGE
                  </span>
                </div>
              </div>
            </div>
          </div> */}
      </div>
      {/* <!-- Footer Actions --> */}
      <div className="flex gap-3">
        <Button
          onClick={() => onClose?.()}
          variant="outline"
          className="rounded-none w-full py-5"
        >
          Cancel
        </Button>
        <Button className="flex-1 w-full rounded-none py-5">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
