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
import { useEffect, useState } from "react"
import { getProductInterrface, productInterrface } from "@/app/types/product.type"
import userStore from "@/app/store/userStore"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { orderInterface } from "@/app/types/order.types"
import { successAlert, errorAlert } from '@/app/utils/alert';
import Image from "next/image"
import { CarouselImage } from "./carousel"
import { confirmAlert } from "@/app/utils/alert"
import { addFeeBasedOnSize } from "@/app/utils/customFunction"
import { getShippingFee } from "@/app/utils/customFunction"
import { checkIFOutOFStock } from "@/app/utils/customFunction"


export function OrderButton({ product, setProduct }: { product: getProductInterrface[], setProduct: React.Dispatch<React.SetStateAction<getProductInterrface[][]>> }) {
  const [open, setOpen] = useState(false)

  const [index, setIndex] = useState(0) 

  const images = product.map((item) => {
    return item.image
  })

  const { _id, fullname, address } = userStore()
  const price = product[index].price
  const date = new Date().toISOString().split('T')[0];
  const status = 'pending'
  const product_id = product[index]._id

  // Initialize selected size with first non-zero size or empty string
  const initialSize =
    product[index].xs > 0 ? "xs" :
    product[index].s > 0 ? "s" :
    product[index].m > 0 ? "m" :
    product[index].l > 0 ? "l" :
    product[index].xl > 0 ? "xl" :
    product[index].xxl > 0 ? "xxl" :
    product[index].xxxl > 0 ? "xxxl" :
    ""

  const [selectedSize, setSelectedSize] = useState(initialSize)
  const [quantity, setQuantity] = useState(1)
  const [paymentMode, setPaymentMode] = useState("COD")

  // Function to get stock for selected size
  const getStockForSize = (size: string): number => {
    switch (size) {
      case "xs": return product[index].xs
      case "s": return product[index].s
      case "m": return product[index].m
      case "l": return product[index].l
      case "xl": return product[index].xl
      case "xxl": return product[index].xxl
      case "xxxl": return product[index].xxxl
      default: return 0
    }
  }

  const mutation = useMutation({
    mutationFn : (data : orderInterface) => axios.post("http://localhost:5000/order/create", { order :  data}),
    onSuccess : (response : { data : getProductInterrface[][]} ) => {
      setProduct(response.data)
      successAlert("Order Placed")
      setOpen(false)
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  })

  const handleOrder = () => {
    // Validate quantity against selected size stock
    const currentStock = getStockForSize(selectedSize)
    
    if (quantity > currentStock) {
      errorAlert(`Insufficient stock! Only ${currentStock} items available for size ${selectedSize.toUpperCase()}`)
      return
    }

    if (selectedSize == "all") {
      errorAlert("Please select a size")
      return
    }

    let productPrice = addFeeBasedOnSize(product[index].price, selectedSize); 
      
    const totalPrice = (productPrice * quantity) + getShippingFee(quantity);
    setOpen(false)

    confirmAlert(` check out ${quantity} ${ product[index].name} color ${ product[index].color} for ₱${totalPrice}?`, "Check Out", () => {
      
    
      const orderObj = {
        customer_id: _id || "",              
        customer_name: fullname || "",       
        customer_address: address || "",     
        product_name: product[index].name || "",
        size: selectedSize || "",
        product_price: productPrice.toString(),  
        total_price: totalPrice,            
        quantity: quantity,                 
        status: status,                    
        date: date,                        
        modeOfPayment: paymentMode, 
        product_id : product_id,   
        color : product[index].color ,
        grouped_id : product[index].product_id,
        shippingFee : getShippingFee(quantity),
        img : product[index].image   
      };
    
      mutation.mutate(orderObj)
    })

    
  };

  useEffect(() => {
    setSelectedSize("all")
    setQuantity(1)
  }, [index])


  useEffect(() => {
    if(selectedSize == "all") setQuantity(1)
  }, [selectedSize])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" onClick={() => setOpen(true)}>
          Order
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">{product[index].name} ( <span className="text-stone-600">{product[index].color}</span> ) <span className="text-green-500"> ₱{product[index].price} - {product[index].price + 50}  </span> </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 ">

          <div className="w-full h-96 ">
            <CarouselImage images={images} setIndex={setIndex}/>
          </div>

          <div className="flex w-full gap-5 mt-5 justify-center items-center">
              <div>
                <Label htmlFor="size-select" className="mb-1">
                  Size - Stocks - price
                </Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>

                    <SelectItem value="all"> { checkIFOutOFStock([getStockForSize("xs"), getStockForSize("s"), getStockForSize("m"), getStockForSize("l"), getStockForSize("xl"), getStockForSize("xxl"), getStockForSize("xxxl")]) } </SelectItem>

                    {product[index].xs > 0 && (
                      <SelectItem value="xs">XS - {product[index].xs} - <span className="text-green-500"> ₱{product[index].price} </span></SelectItem>
                    )}
                    {product[index].s > 0 && (
                      <SelectItem value="s">S - {product[index].s} - <span className="text-green-500"> ₱{product[index].price} </span></SelectItem>
                    )}
                    {product[index].m > 0 && (
                      <SelectItem value="m">M - {product[index].m} - <span className="text-green-500"> ₱{product[index].price} </span></SelectItem>
                    )}
                    {product[index].l > 0 && (
                      <SelectItem value="l">L - {product[index].l} - <span className="text-green-500"> ₱{product[index].price + 10 } </span></SelectItem>
                    )}
                    {product[index].xl > 0 && (
                      <SelectItem value="xl">XL - {product[index].xl} - <span className="text-green-500"> ₱{product[index].price + 20} </span></SelectItem>
                    )}
                    {product[index].xxl > 0 && (
                      <SelectItem value="xxl">XXL - {product[index].xxl} - <span className="text-green-500"> ₱{product[index].price + 30 } </span></SelectItem>
                    )}
                    {product[index].xxxl > 0 && (
                      <SelectItem value="xxxl">XXXL - {product[index].xxxl} - <span className="text-green-500"> ₱{product[index].price + 50} </span></SelectItem>
                    )}
                  </SelectContent>
                </Select>
                
              </div>


              <div>
                <Label htmlFor="quantity-input" className="mb-1">
                  Quantity
                </Label>
                <Input
                  id="quantity-input"
                  type="number"
                  disabled={selectedSize == "all"}
                  min={1}
                  max={selectedSize ? getStockForSize(selectedSize) : undefined}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                />
                {(selectedSize != "all" && quantity > getStockForSize(selectedSize)) && (
                  <p className="text-sm text-red-600 mt-1">
                    Quantity exceeds available stock ({getStockForSize(selectedSize)})
                  </p>
                )}
            </div>


          <div>
            <Label htmlFor="payment-mode-select" className="mb-1">
              Payment
            </Label>
            <Select value={paymentMode} onValueChange={setPaymentMode}>
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
          
          <div className="w-full h-10 flex gap-5 justify-center items-center">
                <p className="font-bold text-stone-500"> price : <span className="text-green-500">  ₱{ addFeeBasedOnSize(product[index].price, selectedSize) * quantity} </span> </p>
                <p className="font-bold text-stone-500"> shipping : <span className="text-green-500">  ₱{ getShippingFee(quantity) } </span>  </p>
                <p className="font-bold text-stone-500"> total : <span className="text-green-500">  ₱{(addFeeBasedOnSize(product[index].price, selectedSize) * quantity) + getShippingFee(quantity)} </span>   </p>
          </div>
         
         
        </div>

        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleOrder}
            disabled={!selectedSize || quantity > getStockForSize(selectedSize) || quantity < 1}
            className="w-full"
          >
            Order Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}