"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus, Eye, Image as ImageIcon, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  is_available: boolean;
  image_url: string;
}

export default function AdminProducts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

    fetchProducts();
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/products");
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/products/${id}`, { 
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message || "Product deleted successfully");
        await fetchProducts(); // Refresh the list
      } else {
        setError(result.error || "Failed to delete product");
        alert(result.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Error deleting product. Please try again.");
      alert("Error deleting product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailability = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: !currentStatus })
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to update product availability");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product availability");
    }
  };

  // Helper function to format price safely
  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return "0.00";
    
    // Convert to number
    const numPrice = typeof price === 'number' ? price : parseFloat(price as string);
    
    // Check if it's a valid number
    if (isNaN(numPrice)) return "0.00";
    
    return numPrice.toFixed(2);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!session || session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only administrators can manage products.</p>
          <Link href="/" className="inline-block mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="container mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-orange-800">Manage Menu</h1>
            <p className="text-gray-600 mt-1">Total products: {products.length}</p>
          </div>
          <Link 
            href="/admin/products/new" 
            className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-orange-700 hover:to-orange-600 transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-100 to-amber-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-lg font-medium">No products yet</p>
                        <p className="text-sm">Click "Add New Product" to create your first menu item.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-orange-50 transition">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-lg overflow-hidden">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-orange-300" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{product.description || 'No description'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        ₱{formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleToggleAvailability(product.id, product.is_available)}
                          disabled={deletingId === product.id}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                            product.is_available 
                              ? "bg-green-100 text-green-700 hover:bg-green-200" 
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          } ${deletingId === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {product.is_available ? "Available" : "Unavailable"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link 
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit product"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <Link 
                            href={`/menu#product-${product.id}`}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="View on menu"
                            target="_blank"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition ${
                              deletingId === product.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title="Delete product"
                          >
                            {deletingId === product.id ? (
                              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}