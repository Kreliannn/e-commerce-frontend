"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomerNavbar from "@/components/ui/customerNavbar";
import axios from "axios";
import { getProductInterrface, productInterrface } from "@/app/types/product.type";
import Navbar from "@/components/ui/navbar";
import { EditButton } from "./components/editButton";

export default function Home() {
  const router = useRouter();
  
  const [products, setProducts] = useState<getProductInterrface[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["PROD"],
    queryFn: () => axios.get("http://localhost:5000/product/get")
  });

  useEffect(() => {
    if (data?.data) {
      setProducts(data?.data);
    }
  }, [data]);

  // Filter products that have at least one size with stock > 0
  const productsWithStock = products.filter(product =>
    product.xs > 0 ||
    product.s > 0 ||
    product.m > 0 ||
    product.l > 0 ||
    product.xl > 0 ||
    product.xxl > 0 ||
    product.xxxl > 0
  );

  // Filter products based on search term
  const filteredProducts = productsWithStock.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 overflow-auto">
      <Navbar />
      
      {/* Search Bar */}
      <div className="p-4 bg-white shadow-sm">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-5 p-2">
        {filteredProducts.map((product) => (
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
      
      {/* No results message */}
      {filteredProducts.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No products found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}