"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { getProductInterrface } from "@/app/types/product.type"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { successAlert, errorAlert } from '@/app/utils/alert';
type SizesType = {
  xs: number,
  s: number,
  m: number,
  l: number,
  xl: number,
  xxl: number,
  xxxl: number,
}

export default function EditButton({ product, setProduct} : { product : getProductInterrface, setProduct :  React.Dispatch<React.SetStateAction<getProductInterrface[]>>}) {
  const [open, setOpen] = useState(false)

  // Local states for form fields
  const [name, setName] = useState(product.name || "")
  const [price, setPrice] = useState(product.price || 0)
  const [sizes, setSizes] = useState<SizesType>({
    xs: product.xs || 0,
    s: product.s || 0,
    m: product.m || 0,
    l: product.l || 0,
    xl: product.xl || 0,
    xxl: product.xxl || 0,
    xxxl: product.xxxl || 0,
  })

  // Handle size input change
  const handleSizeChange = (size: keyof SizesType, value: string) => {
    const num = Number(value)
    if (!isNaN(num) && num >= 0) {
      setSizes((prev) => ({
        ...prev,
        [size]: num,
      }))
    }
  }

  const mutation = useMutation({
    mutationFn : (data : getProductInterrface) => axios.patch("http://localhost:5000/product/update", { product :  data}),
    onSuccess : (response : { data : getProductInterrface[]} ) => {
        setProduct(response.data)
        successAlert("updated ")
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  })

  const mutationDelete = useMutation({
    mutationFn : () => axios.delete("http://localhost:5000/product/" + product._id),
    onSuccess : (response : { data : getProductInterrface[]} ) => {
        setProduct(response.data)
        successAlert("deleted ")
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  })




  const handleSubmit = () => {
    const updatedProduct = {
      _id : product._id,
      name,
      price,
      image: product.image,  // keep original image since you're not editing it here
      xs: sizes.xs,
      s: sizes.s,
      m: sizes.m,
      l: sizes.l,
      xl: sizes.xl,
      xxl: sizes.xxl,
      xxxl: sizes.xxxl,
    };
    mutation.mutate(updatedProduct)

  
    setOpen(false);
  };
  

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"lg"} variant="default" onClick={() => setOpen(true)}>
          Edit Product
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Product</SheetTitle>
          <p className="mb-4 text-sm text-gray-600">
            Update the product details below.
          </p>
        </SheetHeader>

        <div className="space-y-4 mb-6 p-5">
  <div className="flex flex-col">
    <Label htmlFor="product-name" className="mb-1 font-medium text-gray-700">
      Product Name
    </Label>
    <Input
      id="product-name"
      placeholder="Product Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </div>

    <div className="flex flex-col">
        <Label htmlFor="price" className="mb-1 font-medium text-gray-700">
        Price
        </Label>
        <Input
        id="price"
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        min={0}
        />
    </div>

    <div className="flex flex-wrap gap-4">
        {Object.keys(sizes).map((size) => (
        <div key={size} className="flex flex-col items-center w-16">
            <label className="text-xs uppercase mb-1">{size}</label>
            <Input
            type="number"
            min={0}
            value={sizes[size as keyof SizesType]}
            onChange={(e) =>
                handleSizeChange(size as keyof SizesType, e.target.value)
            }
            className="text-sm px-1 py-0.5"
            />
        </div>
        ))}
     
    </div>

        <Button variant={"destructive"} onClick={() => mutationDelete.mutate()}>
            delete Product
        </Button>
    </div>


        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleSubmit} className="w-full">
              Save Changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
