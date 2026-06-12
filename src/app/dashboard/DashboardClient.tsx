"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface DashboardClientProps {
  userProfile: UserProfile;
}

export default function DashboardClient({ userProfile }: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();

  // Gemini Workspace State
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Gemini Core Execution Link
  async function handleGenerate() {
    setIsLoading(true);
    setContent("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await response.json();
      
      if (data.result) {
        setContent(data.result);
      } else {
        setContent("Failed to compile generation. Ensure your API key is configured.");
      }
    } catch (error) {
      setContent("Network configuration error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  // Secure Logout Protocol
  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear client state cache and force route evaluation back to landing page
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Logout exception:", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* SaaS Dashboard Top Navbar */}
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="font-extrabold text-xl text-blue-600 tracking-tight">
          AI Workspace
        </div>
        
        {/* User Identity Matrix & Signout Actions */}
        <div className="flex items-center gap-4">
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
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-none">{userProfile.name}</p>
              <p className="text-xs text-gray-500 mt-1">{userProfile.email}</p>
            </div>
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

      {/* Main Core Application Frame */}
      <main className="flex-1 p-6 md:p-12 max-w-4xl w-full mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">AI Content Generation Engine</h1>
          <p className="text-sm text-gray-500 mb-6">Create high-conversion copy utilizing verified pipeline pathways.</p>
          
          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-gray-800 transition-all text-base"
            rows={5}
            placeholder="Describe what you want the AI to draft..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button
            onClick={handleGenerate}
            disabled={isLoading || prompt.trim() === ""}
            className="w-full bg-blue-600 text-white font-semibold text-base py-3 px-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors shadow-sm"
          >
            {isLoading ? "Running pipeline analytics..." : "Execute Workspace Generation"}
          </button>

          {content && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Engine Output</h2>
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}