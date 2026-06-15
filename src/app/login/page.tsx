"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import Link from "next/link";
import { motion } from "framer-motion";

import { 
  Sparkles, 
  Loader2, 
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0A0A0A] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* ========================================== */}
      {/* AMBIENT BACKGROUND AURORAS                 */}
      {/* ========================================== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* ========================================== */}
      {/* LEFT PANE: PRODUCT SHOWCASE                */}
      {/* ========================================== */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-center items-center p-12 border-r border-white/5 overflow-hidden z-10">
        
        {/* Branding Header */}
        <div className="flex items-center gap-2.5 group mb-8">
  {/* Custom Black/White Logo */}
  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-black dark:bg-white shadow-sm transition-all duration-300">
    <Sparkles size={16} className="text-white dark:text-black" strokeWidth={2.5} />
  </div>
  {/* Text Branding */}
  <span className="font-extrabold text-[19px] tracking-tight text-gray-900 dark:text-white transition-colors">
    AI <span className="text-blue-600 dark:text-blue-400">Content Creator</span>
  </span>
</div>
        {/* Realistic Dashboard Preview in Glass Window */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 80, damping: 20 }}
          className="relative w-full max-w-2xl perspective-1000 mt-8"
        >
          {/* Ambient Glow behind image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/20 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)] overflow-hidden transform -rotate-y-2 -rotate-x-2 rotate-z-1">
            {/* macOS Window Controls */}
            <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              </div>
            </div>
            {/* Actual Screenshot */}
            <div className="relative bg-[#0A0A0A]">
              <img 
                src="/dashboard.png" 
                alt="Dashboard Preview" 
                className="w-full h-auto object-cover opacity-90"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* RIGHT PANE: AUTHENTICATION PANEL           */}
      {/* ========================================== */}
      <div className="w-full lg:w-[45%] relative flex flex-col items-center justify-center p-6 sm:p-12 z-20">
        
        {/* Mobile Logo (Hidden on Desktop) */}
        <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 font-extrabold text-xl tracking-tight text-white">
          <div className="w-7 h-7 rounded-md bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Sparkles size={14} className="text-white" strokeWidth={2.5} />
          </div>
          AI Workspace
        </Link>

        {/* Back to Home Link */}
        <Link href="/" className="absolute top-8 right-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to website
        </Link>

        {/* The Glassmorphism Auth Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              Log in to your Workspace
            </h1>
            <p className="text-[15px] text-slate-400 font-medium leading-relaxed">
              Authenticate to securely access your content pipelines.
            </p>
          </div>

          {/* Error State */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[14px] font-medium rounded-xl flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </motion.div>
          )}

          {/* Premium Glow Wrapped Google Button */}
          <div className="relative group mb-8">
            {/* The underlying animated gradient glow */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
            
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              type="button"
              className="relative w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-[#0A0A0A] font-bold text-[15px] tracking-wide py-4 px-4 rounded-xl transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin text-slate-500" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                  <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.74 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.09H2.18V16.93C4.06 20.66 7.99 23 12 23Z" fill="#34A853"/>
                  <path d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.07H2.18C1.41 8.6 1 10.25 1 12C1 13.75 1.41 15.4 2.18 16.93L5.84 14.09Z" fill="#FBBC05"/>
                  <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.99 1 4.06 3.34 2.18 7.07L5.84 9.91C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
                </svg>
              )}
              {isLoading ? "Authenticating session..." : "Continue with Google"}
            </button>
          </div>

          {/* Separation Line */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Workspace Features</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          {/* Enterprise Feature List under Button */}
          <div className="space-y-4 px-2 mb-10">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
              <div className="p-1 rounded-full bg-blue-500/10 text-blue-400">
                <CheckCircle2 size={16} />
              </div>
              Real-time AI Content Generation
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
              <div className="p-1 rounded-full bg-purple-500/10 text-purple-400">
                <CheckCircle2 size={16} />
              </div>
              Advanced Analytics Dashboard
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
              <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={16} />
              </div>
              Secure Cloud Storage sync
            </div>
          </div>

          {/* Terms & Trust Badges */}
          <p className="text-[12px] leading-relaxed text-slate-600 font-medium text-center lg:text-left">
            By authenticating, you agree to our Terms of Service and Privacy Policy. All database transactions are strictly encrypted.
          </p>

        </motion.div>
      </div>
    </div>
  );
}