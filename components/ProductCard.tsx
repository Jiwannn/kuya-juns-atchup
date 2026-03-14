"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
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

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group" id={`product-${product.id}`}>
      <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 relative">
        {product.image_url && !imageError ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 text-orange-300 mb-2" />
            <span className="text-sm text-orange-400">{product.category}</span>
          </div>
        )}
        {!product.is_available && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Unavailable
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
            {product.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-orange-600">₱{product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available || isAdding}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              product.is_available && !isAdding
                ? "bg-orange-600 text-white hover:bg-orange-700" 
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