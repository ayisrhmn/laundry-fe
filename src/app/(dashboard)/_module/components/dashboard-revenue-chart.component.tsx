"use client";

import { RevenueTrendItem, RevenueTrendRange } from "@/@types/module/dashboard/response";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/utils/money";
import { eachDayOfInterval, format, parseISO, startOfMonth, subDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLOR = "#6366f1";

const RANGE_OPTIONS: { label: string; value: RevenueTrendRange }[] = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari", value: "7d" },
  { label: "Bulan Ini", value: "this_month" },
];

/**
 * The API only returns dates that have transactions.
 * This function fills missing dates with revenue: 0
 * so the chart displays all days in the selected range.
 */
function fillRevenueTrendGaps(
  data: RevenueTrendItem[],
  range: RevenueTrendRange,
): RevenueTrendItem[] {
  const today = new Date();

  const rangeStartMap: Record<RevenueTrendRange, Date> = {
    today: today,
    "7d": subDays(today, 6),
    "30d": subDays(today, 29),
    this_month: startOfMonth(today),
  };

  const start = rangeStartMap[range];
  const dateMap = new Map(data.map((d) => [d.date, d.revenue]));

  return eachDayOfInterval({ start, end: today }).map((d) => {
    const dateStr = format(d, "yyyy-MM-dd");
    return { date: dateStr, revenue: dateMap.get(dateStr) ?? 0 };
  });
}

function formatShortMoney(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return String(value);
}

function formatXAxisDate(dateStr: string, range: RevenueTrendRange): string {
  try {
    const pattern = range === "this_month" ? "dd" : "dd MMM";
    return format(parseISO(dateStr), pattern, { locale: localeId });
  } catch {
    return dateStr;
  }
}

function getXAxisInterval(range: RevenueTrendRange): number {
  if (range === "today") return 0;
  if (range === "7d") return 0;
  return 1; // this_month: skip every other day to avoid crowding
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
    // fallback to raw label string
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
  const chartData = fillRevenueTrendGaps(data, range);

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
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLOR} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => formatXAxisDate(d, range)}
                interval={getXAxisInterval(range)}
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLOR}
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 5, fill: CHART_COLOR }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
