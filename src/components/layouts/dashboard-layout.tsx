"use client";

import { AppSidebar } from "@/components/base/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MonitorCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppBreadcrumb } from "../base/app-breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <AppBreadcrumb />
            </div>
          </header>
          <main className="px-6 pb-6 pt-2">{children}</main>
        </SidebarInset>
      </SidebarProvider>

      {/* Floating Mode Kasir Button */}
      {userRole === "ADMIN" && (
        <Link
          href="/cashier"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-linear-to-br from-amber-400 via-orange-400 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(251,146,60,0.45)] ring-2 ring-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(251,146,60,0.6)] active:scale-95"
        >
          <MonitorCheck className="h-4 w-4 drop-shadow" />
          Mode Kasir
        </Link>
      )}
    </>
  );
}
