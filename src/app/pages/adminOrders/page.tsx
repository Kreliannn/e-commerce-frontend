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
      setorders(rawData.filter(( item : getOrderInterface) => item.status == "pending") )
    }
  }, [data])

  const mutation = useMutation({
    mutationFn : (data : getOrderInterface) => axios.patch("http://localhost:5000/order/update", { order :  data}),
    onSuccess : (response : { data : getOrderInterface[]} ) => {
      
        setorders(response.data.filter(( item : getOrderInterface) => item.status == "pending"))
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
        
            <TableHead>Product</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Shiping</TableHead>
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
              <TableCell>₱{item.product_price}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>₱{item.shippingFee.toFixed(2)}</TableCell>
              <TableCell>₱{item.total_price.toFixed(2)}</TableCell>
              <TableCell>{item.date}</TableCell>
  
              <TableCell>{item.status}</TableCell>
              <TableCell>
                  <Button onClick={() => mutation.mutate(item)}>
                      Accept
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
