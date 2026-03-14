import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-orange-800 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-700 font-bold text-lg">KJ</span>
              </div>
              <h3 className="text-xl font-bold">Kuya Jun's Atchup</h3>
            </div>
            <p className="text-orange-200 text-sm leading-relaxed">
              Serving delicious and affordable Atchup Sabaw meals since 2010. 
              Home-cooked goodness in every serving.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-orange-200 hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/catering" className="text-orange-200 hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                  Catering
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-orange-200 hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-orange-200 hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-200">Phone / GCash</p>
                  <a href="tel:09385859744" className="text-white hover:text-orange-200 transition">
                    0938 585 9744
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-200">Email</p>
                  <a href="mailto:febiemosura983@gmail.com" className="text-white hover:text-orange-200 transition break-all">
                    febiemosura983@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-200">Delivery Partners</p>
                  <p className="text-white">FoodPanda • GrabFood</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-200">Business Hours</p>
                  <p className="text-white">Mon-Sun: 9:00 AM - 9:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <p className="text-orange-200 text-sm mb-4">
              Stay updated with our latest promos and events!
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-orange-700 rounded-lg flex items-center justify-center hover:bg-orange-600 transition transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-orange-700 rounded-lg flex items-center justify-center hover:bg-orange-600 transition transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-orange-700 rounded-lg flex items-center justify-center hover:bg-orange-600 transition transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-orange-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-orange-200">
            <p>© {new Date().getFullYear()} Kuya Jun's Atchup Sabaw Eatery. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}