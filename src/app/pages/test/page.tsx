"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

const chartData = [
  { month: "January", sales: 15000 },
  { month: "February", sales: 18500 },
  { month: "March", sales: 22000 },
  { month: "April", sales: 19500 },
  { month: "May", sales: 25000 },
  { month: "June", sales: 28000 },
  { month: "July", sales: 32000 },
  { month: "August", sales: 29500 },
  { month: "September", sales: 26000 },
  { month: "October", sales: 31000 },
  { month: "November", sales: 35000 },
  { month: "December", sales: 42000 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function Component() {
  return (
    <div className="w-[900px] h-[500px]">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Report</CardTitle>
          <CardDescription>January - December 2024</CardDescription>
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
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 12.8% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total sales for the entire year
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}