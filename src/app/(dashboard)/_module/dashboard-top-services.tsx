"use client";

import { TopServiceItem } from "@/@types/module/dashboard/response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/utils/money";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload?: TopServiceItem }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload as TopServiceItem;
  return (
    <div className="bg-background border rounded-lg p-3 shadow-md text-sm space-y-1">
      <p className="font-semibold">{label}</p>
      <p>
        Pesanan: <span className="font-bold">{item.orderCount}</span>
      </p>
      <p>
        Pendapatan: <span className="font-bold">{formatMoney(item.totalRevenue)}</span>
      </p>
    </div>
  );
}

function formatShortMoney(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return String(value);
}

type DashboardTopServicesProps = {
  data: TopServiceItem[];
  isLoading: boolean;
};

export function DashboardTopServices({ data, isLoading }: DashboardTopServicesProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Layanan Terlaris</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full h-65" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                tickFormatter={formatShortMoney}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="serviceName"
                width={90}
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="totalRevenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
