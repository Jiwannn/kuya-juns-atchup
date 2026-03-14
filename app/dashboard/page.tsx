"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const isOwner = session.user?.email === "febiemosura983@gmail.com";

  return (
    <div>
      <h1>Welcome, {session.user?.name}!</h1>
      <p>Your ID: {session.user?.id}</p>
      {isOwner && <p>You are the owner!</p>}
    </div>
  );
}