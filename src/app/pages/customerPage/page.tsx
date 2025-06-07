"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CustomerNavbar from "@/components/ui/customerNavbar";
import axios from "axios";
import { getProductInterrface, productInterrface } from "@/app/types/product.type";

import { OrderButton } from "./components/orderButton";
import { successAlert, errorAlert } from '@/app/utils/alert';

import { Badge } from "@/components/ui/badge";

export default function Home() {
  const router = useRouter();
  
  const [products, setProducts] = useState<getProductInterrface[][]>([])

  const { data, isLoading, error } = useQuery({
    queryKey : ["PROD"],
    queryFn : () => axios.get("http://localhost:5000/product/customerGet")
  })

  useEffect(() => {
    if(data?.data) {
      // Add validation to ensure data.data is an array
      if (Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        console.error("API response is not an array:", data.data);
        setProducts([]);
      }
    }
  }, [data])

  // Add loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <CustomerNavbar />
        <div className="flex justify-center items-center h-64">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <CustomerNavbar />
        <div className="flex justify-center items-center h-64">
          <p>Error loading products. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-auto">
      <CustomerNavbar />
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5 p-5 md:p-3">
        {/* Add safety check before mapping */}
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product[0]?._id}
              className="bg-white rounded-xl shadow-lg p-3 text-sm " 
            >
              <img
                src={product[0]?.image}
                alt={product[0]?.name}
                className="w-full h-[350px] md:h-64 object-cover rounded-md mb-3"
              />
              <h2 className="text-base font-semibold mb-1">{product[0]?.name}</h2>
              <p className="text-gray-600 mb-1">Price: ₱{product[0]?.price} - {product[0]?.price + 50 } </p>
              <div className="flex w-full gap-2 mb-2 ">
                {Array.isArray(product) && product.map((item, index) => (  
                  <Badge key={index} variant={"outline"} className="shadow"> 
                    {item.color} 
                  </Badge>
                ))}
              </div>
              
              <OrderButton product={product} setProduct={setProducts}/>
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-64">
            <p>No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}