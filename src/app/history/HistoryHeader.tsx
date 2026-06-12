"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export default function HistoryHeader({ userProfile }: { userProfile: UserProfile }) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Logout exception:", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="font-extrabold text-xl text-blue-600 tracking-tight">
          AI Workspace
        </div>
        <div className="hidden sm:flex items-center gap-4 border-l border-gray-200 pl-6">
          <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
            Engine
          </Link>
          <Link href="/history" className="text-sm font-bold text-blue-600 transition-colors">
            History
          </Link>
          <Link href="/analytics" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
            Analytics
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {userProfile.avatarUrl ? (
            <img 
              src={userProfile.avatarUrl} 
              alt={userProfile.name} 
              className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {userProfile.name.charAt(0)}
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-sm font-medium text-gray-600 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 hover:text-red-600 transition-all disabled:opacity-50"
        >
          {isLoggingOut ? "Exiting..." : "Log out"}
        </button>
      </div>
    </nav>
  );
}