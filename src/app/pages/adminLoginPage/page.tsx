"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { successAlert, errorAlert } from '@/app/utils/alert';
import { useRouter } from "next/navigation";



export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");




  const handleLogin = () => {
    // Example validation or login logic
    if (username && password) {
        if(username == "admin" && password == "123") router.push("/pages/adminPage")
        else errorAlert("invalid")
    } else {
      errorAlert("Please fill in both fields");
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
    {/* Back button in top-left corner */}
    <div className="absolute top-4 left-4">
      <Button onClick={() => router.push("/")}>
        Back
      </Button>
    </div>
  
    {/* Login Card */}
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="w-full" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  </div>
  
  );
}