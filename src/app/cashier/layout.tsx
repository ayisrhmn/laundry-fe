import { nextAuthConfig } from "@/cfgs/auth.cfg";
import CashierLayout from "@/components/layouts/cashier-layout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AppCashierLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(nextAuthConfig);

  if (!session) {
    redirect("/login");
  }

  return <CashierLayout>{children}</CashierLayout>;
}
