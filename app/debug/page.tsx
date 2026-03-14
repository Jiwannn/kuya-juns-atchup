"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DebugPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Session Debug Info</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Session Data:</h2>
        <pre className="bg-gray-50 p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href="/admin" className="bg-orange-600 text-white px-4 py-2 rounded">
          Go to Admin
        </Link>
        <Link href="/admin/orders" className="bg-blue-600 text-white px-4 py-2 rounded">
          Go to Orders
        </Link>
      </div>
    </div>
  );
}