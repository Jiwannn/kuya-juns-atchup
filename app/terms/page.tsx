import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link href="/auth/register" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Registration
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: March 15, 2026</p>

          <div className="prose prose-orange max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              Welcome to Kuya Jun's Atchup Sabaw Eatery. By accessing or using our website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              Kuya Jun's Atchup Sabaw Eatery provides an online platform for customers to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Browse our menu and food items</li>
              <li>Place orders for pickup or delivery</li>
              <li>Make catering inquiries for events</li>
              <li>Create accounts to track order history</li>
              <li>Submit reviews and feedback</li>
              <li>Contact us for customer support</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              To access certain features, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Updating your information as necessary</li>
            </ul>
            <p className="text-gray-600 mb-4">
              You must be at least 18 years old to create an account. By creating an account, you represent that you are 18 years of age or older.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Ordering and Payment</h2>
            <p className="text-gray-600 mb-4">
              When you place an order through our platform:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>All prices are in Philippine Peso (₱) and include applicable taxes</li>
              <li>Payment methods include GCash, bank transfer, and cash on delivery</li>
              <li>Orders are subject to availability and confirmation</li>
              <li>We reserve the right to cancel or refuse any order</li>
              <li>Delivery times are estimates and not guaranteed</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Cancellations and Refunds</h2>
            <p className="text-gray-600 mb-4">
              Cancellation and refund policies:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Orders can be cancelled within 10 minutes of placement</li>
              <li>Refunds for cancelled orders will be processed within 3-5 business days</li>
              <li>Once food preparation begins, orders cannot be cancelled</li>
              <li>For issues with your order, contact us within 24 hours</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. User Conduct</h2>
            <p className="text-gray-600 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Use the service for any illegal purpose</li>
              <li>Submit false or misleading information</li>
              <li>Interfere with the proper operation of the service</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post inappropriate or offensive content</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Kuya Jun's Atchup Sabaw Eatery and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, Kuya Jun's Atchup Sabaw Eatery shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Your use or inability to use the service</li>
              <li>Any conduct or content of any third party</li>
              <li>Unauthorized access to your transmissions or data</li>
              <li>Statements or conduct of any third party</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Indemnification</h2>
            <p className="text-gray-600 mb-4">
              You agree to indemnify and hold harmless Kuya Jun's Atchup Sabaw Eatery, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Modifications to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last updated" date. Your continued use of the service after such modifications constitutes your acceptance of the revised terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">12. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-orange-50 p-6 rounded-xl">
              <p className="text-gray-700"><strong>Email:</strong> febiemosura983@gmail.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> 0938 585 9744</p>
              <p className="text-gray-700"><strong>Address:</strong> Available on FoodPanda & GrabFood</p>
            </div>

            <p className="text-gray-500 text-sm mt-8">
              By using our service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}