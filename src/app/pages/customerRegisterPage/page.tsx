"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios"
import { userInterface } from "@/app/types/user.types";

export default function Home() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const mutation = useMutation({
    mutationFn : (data : userInterface) => axios.post("http://localhost:5000/user/create", { user : data}),
    onSuccess : (response : { data : string} ) => {
        alert(response.data)
    },
    onError : (err : { request : { response : string}}) => alert(err.request.response)
  })

  const handleLogin = () => {
    // Example validation or login logic
    if (username && password && fullname) {
        mutation.mutate({fullname, username, password,address})
    } else {
      alert("Please fill in both fields");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <div className="space-y-4">
        <Input
            type="text"
            placeholder="Fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
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