import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center transition-colors duration-500">
      <div className="relative group bg-white/50 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/20 p-6 rounded-3xl shadow-lg flex flex-col items-center gap-4">
        {/* Animated Icon */}
        <div className="animate-spin text-purple-600 dark:text-purple-400">
          <Sparkles size={32} strokeWidth={2} />
        </div>
        <p className="text-slate-900 dark:text-white font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}