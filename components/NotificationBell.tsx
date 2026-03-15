"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  reference_id: number;
  user_id?: number; // For customer notifications
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = session?.user?.role === 'admin';
  const isLoggedIn = !!session;

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchNotifications();
    
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    
    // Click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      // For customers, fetch their notifications
      const url = isAdmin ? '/api/notifications' : '/api/notifications?user=true';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setNotifications(Array.isArray(data) ? data : []);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    await Promise.all(unreadIds.map(id => markAsRead(id)));
    fetchNotifications();
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    // Close dropdown
    setIsOpen(false);
    
    // Navigate based on notification type and user role
    if (isAdmin) {
      // Admin navigation
      switch(notification.type) {
        case 'new_order':
          router.push(`/admin/orders/${notification.reference_id}`);
          break;
        case 'contact':
          router.push('/admin/messages');
          break;
        case 'catering':
          router.push('/admin/catering');
          break;
        case 'new_review':
          router.push('/admin/reviews');
          break;
        default:
          router.push('/admin');
      }
    } else {
      // Customer navigation
      switch(notification.type) {
        case 'order_status':
        case 'order_update':
        case 'new_order': // For customers, this means their order was placed
          router.push('/orders');
          break;
        case 'review_response':
          router.push('/menu');
          break;
        default:
          router.push('/');
      }
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    if (isAdmin) {
      switch(notification.type) {
        case 'new_order': return '📦';
        case 'contact': return '📧';
        case 'catering': return '🎉';
        case 'new_review': return '⭐';
        default: return '🔔';
      }
    } else {
      switch(notification.type) {
        case 'order_status': return '🔄';
        case 'order_update': return '📦';
        case 'new_order': return '✅';
        case 'review_response': return '💬';
        default: return '🔔';
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              {isAdmin ? 'Admin Notifications' : 'Your Notifications'}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`block p-3 border-b border-gray-100 hover:bg-orange-50 transition cursor-pointer ${
                    !notification.is_read ? 'bg-orange-50/50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getNotificationIcon(notification)}</span>
                        <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-gray-200 text-center">
            {isAdmin ? (
              <Link
                href="/admin/notifications"
                className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            ) : (
              <Link
                href="/orders"
                className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                View your orders
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}