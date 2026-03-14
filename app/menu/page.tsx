"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Search, Filter, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ReviewModal from "@/components/ReviewModal";
import ReviewCard from "@/components/ReviewCard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
}

interface Review {
  id: number;
  user_name: string;
  rating: number;
  review: string;
  created_at: string;
}

interface ProductReviews {
  [key: number]: Review[];
}

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Review states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviews, setShowReviews] = useState<number | null>(null);
  const [productReviews, setProductReviews] = useState<ProductReviews>({});
  const [averageRatings, setAverageRatings] = useState<Record<number, { average: number; count: number }>>({});

  useEffect(() => {
    fetchProducts();
    fetchAllReviews();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      filterProducts();
    }
  }, [selectedCategory, searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Only show available products to customers
        const availableProducts = data.filter((p: Product) => p.is_available === true);
        setProducts(availableProducts);
        setFilteredProducts(availableProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(availableProducts.map((p: Product) => p.category))];
        setCategories(uniqueCategories.filter(Boolean));
      } else {
        console.error("API returned non-array data:", data);
        setProducts([]);
        setFilteredProducts([]);
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReviews = async () => {
    try {
      console.log("📡 Fetching all reviews...");
      const response = await fetch("/api/reviews");
      const data = await response.json();
      console.log("📦 Reviews API response:", data);
      
      if (response.ok) {
        // Group reviews by product
        const reviewsByProduct: ProductReviews = {};
        if (data.reviews && Array.isArray(data.reviews)) {
          data.reviews.forEach((review: any) => {
            if (!reviewsByProduct[review.product_id]) {
              reviewsByProduct[review.product_id] = [];
            }
            reviewsByProduct[review.product_id].push(review);
          });
        }
        setProductReviews(reviewsByProduct);

        // Store average ratings
        const ratings: Record<number, { average: number; count: number }> = {};
        if (data.averageRatings && Array.isArray(data.averageRatings)) {
          data.averageRatings.forEach((item: any) => {
            ratings[item.product_id] = {
              average: parseFloat(item.average_rating) || 0,
              count: parseInt(item.total_reviews) || 0
            };
          });
        }
        setAverageRatings(ratings);
        console.log("✅ Average ratings set:", ratings);
      }
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
    }
  };

  const fetchProductReviews = async (productId: number) => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProductReviews(prev => ({
          ...prev,
          [productId]: data.reviews
        }));
        setShowReviews(productId);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const filterProducts = () => {
    if (!Array.isArray(products) || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query))
      );
    }
    
    setFilteredProducts(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-orange-600 font-bold text-sm">KJ</span>
            </div>
          </div>
          <p className="text-gray-600 text-lg">Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchProducts();
            }}
            className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Our Menu
          </h1>
          <p className="text-xl text-orange-100 text-center max-w-2xl mx-auto">
            Discover our delicious selection of home-cooked meals, perfect for any occasion
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 sticky top-20 z-20">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="md:w-64 relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "all" || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearSearch}
                className="text-sm text-orange-600 hover:text-orange-700 ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `No items matching "${searchQuery}"`
                : selectedCategory !== "all"
                ? `No items in category "${selectedCategory}"`
                : "No items available"}
            </p>
            <button
              onClick={clearSearch}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
            >
              View All Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex flex-col h-full">
                {/* Product Card - Fixed height */}
                <div className="relative h-full">
                  <ProductCard 
                    product={product}
                    averageRating={averageRatings[product.id]?.average}
                    reviewCount={averageRatings[product.id]?.count}
                  />
                </div>
                
                {/* Review Actions - Below card */}
                <div className="mt-2 flex justify-between items-center px-1">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowReviewModal(true);
                    }}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Write a Review
                  </button>
                  <button
                    onClick={() => {
                      if (showReviews === product.id) {
                        setShowReviews(null);
                      } else {
                        fetchProductReviews(product.id);
                      }
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    {showReviews === product.id ? 'Hide Reviews' : 'View Reviews'}
                  </button>
                </div>

                {/* Reviews List - Separate container */}
                {showReviews === product.id && productReviews[product.id] && (
                  <div className="mt-3 border rounded-lg p-3 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Customer Reviews</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                      {productReviews[product.id].length > 0 ? (
                        productReviews[product.id].map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 text-center py-2">
                          No reviews yet. Be the first to review!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedProduct(null);
          }}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onSubmit={() => {
            fetchAllReviews();
            if (showReviews === selectedProduct.id) {
              fetchProductReviews(selectedProduct.id);
            }
          }}
        />
      )}
    </div>
  );
}