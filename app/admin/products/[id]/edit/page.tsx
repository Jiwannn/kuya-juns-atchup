"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Upload, Image as ImageIcon, X, Save } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
}

export default function EditProduct() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Packed Meals",
    is_available: true
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.role !== 'admin') {
      router.push("/");
      return;
    }

    fetchProduct();
  }, [session, status, router, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      
      const product: Product = await response.json();
      
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price.toString(),
        category: product.category || "Packed Meals",
        is_available: product.is_available
      });

      if (product.image_url) {
        setImagePreview(product.image_url);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product");
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate form
      if (!formData.name || !formData.price) {
        alert("Please fill in all required fields");
        setSaving(false);
        return;
      }

      let imageUrl = imagePreview || "";
      
      // Upload new image if selected
      if (imageFile) {
        setUploading(true);
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (error) {
          console.error("Error processing image:", error);
          alert("Error processing image. Please try again.");
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      }

      // Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: imageUrl,
        is_available: formData.is_available
      };

      console.log("Updating product:", productData);

      // Send to API
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        console.error("Failed to update product:", result);
        alert(result.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/products" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-orange-800">Edit Product</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="border-2 border-dashed border-orange-200 rounded-xl p-6">
              <div className="flex flex-col items-center justify-center">
                {imagePreview ? (
                  <div className="relative w-48 h-48 mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-12 h-12 text-orange-400" />
                  </div>
                )}
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {imagePreview ? "Change Image" : "Upload Image"}
                </label>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Classic Atchup Meal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="149.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Describe your dish..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="Packed Meals">Packed Meals</option>
                <option value="Food Trays">Food Trays</option>
                <option value="Catering">Catering</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available}
                onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                Available for ordering
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving || uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {uploading ? "Uploading Image..." : "Saving Changes..."}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              
              <Link
                href="/admin/products"
                className="px-6 py-3 border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        {imagePreview && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Preview</h2>
            <div className="max-w-sm mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 relative">
                  <img 
                    src={imagePreview} 
                    alt={formData.name || "Preview"} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1">{formData.name || "Product Name"}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{formData.description || "Description"}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-600">
                      ₱{parseFloat(formData.price || "0").toFixed(2)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      formData.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {formData.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}