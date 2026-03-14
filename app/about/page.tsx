import Link from "next/link";
import { Users, Award, Heart, ChefHat, Clock, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-orange-700 to-orange-600">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-orange-100">
              Serving authentic Atchup Sabaw with love and tradition since 2010
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-800 mb-8 text-center">Our Story</h2>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-96 bg-cover bg-center" style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80')" 
              }}></div>
              
              <div className="p-8 md:p-12">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  It all started in a small kitchen in 2010, when Kuya Jun decided to share his family's secret recipe for Atchup Sabaw with the neighborhood. What began as a small sari-sari store venture quickly grew into a beloved local eatery known for its hearty, flavorful, and affordable meals.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Today, Kuya Jun's Atchup Sabaw has become a go-to destination for those craving authentic, home-cooked Filipino comfort food. We've served thousands of happy customers, catered countless events, and maintained the same quality and love in every serving.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our secret? Simple: fresh ingredients, traditional cooking methods, and a whole lot of love. Every dish is prepared as if we're cooking for our own family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-orange-800 mb-12 text-center">Our Mission & Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-orange-800 mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To provide delicious, affordable, and high-quality Filipino meals that bring families and communities together.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-orange-800 mb-3">Our Vision</h3>
              <p className="text-gray-600">
                To be the most loved and trusted Atchup Sabaw brand in the Philippines, known for quality and authentic taste.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-orange-800 mb-3">Our Promise</h3>
              <p className="text-gray-600">
                Fresh ingredients, consistent quality, and service with a smile in every order, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-orange-800 mb-12 text-center">Meet the Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-32 h-32 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-orange-600 font-bold">KJ</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Kuya Jun</h3>
              <p className="text-orange-600 font-medium mb-2">Founder & Head Chef</p>
              <p className="text-gray-500 text-sm">The mastermind behind our secret recipe with 20+ years of cooking experience.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-32 h-32 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-orange-600 font-bold">FM</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Febie Mosura</h3>
              <p className="text-orange-600 font-medium mb-2">Operations Manager</p>
              <p className="text-gray-500 text-sm">Ensuring every order is perfect and every customer is satisfied.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-32 h-32 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-orange-600 font-bold">+15</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Our Team</h3>
              <p className="text-orange-600 font-medium mb-2">Dedicated Staff</p>
              <p className="text-gray-500 text-sm">Working together to serve you better every single day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-orange-800 mb-12 text-center">Why Choose Us</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Fast Service</h3>
                <p className="text-gray-600">Quick preparation and delivery through our partner apps.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Family Recipe</h3>
                <p className="text-gray-600">Secret recipe passed down through generations.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Multiple Locations</h3>
                <p className="text-gray-600">Available on FoodPanda and GrabFood for easy delivery.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Quality Guaranteed</h3>
                <p className="text-gray-600">100% satisfaction guarantee on all our dishes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-700 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Try Our Atchup?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Experience the taste of home-cooked goodness today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/menu" 
              className="bg-amber-400 text-orange-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-300 transition transform hover:scale-105"
            >
              View Our Menu
            </Link>
            <Link 
              href="/catering" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition transform hover:scale-105"
            >
              Inquire for Catering
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}