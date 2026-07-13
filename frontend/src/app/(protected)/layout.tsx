import React from "react";
import Sidebar from "@/components/shared/Sidebar";
import { Bell, ReceiptText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/session";
import { redirect } from "next/navigation";
import SidebarDrawer from "@/components/shared/SidebarDrawer";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <main className="h-screen bg-primary-container text-foreground">
      <div className="flex h-full">
        <aside className="hidden w-65 h-full flex-col border-r border-outline-variant lg:flex">
          <Sidebar session={session} />
        </aside>

        <div className="flex min-w-0 h-full flex-1 flex-col">
          <header className="print:hidden sticky top-0 z-40 border-b border-outline-variant backdrop-blur ">
            <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <div className="block lg:hidden">
                  <SidebarDrawer session={session} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-primary">
                    Invoice Management
                  </h2>
                  <p className="hidden text-sm text-on-primary-container md:block">
                    High-density operations workspace
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-primary-container" />
                  <Input className="w-72 pl-9" placeholder="Global search..." />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-outline-variant"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
          {children}
        </div>
      </div>
    </main>
  );
};

export default layout;
