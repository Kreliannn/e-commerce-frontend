"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function CustomerNavbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="w-full bg-white shadow px-4 sm:px-8 py-2 flex justify-between items-center">
      {/* Logo Image */}
      <div className="relative w-24 h-12 sm:w-32 sm:h-16">
        <Image
          src="/logo.jpg"
          alt="Logo"
          fill
          className="object-contain rounded-full"
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-4">
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

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu />
        </Button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-md rounded-md p-4 flex flex-col space-y-2 md:hidden z-50">
          <Button variant="ghost" onClick={() => { setMenuOpen(false); router.push("/pages/customerOrder") }}>
            Orders
          </Button>
          <Button variant="ghost" onClick={() => { setMenuOpen(false); router.push("/pages/customerPage") }}>
            Products
          </Button>
          <Button variant="ghost" onClick={() => { setMenuOpen(false); router.push("/") }}>
            Logout
          </Button>
        </div>
      )}
    </nav>
  )
}
