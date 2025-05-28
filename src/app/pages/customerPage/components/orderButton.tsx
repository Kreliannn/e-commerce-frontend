"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { getProductInterrface } from "@/app/types/product.type"
import userStore from "@/app/store/userStore"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { orderInterface } from "@/app/types/order.types"
import { successAlert, errorAlert } from '@/app/utils/alert';
export function OrderButton({ product }: { product: getProductInterrface }) {
  const [open, setOpen] = useState(false)

  const { _id, fullname, address } = userStore()
  const price = product.price
  const date = new Date().toISOString().split('T')[0];
  const status = 'pending'
  const product_id = product._id

 

  // Initialize selected size with first non-zero size or empty string
  const initialSize =
    product.xs > 0 ? "xs" :
    product.s > 0 ? "s" :
    product.m > 0 ? "m" :
    product.l > 0 ? "l" :
    product.xl > 0 ? "xl" :
    product.xxl > 0 ? "xxl" :
    product.xxxl > 0 ? "xxxl" :
    ""

  const [selectedSize, setSelectedSize] = useState(initialSize)
  const [quantity, setQuantity] = useState(1)
  const [paymentMode, setPaymentMode] = useState("COD")

  
  const mutation = useMutation({
    mutationFn : (data : orderInterface) => axios.post("http://localhost:5000/order/create", { order :  data}),
    onSuccess : (response : { data : string} ) => {
        successAlert(response.data)
        setOpen(false)
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  })



  const handleOrder = () => {
    const productPrice = product.price; // number
    const totalPrice = productPrice * quantity;
  
    const orderObj = {
      customer_id: _id || "",              // from userStore
      customer_name: fullname || "",       // from userStore
      customer_address: address || "",     // from userStore
      product_name: product.name || "",
      size: selectedSize || "",
      product_price: productPrice.toString(),  // schema expects String
      total_price: totalPrice,              // Number
      quantity: quantity,                   // Number
      status: status,                      // 'pending'
      date: date,                         // YYYY-MM-DD string
      modeOfPayment: paymentMode, 
      product_id : product_id,        // 'COD' or 'GCASH'
    };
  
    mutation.mutate(orderObj)
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" onClick={() => setOpen(true)}>
          Order
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Product</DialogTitle>
          <DialogDescription>Be careful on what you input.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mb-6">
          {/* Product Name and Price */}
          <div>
            <Label className="text-base font-semibold">
              {product.name} - ₱{product.price}
            </Label>
          </div>

          {/* Size Select */}
          <div>
            <Label htmlFor="size-select" className="mb-1">
              Size
            </Label>
            <Select  value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {product.xs > 0 && <SelectItem value="xs">XS</SelectItem>}
                {product.s > 0 && <SelectItem value="s">S</SelectItem>}
                {product.m > 0 && <SelectItem value="m">M</SelectItem>}
                {product.l > 0 && <SelectItem value="l">L</SelectItem>}
                {product.xl > 0 && <SelectItem value="xl">XL</SelectItem>}
                {product.xxl > 0 && <SelectItem value="xxl">XXL</SelectItem>}
                {product.xxxl > 0 && <SelectItem value="xxxl">XXXL</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Input */}
          <div>
            <Label htmlFor="quantity-input" className="mb-1">
              Quantity
            </Label>
            <Input
              id="quantity-input"
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
            />
          </div>

          {/* Mode of Payment Select */}
          <div>
            <Label htmlFor="payment-mode-select" className="mb-1">
              Mode of Payment
            </Label>
            <Select  value={paymentMode} onValueChange={setPaymentMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">COD</SelectItem>
                <SelectItem value="GCASH">GCASH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleOrder}>Order Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
