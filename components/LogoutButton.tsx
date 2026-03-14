"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      // Try NextAuth logout first
      await signOut({ redirect: false });
      
      // Clear any local storage items
      localStorage.clear();
      sessionStorage.clear();
      
      // Force redirect to login
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Logout error:', error);
      // Ultimate fallback
      window.location.href = '/auth/signin';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      Sign Out
    </button>
  );
}