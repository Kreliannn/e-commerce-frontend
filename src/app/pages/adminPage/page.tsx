"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { getOrderInterface } from "@/app/types/order.types";
import { useMutation } from "@tanstack/react-query";
import useUserStore from "@/app/store/userStore";
import CustomerNavbar from "@/components/ui/customerNavbar";
import { Badge } from "@/components/ui/badge";

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

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

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

export default function SalesTable() {
  const [orders, setOrders] = useState<getOrderInterface[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([
    { month: "January", sales: 0 },
    { month: "February", sales: 0 },
    { month: "March", sales: 0 },
    { month: "April", sales: 0 },
    { month: "May", sales: 0 },
    { month: "June", sales: 0 },
    { month: "July", sales: 0 },
    { month: "August", sales: 0 },
    { month: "September", sales: 0 },
    { month: "October", sales: 0 },
    { month: "November", sales: 0 },
    { month: "December", sales: 0 },
  ]);

  const { data }: { data?: { data: getOrderInterface[] } } = useQuery({
    queryKey: ["order"],
    queryFn: (): Promise<{ data: getOrderInterface[] }> => axios.get("http://localhost:5000/orders/get")
  });

  useEffect((): void => {
    if (data?.data) {
      const rawData: getOrderInterface[] = data.data;
      const completedOrders: getOrderInterface[] = rawData.filter((item: getOrderInterface): boolean => item.status === "completed");
      setOrders(completedOrders);
      
      // Generate chart data from all orders (not just completed ones for the chart)
      const processedChartData: ChartDataItem[] = processSalesData(rawData);
      setChartData(processedChartData);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (data: getOrderInterface): Promise<{ data: getOrderInterface[] }> => 
      axios.patch("http://localhost:5000/order/update", { order: data }),
    onSuccess: (response: { data: getOrderInterface[] }): void => {
      const completedOrders: getOrderInterface[] = response.data.filter((item: getOrderInterface): boolean => item.status === "completed");
      setOrders(completedOrders);
      
      // Update chart data after mutation
      const processedChartData: ChartDataItem[] = processSalesData(response.data);
      setChartData(processedChartData);
    },
    onError: (err: { request: { response: string } }): void => alert(err.request.response)
  });

  // Calculate total sales and growth
  const totalSales: number = chartData.reduce((sum: number, month: ChartDataItem): number => sum + month.sales, 0);
  const currentMonth: number = new Date().getMonth();
  const currentMonthSales: number = chartData[currentMonth]?.sales || 0;
  const previousMonthSales: number = chartData[currentMonth - 1]?.sales || 0;
  const growthPercentage: string = previousMonthSales > 0 
    ? ((currentMonthSales - previousMonthSales) / previousMonthSales * 100).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen ">
      <Navbar />
      <br />
      <div className="w-[900px] h-[500px] m-auto ">
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
      </div>

      <br /><br /><br /> <br /><br /> <br /><br />

      <div className="m-auto w-[900px] shadow-lg">
        <Table className="bg-white shadow-lg rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.customer_name}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>₱{item.product_price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>₱{item.total_price.toLocaleString()}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  {item.status === "pending" && <Badge className="bg-yellow-400 text-white">Pending</Badge>}
                  {item.status === "processing" && <Badge className="bg-blue-400 text-white">Processing</Badge>}
                  {item.status === "to ship" && <Badge className="bg-orange-400 text-white">To Ship</Badge>}
                  {item.status === "completed" && <Badge className="bg-green-400 text-white">Completed</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <br /><br /><br /><br />
    </div>
  );
}