import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 space-y-gutter bg-surface p-gutter industrial-grid h-full overflow-auto px-4 pb-6 md:px-6 lg:px-8">
      {children}
    </div>
  );
};

export default layout;
