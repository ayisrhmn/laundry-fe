"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LayoutDashboard, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

interface CashierLayoutProps {
  children: React.ReactNode;
}

export default function CashierLayout({ children }: CashierLayoutProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login", redirect: true });
      localStorage.clear();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saat logout",
        description: typeof error === "string" ? error : "An error occurred",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
        <span className="text-sm font-semibold tracking-widest uppercase text-amber-500">
          Nami Laundry
        </span>

        {/* User info + logout */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground leading-none">
              {session?.user?.fullName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{session?.user?.username}</p>
          </div>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut />
            Keluar
          </Button>
        </div>
      </header>

      {/* Page content */}
      <main className="p-6">{children}</main>

      {/* Floating Mode Admin Button */}
      {userRole === "ADMIN" && (
        <Link
          href="/"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-linear-to-br from-violet-500 via-indigo-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(99,102,241,0.45)] ring-2 ring-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(99,102,241,0.6)] active:scale-95"
        >
          <LayoutDashboard className="h-4 w-4 drop-shadow" />
          Mode Admin
        </Link>
      )}
    </div>
  );
}
