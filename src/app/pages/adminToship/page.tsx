"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { getOrderInterface } from "@/app/types/order.types";
import { useMutation } from "@tanstack/react-query";


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
        setorders(rawData.filter(( item : getOrderInterface) => item.status == "processing") )

    }
  }, [data])


  const mutation = useMutation({
    mutationFn : (data : getOrderInterface) => axios.patch("http://localhost:5000/order/update", { order :  data}),
    onSuccess : (response : { data : getOrderInterface[]} ) => {
        console.log("updated")
        setorders(response.data.filter(( item : getOrderInterface) => item.status == "processing"))
    },
    onError : (err : { request : { response : string}}) => alert(err.request.response)
  })



  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Page Content */}
      <div className="">
      <div className="p-4">
      <Table className="bg-white shadow-lg rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="w-[500px]">Address</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Shipping</TableHead>
            <TableHead>Total</TableHead>
            <TableHead> Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead> To Ship </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.customer_name}</TableCell>
              <TableCell className="text-xs font-bold">{item.customer_address}</TableCell>
              <TableCell>{item.product_name}</TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell>{item.size}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>₱{item.shippingFee}</TableCell>
              <TableCell>₱{item.total_price}</TableCell>
              <TableCell>{item.modeOfPayment}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                  <Button onClick={() => mutation.mutate(item)}>
                      To Ship
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

