"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, Wallet, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering and disable static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface PaymentSettings {
  gcash_number: string;
  gcash_name: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_account_type: string;
  cod_available: boolean;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    gcash_number: "0938 585 9744",
    gcash_name: "Febie M.",
    bank_name: "BDO",
    bank_account_name: "Kuya Jun's Atchup Sabaw",
    bank_account_number: "1234-5678-9012",
    bank_account_type: "Savings",
    cod_available: true
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    specialInstructions: ""
  });

  // Handle mounting to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch payment settings
  useEffect(() => {
    if (isMounted) {
      fetchPaymentSettings();
    }
  }, [isMounted]);

  // Redirect if cart is empty - only after mounting
  useEffect(() => {
    if (isMounted && items.length === 0) {
      router.push("/menu");
    }
  }, [isMounted, items.length, router]);

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch("/api/admin/payment-settings");
      if (response.ok) {
        const data = await response.json();
        setPaymentSettings(data);
      }
    } catch (error) {
      console.error("Error fetching payment settings:", error);
    }
  };

  // Don't render anything until mounted
  if (!isMounted) {
    return null;
  }

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.deliveryDate || !formData.deliveryTime) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (!paymentMethod) {
        alert("Please select a payment method");
        setLoading(false);
        return;
      }

      const orderData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        specialInstructions: formData.specialInstructions || "",
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: totalPrice,
        paymentMethod: paymentMethod,
        userId: session?.user?.id
      };

      console.log('Submitting order:', orderData);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log('Order response:', result);

      if (response.ok) {
        clearCart();
        router.push("/order-success");
      } else {
        alert('Error placing order: ' + (result.error || 'Unknown error'));
        setLoading(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert('Error placing order. Please try again.');
      setLoading(false);
    }
  };

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back to menu link */}
        <Link href="/menu" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Link>

        <h1 className="text-3xl font-bold text-orange-800 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 text-center">
              <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
                step >= s ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {s}
              </div>
              <p className="text-sm mt-2">
                {s === 1 ? "Details" : s === 2 ? "Payment" : "Confirm"}
              </p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter delivery address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date *</label>
                <input
                  type="date"
                  name="deliveryDate"
                  min={today}
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time *</label>
                <input
                  type="time"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                  placeholder="Any special requests? (optional)"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-6 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod("gcash")}
                className={`p-4 border rounded-lg text-center hover:bg-orange-50 transition ${
                  paymentMethod === "gcash" ? "border-orange-600 bg-orange-50 ring-2 ring-orange-600 ring-opacity-50" : "border-gray-200"
                }`}
              >
                <Wallet className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <span className="font-medium">GCash</span>
              </button>
              
              <button
                onClick={() => setPaymentMethod("bank")}
                className={`p-4 border rounded-lg text-center hover:bg-orange-50 transition ${
                  paymentMethod === "bank" ? "border-orange-600 bg-orange-50 ring-2 ring-orange-600 ring-opacity-50" : "border-gray-200"
                }`}
              >
                <Landmark className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <span className="font-medium">Bank Transfer</span>
              </button>
              
              {paymentSettings.cod_available && (
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-4 border rounded-lg text-center hover:bg-orange-50 transition ${
                    paymentMethod === "cash" ? "border-orange-600 bg-orange-50 ring-2 ring-orange-600 ring-opacity-50" : "border-gray-200"
                }`}
              >
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <span className="font-medium">Cash on Delivery</span>
              </button>
              )}
            </div>

            {paymentMethod === "bank" && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">🏦 Bank Transfer Details:</h3>
                <p className="text-sm">Bank: {paymentSettings.bank_name}</p>
                <p className="text-sm">Account Type: {paymentSettings.bank_account_type}</p>
                <p className="text-sm">Account Name: {paymentSettings.bank_account_name}</p>
                <p className="text-sm">Account Number: {paymentSettings.bank_account_number}</p>
                <p className="text-xs text-gray-600 mt-2">Please send proof of payment to febiemosura983@gmail.com</p>
              </div>
            )}

            {paymentMethod === "gcash" && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">📱 GCash Details:</h3>
                <p className="text-sm">GCash Number: {paymentSettings.gcash_number}</p>
                <p className="text-sm">Account Name: {paymentSettings.gcash_name}</p>
                <p className="text-xs text-gray-600 mt-2">Please send screenshot to febiemosura983@gmail.com</p>
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">💰 Cash on Delivery</h3>
                <p className="text-sm">Pay in cash upon delivery</p>
                <p className="text-xs text-gray-600 mt-2">Please prepare exact amount</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50"
              >
                Back
              </button>
              
              <button
                onClick={() => setStep(3)}
                disabled={!paymentMethod}
                className={`px-6 py-2 rounded-lg ${
                  paymentMethod 
                    ? "bg-orange-600 text-white hover:bg-orange-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue to Review
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Order Summary</h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm mb-1">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 font-bold flex justify-between">
                <span>Total:</span>
                <span className="text-orange-600">₱{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Delivery Details</h3>
              <p className="text-sm"><span className="font-medium">Name:</span> {formData.fullName}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {formData.email}</p>
              <p className="text-sm"><span className="font-medium">Phone:</span> {formData.phone}</p>
              <p className="text-sm"><span className="font-medium">Address:</span> {formData.address}</p>
              <p className="text-sm"><span className="font-medium">Date/Time:</span> {formData.deliveryDate} at {formData.deliveryTime}</p>
              {formData.specialInstructions && (
                <p className="text-sm"><span className="font-medium">Instructions:</span> {formData.specialInstructions}</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Payment Method</h3>
              <p className="text-sm capitalize font-semibold">{paymentMethod}</p>
              {paymentMethod === "gcash" && (
                <p className="text-xs text-gray-500 mt-1">GCash Number: {paymentSettings.gcash_number}</p>
              )}
              {paymentMethod === "bank" && (
                <p className="text-xs text-gray-500 mt-1">{paymentSettings.bank_name} - {paymentSettings.bank_account_number}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50"
              >
                Back
              </button>
              
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`px-6 py-2 rounded-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}