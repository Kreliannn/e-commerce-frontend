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

export default function SalesTable() {

    const { _id } = useUserStore()

    
  const [orders, setorders] = useState<getOrderInterface[]>([])

  const { data } = useQuery({
    queryKey : ["order"],
    queryFn : () => axios.get("http://localhost:5000/orders/get")
  })

  useEffect(() => {
    if(data?.data)
    {
      const rawData : getOrderInterface[] = data?.data
      setorders(rawData.filter(( item : getOrderInterface) => item.customer_id == _id) )
    }
  }, [data])

  const mutation = useMutation({
    mutationFn : (data : getOrderInterface) => axios.patch("http://localhost:5000/order/update", { order :  data}),
    onSuccess : (response : { data : getOrderInterface[]} ) => {
      
        setorders(response.data.filter(( item : getOrderInterface) => item.customer_id == _id))
    },
    onError : (err : { request : { response : string}}) => alert(err.request.response)
  })


  return (
    <div className="min-h-screen bg-gray-100">
      <CustomerNavbar />

      {/* Page Content */}
      <div className="">
      <div className="p-4">
      <Table className="bg-white shadow-lg rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>color</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
      
            <TableHead>Status</TableHead>
            <TableHead> Accept  </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.customer_name}</TableCell>
            
              <TableCell>{item.product_name}</TableCell>
              <TableCell>{item.color}</TableCell>
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
              <TableCell>
                  <Button onClick={() => mutation.mutate(item)} disabled={item.status != "to ship"}>
                      Received
                  </Button>
              </TableCell>
           
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
      </div>
    </div>
    
  );
}
