"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { getOrderInterface } from "@/app/types/order.types";
import { Badge } from "@/components/ui/badge";
import ProductSalesChart from "./components/productSalesChart";



import MonthlySalesChart from "./components/monthlySalesChart";


export default function SalesTable() {
  const [orders, setOrders] = useState<getOrderInterface[]>([]);
  

  const { data }: { data?: { data: getOrderInterface[] } } = useQuery({
    queryKey: ["order"],
    queryFn: (): Promise<{ data: getOrderInterface[] }> => axios.get("http://localhost:5000/orders/get")
  });

  useEffect((): void => {
    if (data?.data) {
      const rawData: getOrderInterface[] = data.data;
      const completedOrders: getOrderInterface[] = rawData.filter((item: getOrderInterface): boolean => item.status === "completed");
      setOrders(completedOrders);
    }
  }, [data]);


    const [toggle, setToggle] = useState(true)

  return (
    <div className="min-h-screen ">
      <Navbar />
      <br />

      <div className="w-[900px] flex gap-10 m-auto ">
          <Button onClick={() =>setToggle(!toggle)}>   {(!toggle) ? "Monthly sales"  : "Product Sales"} </Button>
      </div>

      <br />

      <div className="w-[900px] h-[500px] m-auto ">
        {(toggle) ? <MonthlySalesChart data={orders} /> : <ProductSalesChart />}
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