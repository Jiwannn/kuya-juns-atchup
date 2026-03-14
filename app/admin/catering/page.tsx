"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Phone, 
  Calendar, 
  Users as UsersIcon, 
  MessageSquare, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Download
} from "lucide-react";
import Link from "next/link";

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
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.role !== 'admin') {
      router.push("/");
      return;
    }

    fetchInquiries();
  }, [session, status, router]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/catering");
      
      if (!response.ok) {
        throw new Error("Failed to fetch inquiries");
      }
      
      const data = await response.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setError("Failed to load catering inquiries");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInquiries();
  };

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    setSuccessMessage(null);
    
    try {
      console.log(`Updating inquiry ${id} to ${newStatus}`);
      
      const response = await fetch(`/api/catering/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setInquiries(inquiries.map(inq => 
          inq.id === id ? { ...inq, status: newStatus } : inq
        ));
        setSuccessMessage(`Status updated to ${newStatus}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">New</span>;
      case 'contacted':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Contacted</span>;
      case 'confirmed':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Confirmed</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'new':
        return <Clock className="w-4 h-4 text-green-600" />;
      case 'contacted':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-teal-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'border-l-4 border-green-500';
      case 'contacted': return 'border-l-4 border-blue-500';
      case 'confirmed': return 'border-l-4 border-purple-500';
      case 'completed': return 'border-l-4 border-teal-500';
      case 'cancelled': return 'border-l-4 border-red-500';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter inquiries based on status and showCompleted toggle
  const filteredInquiries = inquiries.filter(inquiry => {
    // Status filter
    if (statusFilter !== 'all' && inquiry.status !== statusFilter) {
      return false;
    }
    // Hide completed/cancelled if showCompleted is false
    if (!showCompleted && (inquiry.status === 'completed' || inquiry.status === 'cancelled')) {
      return false;
    }
    return true;
  });

  // Calculate stats
  const stats = {
    new: inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    confirmed: inquiries.filter(i => i.status === 'confirmed').length,
    completed: inquiries.filter(i => i.status === 'completed').length,
    cancelled: inquiries.filter(i => i.status === 'cancelled').length,
    total: inquiries.length
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading catering inquiries...</p>
        </div>
      </div>
    );
  }

  if (!session || session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only administrators can view catering inquiries.</p>
          <Link href="/" className="inline-block mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Catering Inquiries</h1>
          <p className="text-gray-500 mt-1">Manage customer catering requests</p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && (
            <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full animate-pulse">
              {successMessage}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter('new')}>
          <p className="text-2xl font-bold text-green-600">{stats.new}</p>
          <p className="text-xs text-gray-600">New</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter('contacted')}>
          <p className="text-2xl font-bold text-blue-600">{stats.contacted}</p>
          <p className="text-xs text-gray-600">Contacted</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter('confirmed')}>
          <p className="text-2xl font-bold text-purple-600">{stats.confirmed}</p>
          <p className="text-xs text-gray-600">Confirmed</p>
        </div>
        <div className="bg-teal-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter('completed')}>
          <p className="text-2xl font-bold text-teal-600">{stats.completed}</p>
          <p className="text-xs text-gray-600">Completed</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter('cancelled')}>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-xs text-gray-600">Cancelled</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter('all')}>
          <p className="text-2xl font-bold text-gray-600">{stats.total}</p>
          <p className="text-xs text-gray-600">Total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`px-4 py-2 rounded-lg transition ${
                  showCompleted ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showCompleted ? 'Hiding Completed' : 'Show Completed'}
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Clear Filter
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No catering inquiries found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div 
              key={inquiry.id} 
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition ${getStatusColor(inquiry.status)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{inquiry.name}</h2>
                  <p className="text-gray-600">{inquiry.event_type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(inquiry.status)}
                    {getStatusBadge(inquiry.status)}
                  </div>
                  <select
                    value={inquiry.status}
                    onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                    disabled={updatingId === inquiry.id}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {updatingId === inquiry.id && (
                    <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${inquiry.email}`} className="text-orange-600 hover:underline text-sm">
                    {inquiry.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${inquiry.phone}`} className="text-orange-600 hover:underline text-sm">
                    {inquiry.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{formatDate(inquiry.event_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{inquiry.estimated_guests || 0} guests</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Budget Range</p>
                  <p className="text-sm font-medium text-gray-700">{inquiry.budget_range || 'Not specified'}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Submitted</p>
                  <p className="text-sm font-medium text-gray-700">{formatDateTime(inquiry.created_at)}</p>
                </div>
              </div>

              {inquiry.message && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Additional Message</p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{inquiry.message}</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${inquiry.email}?subject=Re: Catering Inquiry - ${inquiry.event_type}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
                {inquiry.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(inquiry.id, 'completed')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}