"use client";
import { IUser } from "@/types/user";
import {
  LayoutDashboard,
  Package2,
  ReceiptText,
  Tags,
  UserRoundCog,
  Users,
  Warehouse,
  Ruler,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Products", icon: Package2, href: "/products" },
  { label: "Units", icon: Ruler, href: "/units" },
  { label: "Categories", icon: Tags, href: "/categories" },
  { label: "Customers", icon: Users, href: "/customers" },
  { label: "Invoices", icon: ReceiptText, active: true, href: "/invoices" },
  { label: "Users", icon: UserRoundCog, href: "/users" },
];

const Sidebar = ({ session }: { session: IUser }) => {
  const pathname = usePathname();
  return (
    <aside className="hidden w-65 h-full flex-col border-r border-outline-variant bg-primary-container text-on-primary-container lg:flex">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 text-surface-bright">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-fixed shadow-sm">
            <Warehouse className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-surface-bright">
              {session.store.name}
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                pathname.split("/")[1] === item.href.split("/")[1]
                  ? "flex items-center gap-3 rounded-md border-l-4 border-secondary-container bg-tertiary-container px-4 py-3 text-surface-bright"
                  : "flex items-center gap-3 rounded-md px-4 py-3 transition-colors hover:bg-tertiary-container hover:text-surface-bright"
              }
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-outline-variant/20 p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary-container font-semibold text-on-secondary-fixed">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-surface-bright">
              {session.name}
            </span>
            <span className="text-xs text-on-primary-container">
              {session.role.toLocaleUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
