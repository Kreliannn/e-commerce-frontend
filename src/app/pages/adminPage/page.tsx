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


export default function SalesTable() {


  const [orders, setorders] = useState<getOrderInterface[]>([])

  const { data } = useQuery({
    queryKey : ["order"],
    queryFn : () => axios.get("http://localhost:5000/orders/get")
  })

  useEffect(() => {
    if(data?.data)
    {
      const rawData : getOrderInterface[] = data?.data
      setorders(rawData.filter(( item : getOrderInterface) => item.status == "completed") )
    }
  }, [data])

  const mutation = useMutation({
    mutationFn : (data : getOrderInterface) => axios.patch("http://localhost:5000/order/update", { order :  data}),
    onSuccess : (response : { data : getOrderInterface[]} ) => {
      
        setorders(response.data.filter(( item : getOrderInterface) => item.status == "completed"))
    },
    onError : (err : { request : { response : string}}) => alert(err.request.response)
  })



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
              
              <div className="leading-none text-muted-foreground">
                Showing total sales for the entire year
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
              <TableCell>{item.product_price}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.total_price}</TableCell>
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

