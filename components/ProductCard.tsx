"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image_url: string;
  is_available: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Helper function to format price safely
  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return "0.00";
    
    const numPrice = typeof price === 'number' ? price : parseFloat(price as string);
    if (isNaN(numPrice)) return "0.00";
    
    return numPrice.toFixed(2);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'number' ? product.price : parseFloat(product.price || '0'),
      quantity: 1,
      image: product.image_url
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  // Get image source with fallback
  const getImageSource = () => {
    if (imageError || !product.image_url) {
      return null;
    }
    return product.image_url;
  };

  const imageSource = getImageSource();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group h-full flex flex-col" id={`product-${product.id}`}>
      {/* Image Container - Fixed aspect ratio */}
      <div className="relative w-full pt-[75%] bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-orange-50">
            <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {imageSource ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSource}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <ImageIcon className="w-12 h-12 text-orange-300 mb-2" />
            <span className="text-sm text-orange-400 text-center">{product.category}</span>
          </div>
        )}
        
        {/* Availability Badge */}
        {!product.is_available && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
            Unavailable
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category Tag */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {product.description || "No description available"}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-orange-100">
          <span className="text-2xl font-bold text-orange-600">
            ₱{formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available || isAdding}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              product.is_available && !isAdding
                ? "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-md active:scale-95" 
                : isAdding
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? "Added!" : product.is_available ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}