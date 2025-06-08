"use client";

import { useState, useEffect } from "react";
import { Mutation, useQuery } from "@tanstack/react-query";
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
import { getShippingFee } from "@/app/utils/customFunction";
import { useMutation } from "@tanstack/react-query";
import { confirmAlert } from "@/app/utils/alert";

export default function Home() {
  const router = useRouter();
  const { _id } = useUserStore();
  
  const [products, setProducts] = useState<getCartInterface[]>([]);
  const [selectedItems, setSelectedItems] = useState<getCartInterface[]>([]);

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


  const orderMutation = useMutation({
    mutationFn : (data : getCartInterface[]) => axios.post("http://localhost:5000/cart/createOrders", { orders :  data}),
    onSuccess : (response : { data : getCartInterface[]} ) => {
      setProducts(response.data.filter((item) => item.customer_id == _id))
      successAlert("Order Placed")
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  })


  const handleSelectItem = (product: getCartInterface, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, product]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== product));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(products);
    } else {
      setSelectedItems([]);
    }
  };

  // Calculate total quantity of selected items
  const totalSelectedQuantity = () => {
    let quantity = 0
    selectedItems.forEach((item) => {
        quantity += item.quantity
    })
    return quantity
  }

  // Calculate total shipping fee based on total quantity
  const totalShippingFee = getShippingFee(totalSelectedQuantity());

  // Calculate total price of selected items (without shipping)
  const totalProductPrice = () => {
    let price = 0
    selectedItems.forEach((item) => {
        price += item.total_price
    })
    return price
  }
  // Calculate final total (product price + shipping fee)  
  const totalSelectedPrice = totalProductPrice() + totalShippingFee;

  const handleCheckout = async () => {

    if(selectedItems.length == 0) return errorAlert("select item first")

    confirmAlert(`check out ${totalSelectedQuantity()} items for ₱${totalSelectedPrice}`, "Check Out", () => {
        const checkedItems = selectedItems;
    
        // Calculate shipping fee per item (total shipping fee divided by number of selected items)
        const shippingFeePerItem =  totalShippingFee / selectedItems.length ;
        
        // Update each selected item's shipping fee and total price
        const updatedItems = checkedItems.map(item => ({
          ...item,
          shippingFee: shippingFeePerItem,
          total_price: item.total_price + shippingFeePerItem
        }));
        
        orderMutation.mutate(updatedItems)
    })
        
   
   
  };

 

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
            <Button onClick={() => router.push("/pages/customerPage")}>
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
                        ₱{product.total_price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Product Total
                      </div>
                    </div>


                    <Checkbox
                      checked={selectedItems.map(i => i._id).includes(product._id)}
                      className="w-7 h-7"
                      onCheckedChange={(checked : boolean) => 
                      {
                        handleSelectItem(product, checked )
                        console.log("selected")
                        console.log(product)
                      }
                       
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
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            
            {/* Info Group */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 w-full sm:w-auto">
            <div className="text-lg font-bold">
                Price: <span className="text-green-800">₱{totalProductPrice()}</span>
            </div>
            <div className="text-lg font-bold">
                Quantity: <span className="text-green-800">{totalSelectedQuantity()}</span>
            </div>
            <div className="text-lg font-bold">
                Shipping Fee: <span className="text-green-800">₱{totalShippingFee.toLocaleString()}</span>
            </div>
            <div className="text-lg font-bold">
                Total: <span className="text-green-500">₱{totalSelectedPrice}</span>
            </div>
            </div>

            {/* Checkout Button */}
            <div className="w-full sm:w-auto">
            <Button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full sm:w-auto px-8 py-2"
            >
                Checkout ({selectedItems.length})
            </Button>
            </div>
        </div>
        </div>

      )}
    </div>
  );
}