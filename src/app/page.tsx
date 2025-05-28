"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header with Admin Login */}
      <header className="flex justify-end p-6">
        <Button
          variant="outline"
          onClick={() => router.push("/pages/adminLoginPage")}
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          Admin
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        {/* Brand Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold text-purple-900 mb-4 tracking-tight">SYARA</h1>
          <p className="text-xl md:text-2xl text-purple-600 font-light mb-2">Premium Clothing Collection</p>
          <p className="text-lg text-purple-500">Quezon, Lucban</p>
        </div>

    

        {/* Description */}
        <div className="text-center mb-12 max-w-2xl">
          <p className="text-lg text-gray-600 leading-relaxed">
            Discover timeless elegance and contemporary style with Syara's curated collection. From everyday essentials
            to statement pieces, we bring you quality fashion that celebrates your unique style.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <Button
            onClick={() => router.push("/pages/customerLoginPage")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-medium"
            size="lg"
          >
            Login
          </Button>
          <Button
            onClick={() => router.push("/pages/customerRegisterPage")}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg font-medium"
            size="lg"
          >
            Register
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600">Carefully selected fabrics and materials for lasting comfort</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Local Craftsmanship</h3>
            <p className="text-gray-600">Proudly made in Quezon, supporting local artisans</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick and reliable shipping across the Philippines</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500">
        <p>&copy; 2024 Syara. All rights reserved.</p>
      </footer>
    </div>
  )
}
