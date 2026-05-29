"use client";

import { DiscountSummary } from "@/@types/module/dashboard/response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/utils/money";
import { LucideIcon, Tag, Tags, TrendingDown, Zap, ZapOff } from "lucide-react";

type MetricItemProps = {
  label: string;
  value: string;
  icon: LucideIcon;
};

function MetricItem({ label, value, icon: Icon }: MetricItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-bold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

type DashboardDiscountSummaryProps = {
  data?: DiscountSummary;
  isLoading: boolean;
};

export function DashboardDiscountSummary({ data, isLoading }: DashboardDiscountSummaryProps) {
  const metrics: MetricItemProps[] = [
    {
      label: "Total Diskon Diberikan",
      value: formatMoney(data?.totalDiscountAmount ?? 0),
      icon: TrendingDown,
    },
    {
      label: "Order Dapat Diskon",
      value: `${data?.totalOrdersWithDiscount ?? 0} order`,
      icon: Tags,
    },
    {
      label: "Diskon Otomatis (jumlah)",
      value: `${data?.autoDiscountCount ?? 0} order`,
      icon: Zap,
    },
    {
      label: "Diskon Otomatis (nominal)",
      value: formatMoney(data?.autoDiscountAmount ?? 0),
      icon: Zap,
    },
    {
      label: "Diskon Manual (jumlah)",
      value: `${data?.manualDiscountCount ?? 0} order`,
      icon: ZapOff,
    },
    {
      label: "Diskon Manual (nominal)",
      value: formatMoney(data?.manualDiscountAmount ?? 0),
      icon: Tag,
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ringkasan Diskon Bulan Ini</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {metrics.map((m) => (
              <MetricItem key={m.label} {...m} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
