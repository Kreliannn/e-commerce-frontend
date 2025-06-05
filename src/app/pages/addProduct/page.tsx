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

interface ProductVariation {
  id: string;
  name: string;
  price: string;
  color: string;
  selectedFile: File | null;
  sizes: {
    xs: string;
    s: string;
    m: string;
    l: string;
    xl: string;
    xxl: string;
    xxxl: string;
  };
}

export default function AddProduct() {
  
  const randomId = Math.random().toString(36).substring(2, 10);

  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<ProductVariation[]>([
    {
      id: '1',
      name: '',
      price: '',
      color: '',
      selectedFile: null,
      sizes: {
        xs: '0',
        s: '0',
        m: '0',
        l: '0',
        xl: '0',
        xxl: '0',
        xxxl: '0',
      }
    }
  ]);

  const addVariation = () => {
    const newVariation: ProductVariation = {
      id: Date.now().toString(),
      name: '',
      price: '',
      color: '',
      selectedFile: null,
      sizes: {
        xs: '0',
        s: '0',
        m: '0',
        l: '0',
        xl: '0',
        xxl: '0',
        xxxl: '0',
      }
    };
    setProducts([...products, newVariation]);
  };

  const removeVariation = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const updateProduct = (id: string, field: keyof ProductVariation, value: any) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, [field]: value }
        : product
    ));
  };

  const updateProductSize = (id: string, size: keyof ProductVariation['sizes'], value: string) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { 
            ...product, 
            sizes: { ...product.sizes, [size]: value }
          }
        : product
    ));
  };

  const handleFileSelect = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateProduct(id, 'selectedFile', file);
    }
  };

  const mutation = useMutation({
    mutationFn : (data : productInterrface[] ) => axios.post("http://localhost:5000/product/create", { products :  data}),
    onSuccess : (response : { data : string} ) => {
        successAlert(response.data)
        setTimeout(() => {
          window.location.reload()
        } ,500)
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  });

  const handleSubmit = async () => {
    // Validation
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.name.trim()) {
        alert(`Please enter product name for variation ${i + 1}`);
        return;
      }
      if (!product.price.trim()) {
        alert(`Please enter product price for variation ${i + 1}`);
        return;
      }
      if (!product.color.trim()) {
        alert(`Please enter product color for variation ${i + 1}`);
        return;
      }
      if (!product.selectedFile) {
        alert(`Please select an image for variation ${i + 1}`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const processedProducts = [];

      // Upload all images to Cloudinary first
      for (const product of products) {
        const uploadResult = await useUpload(product.selectedFile!, "image");
        
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

        const processedProduct = {
          product_id: randomId,
          name: product.name,
          price: Number(product.price),
          color: product.color,
          image: uploadResult,
          xs: Number(product.sizes.xs) || 0,
          s: Number(product.sizes.s) || 0,
          m: Number(product.sizes.m) || 0,
          l: Number(product.sizes.l) || 0,
          xl: Number(product.sizes.xl) || 0,
          xxl: Number(product.sizes.xxl) || 0,
          xxxl: Number(product.sizes.xxxl) || 0,
        };

        processedProducts.push(processedProduct);
      }

     
     

   
      mutation.mutate(processedProducts);
      
      // Reset form after successful submission
      setProducts([
        {
          id: '1',
          name: '',
          price: '',
          color: '',
          selectedFile: null,
          sizes: {
            xs: '0',
            s: '0',
            m: '0',
            l: '0',
            xl: '0',
            xxl: '0',
            xxxl: '0',
          }
        }
      ]);

    } catch (error) {
      console.error("Submit error:", error);
      errorAlert("Failed to add products");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='h-dvh w-full'>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 space-y-6 mt-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add Product Variations</h1>
          <Button onClick={addVariation} className="bg-green-600 hover:bg-green-700">
            + Add Variation
          </Button>
        </div>

        <div className="space-y-8">
          {products.map((product, index) => {
              product.name = products[0]?.name
              product.price = products[0]?.price
            return(
              <div key={product.id} className="border rounded-lg p-6 relative">
                {(products.length > 0) ? (
                  <Button
                    onClick={() => removeVariation(product.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 w-8 h-8 p-0"
                    hidden={index == 0}
                  >
                    ×
                  </Button>
                ) : null}
                
                <h3 className="text-lg font-semibold mb-4">Variation {index + 1}</h3>
                
                <div className="space-y-4">
                  <Input
                    placeholder="Product Name"
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Price"
                      type="number"
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                    />
                    <Input
                      placeholder="Color"
                      value={product.color}
                      onChange={(e) => updateProduct(product.id, 'color', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(product.sizes).map((size) => (
                      <div key={size} className="flex flex-col items-center w-16">
                        <label className="text-xs uppercase">{size}</label>
                        <Input
                          type="number"
                          value={product.sizes[size as keyof typeof product.sizes]}
                          onChange={(e) => updateProductSize(product.id, size as keyof typeof product.sizes, e.target.value)}
                          className="text-sm px-1 py-0.5"
                        />
                      </div>
                    ))}
                  </div>
  
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(product.id, e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {product.selectedFile && (
                      <div className="text-green-600 text-sm">
                        ✅ Image selected: {product.selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <Button 
          className='w-full mb-2' 
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Adding Products...' : `upload product with ${products.length} variation${products.length > 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  );
}