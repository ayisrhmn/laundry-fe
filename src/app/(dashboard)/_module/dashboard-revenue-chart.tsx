"use client";

import { RevenueTrendItem, RevenueTrendRange } from "@/@types/module/dashboard/response";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/utils/money";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RANGE_OPTIONS: { label: string; value: RevenueTrendRange }[] = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
  { label: "Bulan Ini", value: "this_month" },
];

function formatShortMoney(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return String(value);
}

function formatXAxisDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "dd MMM", { locale: localeId });
  } catch {
    return dateStr;
  }
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const revenue = payload[0]?.value ?? 0;

  let formattedLabel = label ?? "";
  try {
    if (label) {
      formattedLabel = format(parseISO(label), "EEEE, dd MMMM yyyy", { locale: localeId });
    }
  } catch {
    // fallback to raw label
  }

  return (
    <div className="bg-background border rounded-lg p-3 shadow-md text-sm">
      <p className="font-medium mb-1">{formattedLabel}</p>
      <p className="text-primary font-bold">{formatMoney(revenue)}</p>
    </div>
  );
}

type DashboardRevenueChartProps = {
  data: RevenueTrendItem[];
  isLoading: boolean;
  range: RevenueTrendRange;
  onRangeChange: (range: RevenueTrendRange) => void;
};

export function DashboardRevenueChart({
  data,
  isLoading,
  range,
  onRangeChange,
}: DashboardRevenueChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Tren Pendapatan</CardTitle>
        <div className="flex gap-1">
          {RANGE_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={range === opt.value ? "default" : "outline"}
              onClick={() => onRangeChange(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full h-75" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisDate}
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatShortMoney}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
