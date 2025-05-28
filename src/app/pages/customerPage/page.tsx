"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CustomerNavbar from "@/components/ui/customerNavbar";
import axios from "axios";
import { getProductInterrface, productInterrface } from "@/app/types/product.type";

import { OrderButton } from "./components/orderButton";




export default function Home() {
  const router = useRouter();

  const getAvailableSizes = (product: any) => {
    const sizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];
    return sizes.filter((size) => product[size] > 0);
  };


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

  return (
    <div className="min-h-screen bg-gray-100 ">
      <CustomerNavbar />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5 p-2">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow p-3 text-sm"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-md mb-3" // taller image
            />
            <h2 className="text-base font-semibold mb-1">{product.name}</h2>
            <p className="text-gray-600 mb-1">Price: ₱{product.price}</p>
            <p className="text-gray-500 mb-3">
              Sizes:{" "}
              {getAvailableSizes(product)
                .map((size) => size.toUpperCase())
                .join(", ")}
            </p>
            <OrderButton product={product} />
          </div>
        ))}
      </div>

    </div>
  );
}
