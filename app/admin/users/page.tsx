"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Mail, 
  Calendar, 
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCog,
  AlertCircle,
  RefreshCw,
  Crown,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  provider: string;
  created_at: string;
  order_count?: number;
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingRole, setUpdatingRole] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updateCounter, setUpdateCounter] = useState(0);

  const usersPerPage = 10;

  // Owner emails that cannot be modified
  const PROTECTED_EMAILS = ["febiemosura983@gmail.com", "superadmin@gmail.com"];

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

    fetchUsers();
  }, [session, status, router, currentPage, updateCounter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const url = `/api/admin/users?page=${currentPage}&limit=${usersPerPage}&_=${timestamp}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`;
      console.log("📡 Fetching users from:", url);
      
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      const data = await response.json();
      console.log("📦 Users data received:", data);
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }
      
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setUpdateCounter(prev => prev + 1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setUpdateCounter(prev => prev + 1);
  };

  const handleRoleChange = async (userId: number, newRole: string, userEmail: string) => {
    // Prevent changing protected accounts
    if (PROTECTED_EMAILS.includes(userEmail)) {
      alert("Cannot change the role of protected accounts (Owner/Super Admin)");
      return;
    }

    // Prevent changing own role
    if (userEmail === session?.user?.email) {
      alert("You cannot change your own role");
      return;
    }

    setUpdatingRole(userId);
    setError(null);
    setSuccessMessage(null);
    
    try {
      console.log(`🔄 Updating user ${userId} (${userEmail}) to role: ${newRole}`);
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();
      console.log("📥 Update response:", data);

      if (response.ok) {
        // Update local state immediately
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        
        setSuccessMessage(`User role updated to ${newRole} successfully`);
        
        // Force re-render
        setUpdateCounter(prev => prev + 1);
        
      } else {
        setError(data.error || "Failed to update user role");
      }
    } catch (error) {
      console.error("❌ Error updating user role:", error);
      setError("Error updating user role");
    } finally {
      setUpdatingRole(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-orange-100 text-orange-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'owner') return <Crown className="w-4 h-4 text-purple-600" />;
    if (role === 'admin') return <Shield className="w-4 h-4 text-orange-600" />;
    return <UserCog className="w-4 h-4 text-green-600" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isProtected = (email: string) => PROTECTED_EMAILS.includes(email);
  const isCurrentUser = (email: string) => email === session?.user?.email;

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
          <p className="text-gray-600">Only administrators can view users.</p>
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
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 mt-1">Manage user roles and permissions</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Search
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const protected_user = isProtected(user.email);
                  const current_user = isCurrentUser(user.email);
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-semibold">
                              {user.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">{user.name || 'No name'}</span>
                            {protected_user && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                Owner
                              </span>
                            )}
                            {current_user && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {user.provider || 'credentials'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {!protected_user ? (
                          <select
                            key={`select-${user.id}-${user.role}-${updateCounter}`}
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value, user.email)}
                            disabled={updatingRole === user.id || current_user}
                            className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer transition ${
                              getRoleBadgeColor(user.role)
                            } ${
                              updatingRole === user.id ? 'opacity-50' : ''
                            } ${
                              current_user ? 'cursor-not-allowed opacity-50' : 'hover:opacity-80'
                            }`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className="text-sm text-gray-400 italic flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            Protected
                          </span>
                        )}
                        {current_user && !protected_user && (
                          <p className="text-xs text-gray-400 mt-1">(Cannot change your own role)</p>
                        )}
                        {updatingRole === user.id && (
                          <div className="mt-1">
                            <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-4 mt-6">
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

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Role Management Rules</p>
            <ul className="text-xs text-blue-700 mt-1 list-disc list-inside">
              <li>Owner accounts (febiemosura983@gmail.com, superadmin@gmail.com) cannot be modified</li>
              <li>You cannot change your own role while logged in</li>
              <li>Changes update instantly in the UI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}