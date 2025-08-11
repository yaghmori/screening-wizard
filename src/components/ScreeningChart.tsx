/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ScreeningRecord {
  id: number;
  created_at: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  data: any;
}

interface ChartProps {
  records: ScreeningRecord[];
}

export function ScreeningChart({ records }: ChartProps) {
  console.log('ScreeningChart received records:', records);
  
  // Process records to create chart data
  const chartData = React.useMemo(() => {
    console.log('Processing chart data from records:', records);
    const dateCounts: { [key: string]: number } = {};
    
    records.forEach(record => {
      const date = new Date(record.created_at).toISOString().split('T')[0];
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    console.log('Date counts:', dateCounts);

    // Convert to array and sort by date
    const result = Object.entries(dateCounts)
      .map(([date, count]) => ({ date, records: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Show last 30 days
      
    console.log('Final chart data:', result);
    return result;
  }, [records]);

  const total = React.useMemo(
    () => ({
      records: chartData.reduce((acc, curr) => acc + curr.records, 0),
    }),
    [chartData]
  );

  if (chartData.length === 0) {
    return (
      <Card className="py-4 sm:py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
            <CardTitle>Screening Records Over Time</CardTitle>
            <CardDescription>No data available for chart visualization</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-12 text-center text-muted-foreground">
          <div className="text-sm text-gray-500 mb-2">Debug Info:</div>
          <div className="text-xs text-gray-400">
            <p>Records received: {records.length}</p>
            <p>Chart data points: {chartData.length}</p>
            <p>First record date: {records[0]?.created_at || 'None'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Screening Records Over Time</CardTitle>
          <CardDescription>Showing screening records for the last 30 days</CardDescription>
        </div>
        <div className="flex">
          <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">Records</span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {total.records.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="h-[250px] w-full">
          <div className="text-xs text-gray-500 mb-2">Chart Data: {JSON.stringify(chartData.slice(0, 3))}</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value: any) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value: any) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }}
                formatter={(value: any) => [value, "Records"]}
              />
              <Line
                type="monotone"
                dataKey="records"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
