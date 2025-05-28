'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/navbar';
import useUpload from '@/app/utils/upload';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { productInterrface } from '@/app/types/product.type';
import { successAlert, errorAlert } from '@/app/utils/alert';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sizes, setSizes] = useState({
    xs: '0',
    s: '0',
    m: '0',
    l: '0',
    xl: '0',
    xxl: '0',
    xxxl: '0',
  });

  const handleSizeChange = (size: keyof typeof sizes, value: string) => {
    setSizes(prev => ({
      ...prev,
      [size]: value,
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };


  const mutation = useMutation({
    mutationFn : (data : productInterrface) => axios.post("http://localhost:5000/product/create", { product :  data}),
    onSuccess : (response : { data : string} ) => {
        successAlert(response.data)
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  })


  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      alert("Please enter product name");
      return;
    }
    if (!price.trim()) {
      alert("Please enter product price");
      return;
    }
    if (!selectedFile) {
      alert("Please select an image");
      return;
    }

    setSubmitting(true);

    try {
      // Upload image to Cloudinary first
      const uploadResult = await useUpload(selectedFile, "image");
      
      if (uploadResult === "file type error") {
        errorAlert("File type is not valid. Please select an image file.");
        setSubmitting(false);
        return;
      }
      
      if (uploadResult === "file size error") {
        errorAlert("File size is too large. Please select a smaller image.");
        setSubmitting(false);
        return;
      }

      // Set the uploaded image URL
      const imageUrl = uploadResult;
      console.log("Cloudinary secure_url:", imageUrl);

      // Create product data in the format matching your mongoose schema
      const productData = {
        name: name,
        price: Number(price),
        image: imageUrl,
        xs: Number(sizes.xs) || 0,
        s: Number(sizes.s) || 0,
        m: Number(sizes.m) || 0,
        l: Number(sizes.l) || 0,
        xl: Number(sizes.xl) || 0,
        xxl: Number(sizes.xxl) || 0,
        xxxl: Number(sizes.xxxl) || 0,
      };

      // Console log the product data in the exact format you requested
      console.log("Product data matching mongoose schema:");
      const newProduct = {
        name: productData.name,
        price: productData.price,
        image: productData.image,
        xs: productData.xs,
        s: productData.s,
        m: productData.m,
        l: productData.l,
        xl: productData.xl,
        xxl: productData.xxl,
        xxxl: productData.xxxl,
      };

      mutation.mutate(newProduct)
      
     
      
      // Reset form after successful submission
      setName('');
      setPrice('');
      setImage('');
      setSelectedFile(null);
      setSizes({
        xs: '0',
        s: '0',
        m: '0',
        l: '0',
        xl: '0',
        xxl: '0',
        xxxl: '0',
      });

    } catch (error) {
      console.error("Submit error:", error);
      errorAlert("Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='h-dvh w-full'>
      <Navbar />

      <div className="max-w-xl mx-auto p-6 space-y-6 mt-5">
        <h1 className="text-2xl font-bold">Add Product</h1>

        <div className="space-y-4">
          <Input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2">
            {Object.keys(sizes).map((size) => (
              <div key={size} className="flex flex-col items-center w-16">
                <label className="text-xs uppercase">{size}</label>
                <Input
                  type="number"
                  value={sizes[size as keyof typeof sizes]}
                  onChange={(e) => handleSizeChange(size as keyof typeof sizes, e.target.value)}
                  className="text-sm px-1 py-0.5"
                />
              </div>
            ))}
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <div className="text-green-600 text-sm">
                ✅ Image selected: {selectedFile.name}
              </div>
            )}
          </div>

          <Button 
            className='w-full mb-2' 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Adding Product...' : 'Add Product'}
          </Button>
        </div>
      </div>
    </div>
  );
}