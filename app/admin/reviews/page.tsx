"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star, CheckCircle, XCircle, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Review {
  id: number;
  user_name: string;
  product_name: string;
  rating: number;
  review: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminReviews() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session?.user?.role !== 'admin') {
      router.push("/");
      return;
    }
    fetchReviews();
  }, [session, status, router, filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statusParam = filter === 'all' ? '' : `?status=${filter}`;
      const url = `/api/admin/reviews${statusParam}`;
      console.log("📡 Fetching reviews from:", url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log("📦 Reviews data:", data);
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch reviews");
      }
      
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      setError(error instanceof Error ? error.message : "Failed to load reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    setError(null);
    
    try {
      console.log(`✅ Attempting to approve review ${id}`);
      
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ is_approved: true })
      });

      const data = await response.json();
      console.log("📥 Approve response:", data);

      if (response.ok) {
        alert("Review approved successfully!");
        fetchReviews();
      } else {
        setError(data.error || data.details || "Failed to approve review");
        alert(data.error || data.details || "Failed to approve review");
      }
    } catch (error) {
      console.error("❌ Error approving review:", error);
      setError("Error approving review");
      alert("Error approving review");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    setProcessingId(id);
    
    try {
      console.log(`🗑️ Attempting to delete review ${id}`);
      
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE"
      });
      
      const data = await response.json();
      console.log("📥 Delete response:", data);
      
      if (response.ok) {
        alert("Review deleted successfully!");
        fetchReviews();
      } else {
        setError(data.error || data.details || "Failed to delete review");
        alert(data.error || data.details || "Failed to delete review");
      }
    } catch (error) {
      console.error("❌ Error deleting review:", error);
      setError("Error deleting review");
      alert("Error deleting review");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReviews();
  };

  const getStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only administrators can view reviews.</p>
          <Link href="/" className="inline-block mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Review Management</h1>
          <p className="text-gray-500 mt-1">Approve or reject customer reviews</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Pending Approval
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'approved' ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          All Reviews
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No reviews found</p>
          <p className="text-sm text-gray-400 mt-2">
            {filter === 'pending' ? 'No pending reviews awaiting approval' : 
             filter === 'approved' ? 'No approved reviews yet' : 
             'No reviews in the system'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{review.product_name || 'Unknown Product'}</h3>
                  <p className="text-sm text-gray-500">by {review.user_name || 'Anonymous'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStarRating(review.rating)}
                  <span className="text-sm font-medium text-gray-700 ml-2">{review.rating}/5</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{review.review}</p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  {!review.is_approved && (
                    <>
                      <button
                        onClick={() => handleApprove(review.id)}
                        disabled={processingId === review.id}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition disabled:opacity-50"
                      >
                        {processingId === review.id ? (
                          <div className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={processingId === review.id}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                      >
                        {processingId === review.id ? (
                          <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Reject
                      </button>
                    </>
                  )}
                  {review.is_approved && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      Approved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}