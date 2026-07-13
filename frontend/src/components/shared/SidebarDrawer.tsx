import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { IUser } from "@/types/user";

type Props = {
  session: IUser;
};

const SidebarDrawer = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger className="print:hidden">
        <span className="sr-only">Toggle Sidebar</span>
        <Menu className="h-5 w-5 text-primary" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar session={props.session} />
      </SheetContent>
    </Sheet>
  );
};

export default SidebarDrawer;
