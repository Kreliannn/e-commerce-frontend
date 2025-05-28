// hooks/upload.ts
import axios from "axios"


export default async function useUpload (file: File, type: string): Promise<string>
{


    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "example")
    formData.append("api_key", "994682957379785") 
    
    const uploadUrl = `https://api.cloudinary.com/v1_1/dljxtf9dg/${type}/upload`;
    console.log("Upload URL:", uploadUrl); // Debug log
    
    const result = await axios.post(uploadUrl, formData)

    return result.data.secure_url;
}