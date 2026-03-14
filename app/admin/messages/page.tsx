"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Inbox
} from "lucide-react";
import Link from "next/link";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export default function AdminMessages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const messageId = searchParams?.get('id');
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const messagesPerPage = 10;

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

    fetchMessages();
  }, [session, status, router, currentPage, filter]);

  // Auto-select message if ID is in URL
  useEffect(() => {
    if (messageId && messages.length > 0) {
      const message = messages.find(m => m.id === parseInt(messageId));
      if (message) {
        setSelectedMessage(message);
        // Mark as read when viewed
        if (message.status === 'unread') {
          handleStatusChange(message.id, 'read');
        }
        // Scroll to the message in list
        const element = document.getElementById(`message-${message.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [messageId, messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `/api/contact?page=${currentPage}&limit=${messagesPerPage}&status=${filter}&search=${searchTerm}`;
      console.log("Fetching messages from:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      
      const data = await response.json();
      console.log("Messages received:", data);
      
      setMessages(data.messages || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMessages();
  };

  const handleStatusChange = async (id: number, newStatus: 'read' | 'replied') => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, status: newStatus } : msg
        ));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'unread':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Unread</span>;
      case 'read':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Read</span>;
      case 'replied':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Replied</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only administrators can view messages.</p>
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
          <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
          <p className="text-gray-500 mt-1">Manage customer inquiries and messages</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filters */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'unread' ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'read' ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Read
            </button>
            <button
              onClick={() => setFilter('replied')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'replied' ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Replied
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or subject..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Messages List and Detail View */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Messages ({messages.length})</h3>
            <Inbox className="w-4 h-4 text-gray-400" />
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg">No messages found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    id={`message-${message.id}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (message.status === 'unread') {
                        handleStatusChange(message.id, 'read');
                      }
                    }}
                    className={`p-4 cursor-pointer transition ${
                      selectedMessage?.id === message.id
                        ? 'bg-orange-50 border-l-4 border-orange-500'
                        : 'hover:bg-gray-50'
                    } ${message.status === 'unread' ? 'bg-red-50/30' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">
                            {message.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{message.name}</p>
                          <p className="text-xs text-gray-500">{message.email}</p>
                        </div>
                      </div>
                      {getStatusBadge(message.status)}
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700 mb-1">{message.subject}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{message.message}</p>
                    
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:text-orange-600 disabled:text-gray-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:text-orange-600 disabled:text-gray-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Message Detail View */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {selectedMessage ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Message Details</h2>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete message"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Sender Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Sender Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-800 font-medium">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-orange-600 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${selectedMessage.phone}`} className="text-orange-600 hover:underline">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(selectedMessage.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      {getStatusBadge(selectedMessage.status)}
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Subject</h3>
                  <p className="text-gray-800 font-medium mb-4">{selectedMessage.subject}</p>
                  
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex gap-2">
                  {selectedMessage.status === 'unread' && (
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                      className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Mark as Read
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Replied
                  </button>

                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center text-gray-500">
              <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No message selected</p>
              <p className="text-sm">Click on a message to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}