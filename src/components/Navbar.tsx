"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "../utils/supabase/client";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, Sparkles } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export default function Navbar({ userProfile }: { userProfile: UserProfile }) {
  // Add this inside your component function
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const router = useRouter();
  const pathname = usePathname();
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
    <nav className="sticky top-0 z-50 bg-[#050505]/70 backdrop-blur-xl border-b border-white/10 transition-colors duration-500">
      
      <div className="px-6 py-4 flex justify-between items-center w-full max-w-[1400px] mx-auto">
        
        {/* Left Side: Logo & Desktop Links */}
        <div className="flex items-center gap-6">
          
        {/* Custom Black/White Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group mr-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-black dark:bg-white shadow-sm group-hover:scale-105 transition-all duration-300">
              <Sparkles size={16} className="text-white dark:text-black" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-[19px] tracking-tight text-gray-900 dark:text-white transition-colors">
              AI <span className="text-blue-600 dark:text-blue-400">Content Creator</span>
            </span>
          </Link>
          {/* Vertical Divider */}
          <div className="hidden md:block w-px h-5 bg-gray-300 dark:bg-white/10"></div>

          {/* Desktop Navigation with Slide Animation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`group relative text-[14px] px-1 py-1 transition-all duration-300 ease-out flex items-center ${
                    isActive 
                      ? "font-bold text-blue-600 dark:text-blue-500" 
                      : "font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:translate-x-1.5"
                  }`}
                >
                  {link.name}
                  
                  {/* Left-to-Right Animated Underline */}
                  <span 
                    className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Right Side: Theme, Profile, Mobile Toggle */}
        <div className="flex items-center gap-4 sm:gap-6">

          <div className="hidden md:flex items-center gap-3">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-9 h-9 rounded-full border border-gray-200 dark:border-white/10 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-200 dark:border-slate-700">
                {userProfile.name.charAt(0)}
              </div>
            )}

            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-bold text-gray-900 dark:text-white">
                {userProfile.name}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-slate-400">
                {userProfile.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden md:block text-sm font-semibold text-gray-700 dark:text-slate-200 border border-gray-300 dark:border-slate-700 bg-transparent rounded-lg px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isLoggingOut ? "..." : "Log out"}
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button 
            className="md:hidden p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 dark:border-white/10 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl px-6 py-4 flex flex-col space-y-4 absolute w-full shadow-2xl animate-in slide-in-from-top-2 fade-in duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center text-[15px] px-3 py-2.5 rounded-lg transition-all duration-300 ease-out ${
                  isActive 
                    ? "font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 translate-x-2" 
                    : "font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:translate-x-2"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <hr className="border-gray-200/50 dark:border-white/10 my-1" />
          <button
            onClick={handleLogout}
            className="text-left text-[15px] font-bold text-red-600 dark:text-red-400 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}