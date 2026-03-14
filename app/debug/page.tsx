"use client";

import { useSession } from "next-auth/react";

export default function DebugPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Session</h1>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
      </div>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}