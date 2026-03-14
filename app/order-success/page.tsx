import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-orange-800 mb-2">Order Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll send you a confirmation email with your order details.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              You will receive a notification once your order is confirmed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/menu" 
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
              >
                Continue Shopping
              </Link>
              <Link 
                href="/" 
                className="border border-orange-600 text-orange-600 px-6 py-2 rounded-lg hover:bg-orange-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}