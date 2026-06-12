"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";
import { ThemeToggle } from "../../components/ThemeToggle"; // ➕ Import Toggle

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export default function AnalyticsHeader({ userProfile }: { userProfile: UserProfile }) {
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
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-6">
        <div className="font-extrabold text-xl text-blue-600 dark:text-blue-400 tracking-tight">
          AI Workspace
        </div>
        <div className="hidden sm:flex items-center gap-4 border-l border-gray-200 dark:border-slate-700 pl-6">
          <Link href="/dashboard" className="text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Engine
          </Link>
          <Link href="/history" className="text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            History
          </Link>
          <Link href="/analytics" className="text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors">
            Analytics
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <ThemeToggle /> {/* ➕ The Dark Mode Button */}
        
        <div className="hidden sm:flex items-center gap-3">
          {userProfile.avatarUrl ? (
            <img 
              src={userProfile.avatarUrl} 
              alt={userProfile.name} 
              className="w-9 h-9 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
              {userProfile.name.charAt(0)}
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-sm font-medium text-gray-600 dark:text-slate-300 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 transition-all disabled:opacity-50"
        >
          {isLoggingOut ? "Exiting..." : "Log out"}
        </button>
      </div>
    </nav>
  );
}