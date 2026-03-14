"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Calendar, Users as UsersIcon } from "lucide-react";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  estimated_guests: number;
  budget_range: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminCatering() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    fetchInquiries();
  }, [status, router]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/catering");
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  if (session?.user?.email !== "febiemosura983@gmail.com") {
    return <div>Access Denied</div>;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6">Catering Inquiries</h1>

        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{inquiry.name}</h2>
                  <p className="text-gray-600">{inquiry.event_type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  inquiry.status === 'new' ? 'bg-green-100 text-green-800' :
                  inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {inquiry.status}
                </span>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${inquiry.email}`} className="text-orange-600 hover:underline">
                    {inquiry.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${inquiry.phone}`} className="text-orange-600 hover:underline">
                    {inquiry.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(inquiry.event_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-gray-400" />
                  <span>{inquiry.estimated_guests} guests</span>
                </div>
              </div>

              {inquiry.message && (
                <div className="bg-orange-50 p-3 rounded-lg mb-3">
                  <p className="text-gray-700">{inquiry.message}</p>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Budget: {inquiry.budget_range || 'Not specified'}</span>
                <span>Received: {new Date(inquiry.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}

          {inquiries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No catering inquiries yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}