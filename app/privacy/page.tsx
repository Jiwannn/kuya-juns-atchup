import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link href="/auth/register" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Registration
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: March 15, 2026</p>

          <div className="prose prose-orange max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Kuya Jun's Atchup Sabaw Eatery ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            <p className="text-gray-600 mb-4">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-2">2.1 Personal Data</h3>
            <p className="text-gray-600 mb-4">
              While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This includes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li><strong>Name:</strong> To personalize your experience and identify your orders</li>
              <li><strong>Email address:</strong> For account creation, order confirmations, and communications</li>
              <li><strong>Phone number:</strong> For delivery coordination and customer support</li>
              <li><strong>Delivery address:</strong> To deliver your orders</li>
              <li><strong>Payment information:</strong> Processed securely through our payment partners</li>
              <li><strong>Order history:</strong> To track your purchases and preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-2">2.2 Usage Data</h3>
            <p className="text-gray-600 mb-4">
              We may also collect information about how you access and use our service. This usage data may include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Your computer's Internet Protocol (IP) address</li>
              <li>Browser type and version</li>
              <li>The pages you visit on our site</li>
              <li>Time and date of your visit</li>
              <li>Time spent on those pages</li>
              <li>Device identifiers and other diagnostic data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect for various purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>To provide and maintain our service</li>
              <li>To process and fulfill your orders</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To send you order confirmations and updates</li>
              <li>To communicate with you about promotions and offers (with your consent)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Sharing Your Information</h2>
            <p className="text-gray-600 mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li><strong>With Delivery Partners:</strong> To facilitate order delivery (address and phone number only)</li>
              <li><strong>With Payment Processors:</strong> To process your payments securely</li>
              <li><strong>For Legal Reasons:</strong> If required by law or to protect our rights</li>
              <li><strong>With Your Consent:</strong> We may share information for other purposes with your explicit consent</li>
            </ul>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties for marketing purposes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Encryption of sensitive data (passwords are hashed using bcrypt)</li>
              <li>Secure socket layer technology (SSL)</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information</li>
            </ul>
            <p className="text-gray-600 mb-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Your Data Rights</h2>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li><strong>Access:</strong> You can request a copy of the information we hold about you</li>
              <li><strong>Correction:</strong> You can ask us to correct inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> You can request that we delete your personal information</li>
              <li><strong>Objection:</strong> You can object to our processing of your information</li>
              <li><strong>Restriction:</strong> You can ask us to restrict processing of your information</li>
              <li><strong>Data Portability:</strong> You can request a copy of your information in a machine-readable format</li>
            </ul>
            <p className="text-gray-600 mb-4">
              To exercise these rights, please contact us at febiemosura983@gmail.com.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
            <p className="text-gray-600 mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Keep you signed in to your account</li>
              <li>Remember your cart items</li>
              <li>Understand how you use our website</li>
              <li>Improve your user experience</li>
            </ul>
            <p className="text-gray-600 mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-600 mb-4">
              Our service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="text-gray-600 mb-4">
              Third-party services we use include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li><strong>Google OAuth:</strong> For authentication (Google login)</li>
              <li><strong>Neon PostgreSQL:</strong> For database hosting</li>
              <li><strong>Vercel:</strong> For website hosting</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
            </p>
            <p className="text-gray-600 mb-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-orange-50 p-6 rounded-xl">
              <p className="text-gray-700"><strong>Email:</strong> febiemosura983@gmail.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> 0938 585 9744</p>
              <p className="text-gray-700"><strong>Business Hours:</strong> Monday - Sunday, 9:00 AM - 9:00 PM</p>
            </div>

            <p className="text-gray-500 text-sm mt-8">
              By using our service, you acknowledge that you have read, understood, and agree to this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}