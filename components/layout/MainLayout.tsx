"use client";

import { usePathname } from "next/navigation";
import SideBar from "@/components/layout/SideBar";
import { NotificationBell } from "@/components/layout/NotificationBell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/sign-in";

  if (isAuthPage) {
    return <main className="w-full h-screen">{children}</main>;
  }

  return (
    <div className="w-full h-full flex justify-start items-start">
      <SideBar />
      <div className="w-full h-svh bg-background p-10 relative overflow-y-auto">
        <NotificationBell />
        {children}
      </div>
    </div>
  );
}
