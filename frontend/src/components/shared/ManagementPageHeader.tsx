"use client";
import { LucideIcon, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface ManagementPageHeaderProps {
  title: string;
  description?: string;
  actions?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
  }[];
  children?: React.ReactNode;
}

const ManagementPageHeader = ({
  title,
  actions,
  children,
  description,
}: ManagementPageHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex gap-2">
        {actions &&
          actions?.length > 0 &&
          actions.map((action, index) => {
            const Icon = action?.icon || Plus;

            return (
              <Button
                onClick={action.onClick}
                className="rounded-md"
                key={index}
              >
                <Icon className="mr-2 size-4" /> {action.label}
              </Button>
            );
          })}
      </div>

      {children}
    </div>
  );
};

export default ManagementPageHeader;
