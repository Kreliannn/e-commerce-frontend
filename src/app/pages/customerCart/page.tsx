"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CustomerNavbar from "@/components/ui/customerNavbar";
import axios from "axios";
import { getProductInterrface, productInterrface } from "@/app/types/product.type";

import { successAlert, errorAlert } from '@/app/utils/alert';

import { Badge } from "@/components/ui/badge";

export default function Home() {
  const router = useRouter();
  
  const [products, setProducts] = useState<getProductInterrface[]>([])

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

 

  return (
    <div className="min-h-screen bg-gray-100 overflow-auto">
      <CustomerNavbar />
   
    </div>
  );
}