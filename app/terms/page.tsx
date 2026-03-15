import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-orange-800 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-4">This is a test page for Terms of Service.</p>
        <Link href="/auth/register" className="text-orange-600 hover:underline">
          Back to Register
        </Link>
      </div>
    </div>
  );
}