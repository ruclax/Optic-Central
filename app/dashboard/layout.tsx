import React, { ReactNode } from "react";
import MenuLayout from "@/components/menu-layout";

export default function PatientsLayout({ children }: { children: ReactNode }) {
  return (
    <MenuLayout>
      <div className="flex-1 flex flex-col w-full min-h-0 p-2 pt-2 bg-background">
        {children}
      </div>
    </MenuLayout>
  );
}
