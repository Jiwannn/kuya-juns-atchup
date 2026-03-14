import Link from "next/link";
import { ShoppingBag, Users, Truck, Star, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-orange-700 to-orange-600">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Kuya Jun's <span className="text-amber-200">Atchup Sabaw</span>
            </h1>
            <p className="text-2xl mb-2 text-orange-100">Hello mga ka-ATCHUP! 🍱</p>
            <p className="text-xl mb-8 text-orange-100">
              Affordable and delicious packed meals and food trays
            </p>
            <div className="flex gap-4">
              <Link 
                href="/menu" 
                className="bg-amber-400 text-orange-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-300 transition transform hover:scale-105"
              >
                Order Now
              </Link>
              <Link 
                href="/catering" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition transform hover:scale-105"
              >
                Catering Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-orange-800 mb-4">Why Choose Us?</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Experience the best of home-cooked meals with our signature Atchup Sabaw
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition group-hover:scale-110">
                <ShoppingBag className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Budget-friendly</h3>
              <p className="text-gray-600">Affordable meals starting at ₱149 without compromising quality</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition group-hover:scale-110">
                <Users className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Home-cooked Goodness</h3>
              <p className="text-gray-600">Taste the love in every serving with our family recipes</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition group-hover:scale-110">
                <Truck className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">On FoodPanda & GrabFood for hassle-free delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-orange-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-orange-200">Menu Items</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-orange-200">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-orange-200">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-orange-800 mb-4">Get in Touch</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out to us through any of these channels.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <div className="bg-orange-50 rounded-xl p-6 text-center group hover:shadow-lg transition">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition">
                <Phone className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <a href="tel:09385859744" className="text-orange-600 hover:text-orange-700 text-lg font-medium">
                0938 585 9744
              </a>
              <p className="text-sm text-gray-500 mt-2">Mon-Sun, 9am-9pm</p>
            </div>

            {/* Email */}
            <div className="bg-orange-50 rounded-xl p-6 text-center group hover:shadow-lg transition">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <a href="mailto:febiemosura983@gmail.com" className="text-orange-600 hover:text-orange-700 text-lg font-medium break-all">
                febiemosura983@gmail.com
              </a>
              <p className="text-sm text-gray-500 mt-2">We reply within 24hrs</p>
            </div>

            {/* Delivery Partners */}
            <div className="bg-orange-50 rounded-xl p-6 text-center group hover:shadow-lg transition">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Delivery Partners</h3>
              <p className="text-orange-600 text-lg font-medium">FoodPanda • GrabFood</p>
              <p className="text-sm text-gray-500 mt-2">Order via app</p>
            </div>

            {/* Hours */}
            <div className="bg-orange-50 rounded-xl p-6 text-center group hover:shadow-lg transition">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
              <p className="text-orange-600 text-lg font-medium">9:00 AM - 9:00 PM</p>
              <p className="text-sm text-gray-500 mt-2">Open daily</p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition transform hover:scale-105"
            >
              Learn More About Us
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}