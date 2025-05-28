"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const router = useRouter()

  return (

      <nav className="w-full bg-white shadow px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          MyShop
        </div>

        {/* Navigation Links */}
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => router.push("/pages/addProduct")}>
            Add Product
          </Button>
          <Button variant="ghost" onClick={() => router.push("/pages/editProduct")}>
            Manage Product
          </Button>
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => router.push("/orders")}>
            Orders
          </Button>
          <Button variant="ghost" onClick={() => router.push("/")}>
            Logout
          </Button>
        </div>
      </nav>

   
  )
}
