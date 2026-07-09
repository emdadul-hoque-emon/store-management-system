"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createStore } from "@/services/store/store.services";
import { useActionState, useState } from "react";

const page = () => {
  const [checked, setChecked] = useState(true);
  const [state, formAction, isPending] = useActionState(createStore, null);
  console.log(state);
  return (
    <div className="h-screen overflow-auto bg-primary-container industrial-grid flex items-center justify-center p-gutter py-6">
      <div className="p-gutter max-w-3xl mx-auto w-full h-full">
        <div className="mb-8 text-primary-foreground">
          <p className="font-extrabold text-lg text-on-surface-variant mb-2 text-center">
            Create Store
          </p>
        </div>
        <form action={formAction} className="space-y-6" id="createStoreForm">
          {/* <!-- Section 1: Store Details --> */}
          <div className="bg-background refined-border industrial-shadow rounded-lg overflow-hidden">
            <div className="bg-surface-container px-6 py-3 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-label-md text-label-md uppercase tracking-widest text-primary">
                  Store Details
                </h2>
              </div>
              <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">
                Required Section
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <InputField
                label="Store Name"
                name="store_name"
                placeholder="e.g., Central Distribution HUB-04"
                type="text"
                id="store_name"
              />
              <InputField
                label="Store Email"
                name="store_email"
                placeholder="e.g., 5bEh1@example.com"
                type="email"
                id="store_email"
              />
              <InputField
                label="Store Phone"
                name="store_phone"
                placeholder="+1 (555) 000-0000"
                type="tel"
                id="store_phone"
              />
            </div>
            <div className="p-6 pt-1">
              <Field>
                <FieldLabel htmlFor="store_address">Store Address</FieldLabel>
                <FieldContent>
                  <Textarea
                    name="store_address"
                    id="store_address"
                    placeholder="e.g., 123 Main St, Anytown, USA"
                    className="w-full font-mono-data text-body-md border-outline-variant rounded bg-surface-container-low px-4 py-2.5 transition-all"
                    rows={3}
                  />
                </FieldContent>
              </Field>
            </div>
          </div>
          {/* <!-- Section 2: Administrator Setup --> */}
          <div className="bg-background refined-border industrial-shadow rounded-lg overflow-hidden transition-all duration-300">
            <div className="bg-surface-container px-6 py-3 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-label-md text-label-md uppercase tracking-widest text-primary">
                  Administrator Setup
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 p-4 bg-surface-container-low border border-outline-variant rounded">
                <div className="relative flex items-center">
                  <Checkbox
                    className="w-5 h-5 rounded border-outline text-secondary-container focus:ring-secondary-container transition-all cursor-pointer"
                    id="use_store_info"
                    checked={checked}
                    onCheckedChange={(e) => setChecked(e)}
                    name="use_store_info"
                  />
                </div>
                <label
                  className="font-body-md text-body-md text-on-surface cursor-pointer select-none"
                  htmlFor="use_store_info"
                >
                  Create admin with this info{" "}
                  <span className="text-outline-variant">(Auto-sync)</span>
                </label>
              </div>
              <div
                className={`${checked ? "hidden" : "grid grid-cols-1 md:grid-cols-2"}  gap-x-6 gap-y-5 animate-in fade-in slide-in-from-top-2 duration-300`}
                id="admin_form_container"
              >
                <InputField
                  label="Admin Name"
                  name="name"
                  placeholder="e.g., John Doe"
                  type="text"
                  id="admin_name"
                />
                <InputField
                  label="Admin Email"
                  name="email"
                  placeholder="e.g., john.doe@example.com"
                  type="email"
                  id="email"
                />
                <InputField
                  label="Admin Phone"
                  name="phone"
                  placeholder="e.g., (555) 123-4567"
                  type="tel"
                  id="admin_phone"
                />
                <InputField
                  label="Initial Password"
                  name="password"
                  placeholder="Enter initial password"
                  type="password"
                  id="admin_password"
                />
              </div>
            </div>
          </div>
          {/* <!-- Sticky Footer Actions --> */}
          <div className="flex items-center justify-center gap-4">
            <button
              className="w-full sm:w-auto px-10 py-3 bg-secondary-container text-primary font-label-md text-label-md font-bold uppercase tracking-widest hover:brightness-95 transition-all industrial-shadow active:scale-95 duration-150 flex items-center justify-center gap-2"
              type="submit"
            >
              {isPending ? "CREATING STORE..." : "CREATE STORE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  id,
  name,
  type,
  placeholder,
  className,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  className?: string;
}) => {
  return (
    <Field className={cn("gap-1", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent>
        <Input
          className="rounded-md"
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
        />
      </FieldContent>
    </Field>
  );
};

export default page;
