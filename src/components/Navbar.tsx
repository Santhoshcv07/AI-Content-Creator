"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "../utils/supabase/client";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export default function Navbar({ userProfile }: { userProfile: UserProfile }) {
  const router = useRouter();
  const pathname = usePathname(); // ➕ NEW: Tells us what page we are currently on
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Engine", href: "/dashboard" },
    { name: "History", href: "/history" },
    { name: "Analytics", href: "/analytics" },
    { name: "Settings", href: "/settings" },
  ];

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Logout exception:", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="px-6 py-4 flex justify-between items-center">
        
        {/* Left Side: Logo & Desktop Links */}
        <div className="flex items-center gap-6">
          <div className="font-extrabold text-xl text-blue-600 dark:text-blue-400 tracking-tight">
            AI Workspace
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 border-l border-gray-200 dark:border-slate-700 pl-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-sm transition-colors ${
                    isActive 
                      ? "font-bold text-blue-600 dark:text-blue-400" 
                      : "font-semibold text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Right Side: Theme, Profile, Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-6">

  <div className="hidden md:flex items-center gap-3">
    {userProfile.avatarUrl ? (
      <img
        src={userProfile.avatarUrl}
        alt={userProfile.name}
        className="w-10 h-10 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm"
        referrerPolicy="no-referrer"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
        {userProfile.name.charAt(0)}
      </div>
    )}

    <div className="flex flex-col leading-tight">
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {userProfile.name}
      </span>

      <span className="text-xs text-gray-500 dark:text-slate-400">
        {userProfile.email}
      </span>
    </div>
  </div>

  <ThemeToggle />

  <button
    onClick={handleLogout}
    disabled={isLoggingOut}
    className="hidden md:block text-sm font-medium text-gray-600 dark:text-slate-300 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800"
  >
    {isLoggingOut ? "Exiting..." : "Log out"}
  </button>

          {/* Mobile Menu Hamburger Button */}
          <button 
            className="md:hidden p-2 text-gray-600 dark:text-slate-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 flex flex-col space-y-4 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg ${isActive ? "font-bold text-blue-600 dark:text-blue-400" : "font-semibold text-gray-600 dark:text-slate-300"}`}
              >
                {link.name}
              </Link>
            );
          })}
          <hr className="border-gray-200 dark:border-slate-800" />
          <button
            onClick={handleLogout}
            className="text-left text-lg font-bold text-red-600 dark:text-red-400"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}