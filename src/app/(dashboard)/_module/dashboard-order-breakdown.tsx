"use client";

import { OrderBreakdown } from "@/@types/module/dashboard/response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const ORDER_STATUS_COLORS = {
  Pending: "#f59e0b",
  Selesai: "#22c55e",
};

const PAYMENT_STATUS_COLORS = {
  Belum: "#ef4444",
  Lunas: "#22c55e",
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
};

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-background border rounded-lg p-2 shadow-md text-sm">
      <span className="font-medium">{item.name}: </span>
      <span className="font-bold">{item.value}</span>
    </div>
  );
}

type DonutChartProps = {
  title: string;
  data: { name: string; value: number; color: string }[];
};

function DonutChart({ title, data }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-semibold text-center">{title}</p>
      <div className="relative w-full h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={68}
              dataKey="value"
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-lg font-bold">{total}</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1 text-xs">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type DashboardOrderBreakdownProps = {
  data?: OrderBreakdown;
  isLoading: boolean;
};

export function DashboardOrderBreakdown({ data, isLoading }: DashboardOrderBreakdownProps) {
  const orderStatusData = [
    { name: "Pending", value: data?.orderStatus.pending ?? 0, color: ORDER_STATUS_COLORS.Pending },
    { name: "Selesai", value: data?.orderStatus.done ?? 0, color: ORDER_STATUS_COLORS.Selesai },
  ];

  const paymentStatusData = [
    {
      name: "Belum",
      value: data?.paymentStatus.unpaid ?? 0,
      color: PAYMENT_STATUS_COLORS.Belum,
    },
    { name: "Lunas", value: data?.paymentStatus.paid ?? 0, color: PAYMENT_STATUS_COLORS.Lunas },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Status Order</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-55 w-full" />
            <Skeleton className="h-55 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <DonutChart title="Status Pengerjaan" data={orderStatusData} />
            <DonutChart title="Status Pembayaran" data={paymentStatusData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
