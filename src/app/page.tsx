"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <div className="flex gap-2">
        <Button onClick={() => router.push("/pages/customerLoginPage")}> login </Button>
        <Button onClick={() => router.push("/pages/customerRegisterPage")}> register </Button>
        <Button onClick={() => router.push("/pages/adminLoginPage")}> admin </Button>
    </div>  
  );
}
