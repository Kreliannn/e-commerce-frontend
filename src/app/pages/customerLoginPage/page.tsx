"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios"
import { userInterface } from "@/app/types/user.types";
import userUserStore from "@/app/store/userStore"
import { successAlert, errorAlert } from '@/app/utils/alert';



export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = userUserStore()

  const mutation = useMutation({
    mutationFn : () => axios.post("http://localhost:5000/user/get", { username , password}),
    onSuccess : (response : { data : string} ) => {
        setUser(response.data)
        console.log(response.data)
        router.push("/pages/customerPage")
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  })


  const handleLogin = () => {
    // Example validation or login logic
    if (username && password) {
      mutation.mutate()
    } else {
      alert("Please fill in both fields");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
  <div className="absolute top-4 left-4 z-10">
    <Button onClick={() => router.push("/")}>Back</Button>
  </div>
  <div className="flex flex-1 items-center justify-center">
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
</div>

  );
}