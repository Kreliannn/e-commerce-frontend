"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/ui/navbar"



export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Page Content */}
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        {/* Your page content here */}
        <h1 className="text-2xl text-gray-700">Welcome to your shop dashboard</h1>
      </div>
    </div>
  )
}
