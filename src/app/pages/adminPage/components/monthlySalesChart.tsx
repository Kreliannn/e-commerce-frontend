// components/MonthlySalesChart.tsx
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { TrendingUp } from "lucide-react"
import { getOrderInterface } from "@/app/types/order.types"

interface ChartDataItem {
  month: string
  sales: number
}

interface Props {
    data: getOrderInterface[]
}


const chartConfig: ChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
}

// Types for chart data
interface ChartDataItem {
    month: string;
    sales: number;
  }
  
  interface MonthlyTotals {
    [key: string]: number;
  }



// Function to process sales data and generate monthly totals
const processSalesData = (ordersData: getOrderInterface[]): ChartDataItem[] => {


    const monthlyTotals: MonthlyTotals = {
      "January": 0, "February": 0, "March": 0, "April": 0,
      "May": 0, "June": 0, "July": 0, "August": 0,
      "September": 0, "October": 0, "November": 0, "December": 0
    };
  
    const monthNames: string[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    ordersData.forEach((order: getOrderInterface) => {
      if (order.status === "completed") {
        const date: Date = new Date(order.date);
        const monthIndex: number = date.getMonth();
        const monthName: string = monthNames[monthIndex];
        monthlyTotals[monthName] += order.total_price;
      }
    });
  
    return Object.keys(monthlyTotals).map((month: string): ChartDataItem => ({
      month: month,
      sales: monthlyTotals[month]
    }));
  };

export default function MonthlySalesChart({ data }: Props) {
  const  chartData = processSalesData(data)
  const totalSales = chartData.reduce((sum, month) => sum + month.sales, 0)
  const currentMonth = new Date().getMonth()
  const currentMonthSales = chartData[currentMonth]?.sales || 0
  const previousMonthSales = chartData[currentMonth - 1]?.sales || 0
  const growthPercentage =
    previousMonthSales > 0
      ? ((currentMonthSales - previousMonthSales) / previousMonthSales * 100).toFixed(1)
      : "0.0"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales Report</CardTitle>
        <CardDescription>January - December 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={8} onClick={(data) => alert(data.month)}/>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {growthPercentage !== "0.0" && (
            <>
              Trending {parseFloat(growthPercentage) >= 0 ? 'up' : 'down'} by {Math.abs(parseFloat(growthPercentage))}% this month
              <TrendingUp className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales for the entire year (₱{totalSales.toLocaleString()})
        </div>
      </CardFooter>
    </Card>
  )
}



