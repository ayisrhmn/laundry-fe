"use client";

import { AppAvatar } from "@/components/base/app-avatar";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Sparkles } from "lucide-react";
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
      {/* Improved Sticky Top bar with backdrop blur */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card/85 backdrop-blur-md px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500 animate-pulse shrink-0" />
          <span className="text-sm font-extrabold tracking-widest uppercase bg-linear-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Nami Laundry
          </span>
        </div>

        {/* User info + logout dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-muted/60 transition-colors focus:outline-none cursor-pointer">
              <div className="hidden min-[400px]:flex flex-col text-right">
                <p className="text-xs font-bold text-foreground leading-none">
                  {session?.user?.fullName}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {session?.user?.username}
                </p>
              </div>
              {session?.user?.fullName && (
                <AppAvatar
                  name={session.user.fullName}
                  className="h-8 w-8 ring-2 ring-amber-500/20 shrink-0"
                />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 mt-1">
            <DropdownMenuItem
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
