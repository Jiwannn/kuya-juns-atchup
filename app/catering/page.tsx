"use client";

import { useState } from "react";
import { Calendar, Users, DollarSign, Send } from "lucide-react";

export default function CateringPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
    event_date: "",
    estimated_guests: "",
    budget_range: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          event_type: "",
          event_date: "",
          estimated_guests: "",
          budget_range: "",
          message: ""
        });
      }
    } catch (error) {
      console.error("Error submitting catering inquiry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-orange-800 mb-4 text-center">Catering Services</h1>
        <p className="text-center text-gray-600 mb-8">
          Perfect for events, offices, and group gatherings
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold">Any Group Size</h3>
            <p className="text-sm text-gray-600">From small to large events</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold">Flexible Scheduling</h3>
            <p className="text-sm text-gray-600">Book in advance</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold">Competitive Pricing</h3>
            <p className="text-sm text-gray-600">Customized packages</p>
          </div>
        </div>

        {/* Catering Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Request a Quote</h2>
          
          {submitted ? (
            <div className="bg-green-100 text-green-700 p-6 rounded-lg text-center">
              <p className="font-semibold text-lg">Thank you for your inquiry!</p>
              <p className="mt-2">We'll contact you within 24 hours to discuss your event.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-green-600 hover:underline"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({...formData, event_type: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select event type</option>
                    <option value="Birthday">Birthday Party</option>
                    <option value="Corporate">Corporate Event</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Family">Family Gathering</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Guests *</label>
                  <input
                    type="number"
                    value={formData.estimated_guests}
                    onChange={(e) => setFormData({...formData, estimated_guests: e.target.value})}
                    className="input-field"
                    required
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                  <select
                    value={formData.budget_range}
                    onChange={(e) => setFormData({...formData, budget_range: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select range</option>
                    <option value="below-5000">Below ₱5,000</option>
                    <option value="5000-10000">₱5,000 - ₱10,000</option>
                    <option value="10000-20000">₱10,000 - ₱20,000</option>
                    <option value="above-20000">Above ₱20,000</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="input-field"
                  placeholder="Tell us more about your event..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2 disabled:bg-orange-300 text-lg font-semibold"
              >
                {loading ? "Submitting..." : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Inquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}