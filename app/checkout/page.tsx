"use client";

import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, Wallet } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    specialInstructions: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        ...formData,
        items,
        totalAmount: totalPrice,
        paymentMethod,
        // userId: session?.user?.id
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearCart();
        router.push("/order-success");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (items.length === 0) {
    router.push("/menu");
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
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
                className={`p-4 border rounded-lg text-center hover:bg-orange-50 ${
                  paymentMethod === "gcash" ? "border-orange-600 bg-orange-50" : "border-gray-200"
                }`}
              >
                <Wallet className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <span className="font-medium">GCash</span>
              </button>
              
              <button
                onClick={() => setPaymentMethod("bank")}
                className={`p-4 border rounded-lg text-center hover:bg-orange-50 ${
                  paymentMethod === "bank" ? "border-orange-600 bg-orange-50" : "border-gray-200"
                }`}
              >
                <Landmark className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <span className="font-medium">Bank Transfer</span>
              </button>
              
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`p-4 border rounded-lg text-center hover:bg-orange-50 ${
                  paymentMethod === "cash" ? "border-orange-600 bg-orange-50" : "border-gray-200"
                }`}
              >
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <span className="font-medium">Cash on Delivery</span>
              </button>
            </div>

            {paymentMethod === "bank" && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Bank Transfer Details:</h3>
                <p>Bank: BDO</p>
                <p>Account Name: Kuya Jun's Atchup Sabaw</p>
                <p>Account Number: 1234-5678-9012</p>
                <p className="text-sm text-gray-600 mt-2">Please send the proof of payment to febiemosura983@gmail.com</p>
              </div>
            )}

            {paymentMethod === "gcash" && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">GCash Details:</h3>
                <p>GCash Number: 0938 585 9744</p>
                <p>Account Name: Febie M.</p>
                <p className="text-sm text-gray-600 mt-2">Please send the screenshot to febiemosura983@gmail.com</p>
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
              <p className="text-sm">{formData.fullName}</p>
              <p className="text-sm">{formData.address}</p>
              <p className="text-sm">{formData.deliveryDate} at {formData.deliveryTime}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Payment Method</h3>
              <p className="text-sm capitalize">{paymentMethod}</p>
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
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}