"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CustomerNavbar from "@/components/ui/customerNavbar";
import axios from "axios";
import { getProductInterrface, productInterrface } from "@/app/types/product.type";
import { cartInterface, getCartInterface } from "@/app/types/cart.types";
import { successAlert, errorAlert } from '@/app/utils/alert';
import useUserStore from "@/app/store/userStore";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";


export default function Home() {
  const router = useRouter();
  const { _id } = useUserStore();
  
  const [products, setProducts] = useState<getCartInterface[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: () => axios.get("http://localhost:5000/cart/get")
  });

  useEffect(() => {
    if (data?.data) {
      if (Array.isArray(data.data)) {
        setProducts((data.data as getCartInterface[]).filter((item) => item.customer_id == _id));
      } else {
        console.error("API response is not an array:", data.data);
        setProducts([]);
      }
    }
  }, [data]);

  const handleSelectItem = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, productId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(products.map(product => product.grouped_id || product.product_id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleCheckout = () => {
    const checkedItems = products.filter(product => 
      selectedItems.includes(product.grouped_id || product.product_id)
    );
    console.log("Checked items for checkout:", checkedItems);
  };

  const totalSelectedPrice = products
    .filter(product => selectedItems.includes(product.grouped_id || product.product_id))
    .reduce((sum, product) => sum + product.total_price + product.shippingFee, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <CustomerNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <CustomerNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Error loading cart</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <CustomerNavbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Cart</h1>
          {products.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedItems.length === products.length && products.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All ({products.length})
              </label>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">Your cart is empty</div>
            <Button onClick={() => router.push("/products")}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                   
                    
                    <div className="flex-shrink-0">
                      <img
                        src={product.img}
                        alt={product.product_name}
                        className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{product.product_name}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Size: {product.size}</p>
                        <p>Color: {product.color}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>Price: ₱{product.product_price.toLocaleString()}</p>
                       
                      </div>
                     
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-500">
                        ₱{(product.total_price + product.shippingFee).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total
                      </div>
                    </div>


                    <Checkbox
                      checked={selectedItems.includes(product.grouped_id || product.product_id)}
                      className="w-7 h-7"
                      onCheckedChange={(checked : boolean) => 
                        handleSelectItem(product.grouped_id || product.product_id, checked )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Checkout Bar */}
      {products.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Selected: {selectedItems.length} item(s)
              </span>
              <div className="text-lg font-bold ">
                Total: <span className="text-green-500"> ₱{totalSelectedPrice.toLocaleString()} </span>
              </div>
            </div>
            
            <Button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className="px-8 py-2"
            >
              Checkout ({selectedItems.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}