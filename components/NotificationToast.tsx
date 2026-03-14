"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function NotificationToast() {
  const { data: session } = useSession();
  const isOwner = session?.user?.email === "febiemosura983@gmail.com";

  useEffect(() => {
    if (!isOwner) return;

    // Poll for new notifications every 30 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/notifications");
        const notifications = await response.json();
        
        notifications.forEach((notif: any) => {
          toast.custom((t) => (
            <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-orange-600">
              <p className="font-semibold">{notif.title}</p>
              <p className="text-sm text-gray-600">{notif.message}</p>
            </div>
          ));
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOwner]);

  return null;
}