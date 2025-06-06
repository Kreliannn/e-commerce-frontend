"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios"
import { userInterface } from "@/app/types/user.types";
import { successAlert, errorAlert } from '@/app/utils/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { quezonLocations } from "./components/quezon_data";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");



  const locations = quezonLocations

  //const [municipality, setMunicipality] = useState([])
  const [barangay, setBarangay] = useState<string[]>([])


  const [selectedMunicipality, setSelectedMunicipality] = useState("all")
  const [selectedBarangay, setSelectedBarangay] = useState("all")
  const [aditionalInfo, setaditionalInfo] = useState("")

  const mutation = useMutation({
    mutationFn : (data : userInterface) => axios.post("http://localhost:5000/user/create", { user : data}),
    onSuccess : (response : { data : string} ) => {
        successAlert(response.data)
        setSelectedBarangay("all")
        setSelectedMunicipality("all")
        setaditionalInfo("")
        setFullname("")
        setUsername("")
        setPassword("")
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  })

  const handleLogin = () => {
    if (username && password && fullname && aditionalInfo && selectedBarangay && selectedMunicipality) {
        const address = `${selectedMunicipality}, ${selectedBarangay} - ${aditionalInfo}`
        mutation.mutate({fullname, username, password,address})
    } else {
      errorAlert("Please fill in both fields");
    }
  };

  const handleSelectMunicipality = ( selected : string) => {
    setSelectedMunicipality(selected)
    setSelectedBarangay("all")
    const getMunicipalityData = locations.filter((item) => item.municipality == selected)
    setBarangay((getMunicipalityData.length > 0) ? getMunicipalityData[0].barangay : [])
  }



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative px-4">
  {/* Top-left Back Button */}
  <div className="absolute top-4 left-4">
    <Button onClick={() => router.push("/")}>
      Back
    </Button>
  </div>

  {/* Login/Register Card */}
  <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-md m-5 flex flex-col" style={{ height: '80vh', maxHeight: '600px' }}>
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 flex-shrink-0">Register Form</h2>

    {/* Scrollable form content */}
    <div className="overflow-y-auto space-y-4 flex-grow pr-2">
      {/* Fullname */}
      <div>
        <Label htmlFor="fullname" className="block mb-1 text-sm font-medium text-gray-700">
          Fullname
        </Label>
        <Input
          id="fullname"
          type="text"
          placeholder="Enter your full name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Username */}
      <div>
        <Label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Municipality */}
      <div>
        <Label htmlFor="municipality-select" className="block mb-1 text-sm font-medium text-gray-700">
          Municipality
        </Label>
        <Select
          value={selectedMunicipality}
          onValueChange={handleSelectMunicipality}
        >
          <SelectTrigger className="w-full" aria-label="Select Municipality">
            <SelectValue placeholder="Select municipality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select municipality</SelectItem>
            {locations.map((item, index) => (
              <SelectItem key={index} value={item.municipality}>
                {item.municipality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Barangay */}
      <div>
        <Label htmlFor="barangay-select" className="block mb-1 text-sm font-medium text-gray-700">
          Barangay
        </Label>
        <Select
          value={selectedBarangay}
          onValueChange={setSelectedBarangay}
          disabled={selectedMunicipality === "all"}
        >
          <SelectTrigger className="w-full" aria-label="Select Barangay">
            <SelectValue placeholder="Select Barangay" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select Barangay</SelectItem>
            {barangay.map((item, index) => (
              <SelectItem key={index} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Additional Info */}
      <div>
        <Label htmlFor="additional-info" className="block mb-1 text-sm font-medium text-gray-700">
          Address Additional Information
        </Label>
        <Textarea
          id="additional-info"
          placeholder="Enter any additional address information"
          value={aditionalInfo}
          onChange={(e) => setaditionalInfo(e.target.value)}
          className="w-full min-h-[80px]"
        />
      </div>
    </div>

    {/* Login Button */}
    <Button
      className="w-full py-3 text-lg font-semibold mt-4 flex-shrink-0"
      onClick={handleLogin}
    >
      Register
    </Button>
  </div>
</div>

  
  );
}