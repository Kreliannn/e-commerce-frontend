"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function CustomerNavbar() {
  const router = useRouter()

  return (
    <nav className="w-full bg-white shadow px-8 py-1 flex justify-between items-center ">
      {/* Logo Image */}
      <div className="relative w-32 h-15 rounded-full">
        <Image
          src="/logo.jpg" // Place your image in public/logo.png
          alt="Logo"
          fill
          className="object-contain rounded-full"
        />
      </div>

      {/* Navigation Links */}
      <div className="space-x-4">
        <Button variant="ghost" onClick={() => router.push("/pages/customerOrder")}>
          Orders
        </Button>
        <Button variant="ghost" onClick={() => router.push("/pages/customerPage")}>
          Products
        </Button>
        <Button variant="ghost" onClick={() => router.push("/")}>
          Logout
        </Button>
      </div>
    </nav>
  )
}
