"use client";

import { DashboardSummary } from "@/@types/module/dashboard/response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/utils/money";
import { AlertCircle, Clock, DollarSign, ShoppingCart, TrendingUp, Wallet } from "lucide-react";

type KpiCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
};

function KpiCard({ title, value, icon, description }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

function KpiCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
}

type DashboardSummaryCardsProps = {
  data?: DashboardSummary;
  isLoading: boolean;
};

export function DashboardSummaryCards({ data, isLoading }: DashboardSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <KpiCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards: KpiCardProps[] = [
    {
      title: "Pendapatan Hari Ini",
      value: formatMoney(data?.revenueTodayTotal ?? 0),
      icon: <DollarSign className="h-4 w-4" />,
      description: "Dari order PAID hari ini",
    },
    {
      title: "Pendapatan Bulan Ini",
      value: formatMoney(data?.revenueMonthTotal ?? 0),
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Total bulan berjalan",
    },
    {
      title: "Order Hari Ini",
      value: String(data?.orderTodayCount ?? 0),
      icon: <ShoppingCart className="h-4 w-4" />,
      description: "Semua status",
    },
    {
      title: "Order Pending",
      value: String(data?.orderPendingCount ?? 0),
      icon: <Clock className="h-4 w-4" />,
      description: "Menunggu diproses",
    },
    {
      title: "Belum Dibayar",
      value: String(data?.orderUnpaidCount ?? 0),
      icon: <AlertCircle className="h-4 w-4" />,
      description: "Jumlah order unpaid",
    },
    {
      title: "Total Belum Dibayar",
      value: formatMoney(data?.orderUnpaidTotal ?? 0),
      icon: <Wallet className="h-4 w-4" />,
      description: "Nominal unpaid",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
      {cards.map((card) => (
        <KpiCard key={card.title} {...card} />
      ))}
    </div>
  );
}
