"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";;
import CustomerNavbar from "@/components/ui/customerNavbar";
import axios from "axios";
import { getProductInterrface, productInterrface } from "@/app/types/product.type";
import Navbar from "@/components/ui/navbar";
import  EditButton  from "./components/editButton";

export default function Home() {
  const router = useRouter();

  const [products, setProducts] = useState<getProductInterrface[]>([])

  const { data } = useQuery({
    queryKey : ["PROD"],
    queryFn : () => axios.get("http://localhost:5000/product/get")
  })

  useEffect(() => {
    if(data?.data)
    {
        setProducts(data?.data)
    }
  }, [data])

  // Filter products that are out of stock for all sizes
  const outOfStockProducts = products.filter(product => 
    product.xs === 0 && 
    product.s === 0 && 
    product.m === 0 && 
    product.l === 0 && 
    product.xl === 0 && 
    product.xxl === 0 && 
    product.xxxl === 0
  );

  return (
    <div className="min-h-screen bg-gray-100 overflow-auto">
        <Navbar />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-5 p-2">
        {outOfStockProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow p-3 text-sm flex flex-col">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-md mb-3"
            />
            <h2 className="text-base font-semibold mb-1">{product.name}</h2>
            <p className="text-gray-600 mb-1">Price: ₱{product.price}</p>

            <div className="mb-3 flex flex-wrap gap-2">
              {["xs", "s", "m", "l", "xl", "xxl", "xxxl"].map((size) => {
                const qty = product[size as keyof typeof product];
                const colorClass = qty === 0 ? "text-red-600" : "text-green-600";
                return (
                  <span
                    key={size}
                    className={`${colorClass} font-medium border px-2 py-0.5 rounded`}
                  >
                    {size.toUpperCase()} : {qty}
                  </span>
                );
              })}
            </div>

            <EditButton setProduct={setProducts} product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}