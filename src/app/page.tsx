"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes"; 
import { 
  motion, 
  Variants, 
  useInView, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  AnimatePresence 
} from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  FileText, 
  Shield, 
  CheckCircle2, 
  TerminalSquare, 
  Star,
  Quote,
  Database,
  Wind,
  Code2,
  Triangle,
  Check,
  Sun,
  Moon
} from "lucide-react";

// --- THEME TOGGLE COMPONENT ---
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; 
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 dark:border-white/5 dark:bg-[#0A0A0A] dark:hover:bg-white/5 transition-colors group overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-white group-hover:text-amber-400 transition-colors"
          >
            <Moon size={16} strokeWidth={2.5} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-900 group-hover:text-amber-500 transition-colors"
          >
            <Sun size={16} strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// --- ANIMATED COUNTER COMPONENT ---
function AnimatedCounter({ 
  value, 
  suffix = "", 
  prefix = "", 
  decimals = 0 
}: { 
  value: number; 
  suffix?: string; 
  prefix?: string; 
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  const displayValue = useTransform(springValue, (latest) => {
    return prefix + latest.toFixed(decimals) + suffix;
  });

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

// --- MAIN PAGE COMPONENT ---
export default function LandingPage() {
  
  // --- MASTER PHYSICS & STAGGER VARIANTS ---
  const scrollStaggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 } 
    }
  };

  const viewportSettings = { once: true, amount: 0.1 };

  return (
<div className="min-h-screen text-slate-900 dark:text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* --- FULL PAGE GLASSMORPHISM BACKGROUND --- */}
      <div className="fixed inset-0 z-[-1] bg-slate-100 dark:bg-[#0A0A0A] transition-colors duration-500 overflow-hidden">
        
        {/* Animated Ambient Glowing Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/30 dark:bg-blue-600/20 blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-400/30 dark:bg-indigo-600/20 blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '11s' }} />
        
        {/* The Frosted Glass Overlay */}
        <div className="absolute inset-0 bg-white/50 dark:bg-black/40 backdrop-blur-[80px] pointer-events-none" />
      </div>
      
      <style>{`
        @keyframes slide-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-slide-right {
          animation: slide-right 30s linear infinite; 
        }
        .marquee-group:hover .animate-slide-right {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- AMBIENT AURORA BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* --- NAVIGATION --- */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full border-b border-slate-200/50 dark:border-white/5 bg-slate-100/30 dark:bg-[#0A0A0A]/30 backdrop-blur-md z-50 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
         <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-black dark:bg-white shadow-sm group-hover:scale-105 transition-all duration-300">
              <Sparkles size={16} className="text-white dark:text-black" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-[19px] tracking-tight text-gray-900 dark:text-white transition-colors">
              AI <span className="text-blue-600 dark:text-blue-400">Content Creator</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="text-sm font-bold bg-slate-950 text-white dark:bg-white dark:text-black px-5 py-2 rounded-full hover:bg-slate-800 dark:hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10 flex flex-col items-center pt-32 pb-16">
        
        {/* --- HERO SECTION --- */}
        <motion.div 
          className="max-w-5xl mx-auto px-6 text-center mt-12 mb-20"
          variants={scrollStaggerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/3 border border-slate-200 dark:border-white/8 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-widest mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Gemini 1.5 Flash Integrated
          </motion.div>
          
          <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-950 dark:text-white tracking-tighter mb-8 leading-[1.1]">
            Write better content, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              10x faster than before.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            The all-in-one generative workspace for modern creators. Engineer blogs, orchestrate outreach, and automate social pipelines with enterprise-grade contextual AI.
          </motion.p>
          
          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-950 text-white dark:bg-white dark:text-black font-bold text-base px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
            >
              Start Generating Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="https://github.com" 
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/3 border border-slate-200 dark:border-white/80 hover:bg-slate-200 dark:hover:bg-white/8 text-slate-900 dark:text-white font-bold text-base px-8 py-4 rounded-full transition-all backdrop-blur-md"
            >
              <TerminalSquare size={18} /> View Source
            </Link>
          </motion.div>
        </motion.div>

        {/* --- INFINITE SCROLLING TECH STACK --- */}
        <motion.div 
          variants={scrollStaggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="w-full overflow-hidden mb-24 md:mb-32 text-center relative"
        >
          <motion.p variants={fadeUpVariant} className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-10">
            Powered by enterprise-grade technologies
          </motion.p>
          
          <motion.div variants={fadeUpVariant} className="marquee-group relative w-full flex overflow-hidden">
           <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-linear-to-r from-slate-100 dark:from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-linear-to-l from-slate-100 dark:from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
            <div className="flex w-max animate-slide-right">
              {[
                { name: "Next.js", icon: TerminalSquare },
                { name: "Supabase", icon: Database },
                { name: "Gemini", icon: Sparkles },
                { name: "Vercel", icon: Triangle },
                { name: "Tailwind CSS", icon: Wind },
                { name: "TypeScript", icon: Code2 },
                { name: "Next.js", icon: TerminalSquare },
                { name: "Supabase", icon: Database },
                { name: "Gemini", icon: Sparkles },
                { name: "Vercel", icon: Triangle },
                { name: "Tailwind CSS", icon: Wind },
                { name: "TypeScript", icon: Code2 },
              ].map((brand, i) => (
                <div 
                  key={i} 
                  className="group flex items-center gap-2.5 text-slate-700 hover:text-slate-950 dark:text-slate-500/70 dark:hover:text-white transition-all duration-300 cursor-pointer grayscale hover:grayscale-0 mx-8 md:mx-16"
                >
                  <brand.icon size={22} strokeWidth={2.5} className="group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300" />
                  <span className="font-extrabold text-xl tracking-tight whitespace-nowrap">{brand.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* --- REAL DASHBOARD SCREENSHOT --- */}
        <motion.div 
          variants={scrollStaggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="w-full max-w-6xl mx-auto px-6 mb-32 perspective-1000"
        >
          <motion.div variants={fadeUpVariant} className="relative rounded-2xl md:rounded-4xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)] p-2 md:p-4 transition-colors duration-300">
            
            <div className="flex items-center px-4 pb-4 pt-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-red-500 dark:bg-slate-700 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-amber-500 dark:bg-slate-700 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-green-500 dark:bg-slate-700 transition-colors" />
              </div>
            </div>

            <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0A0A0A]">
              <img 
                src="/dashboard.png" 
                alt="AI Workspace Dashboard Platform Screenshot" 
                className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-700 ease-out"
              />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-slate-100 dark:from-[#0A0A0A] to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>

        {/* --- ANIMATED STATS --- */}
        <motion.div 
          variants={scrollStaggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="w-full border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/1 py-12 mb-32 transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200 dark:divide-white/5">
            <motion.div variants={fadeUpVariant}>
              <div className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-1">
                <AnimatedCounter value={50} suffix="M+" />
              </div>
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Words Generated</div>
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <div className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-1">
                <AnimatedCounter value={99.9} decimals={1} suffix="%" />
              </div>
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-widest">API Uptime</div>
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <div className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-1">
                <AnimatedCounter value={200} prefix="<" suffix="ms" />
              </div>
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Latency</div>
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <div className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-1">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-widest">Data Encrypted</div>
            </motion.div>
          </div>
        </motion.div>

        {/* --- FEATURE CARDS --- */}
        <motion.div 
          variants={scrollStaggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="w-full max-w-7xl mx-auto px-6 mb-32"
        >
          <motion.div variants={fadeUpVariant} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-4">Architected for scale.</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Everything you need to deploy production-ready content streams.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fadeUpVariant} whileHover={{ y: -5 }} className="group p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/[0.05] hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all shadow-lg hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-3 tracking-tight">Real-time Synthesis</h3>
              <p className="text-slate-700 dark:text-slate-400 leading-relaxed text-sm">
                Experience lightning-fast content synthesis powered by Google's latest Gemini AI models. Streaming data delivery means zero wait times.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} whileHover={{ y: -5 }} className="group p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/[0.05] hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all shadow-lg hover:shadow-purple-500/10">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-3 tracking-tight">Asset Management</h3>
              <p className="text-slate-700 dark:text-slate-400 leading-relaxed text-sm">
                Export directly to TXT or beautifully compiled PDF documents. Star your favorite generations to save them permanently to your database.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} whileHover={{ y: -5 }} className="group p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/[0.05] hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/10">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-3 tracking-tight">Enterprise Security</h3>
              <p className="text-slate-700 dark:text-slate-400 leading-relaxed text-sm">
                Your data is protected by Supabase Row Level Security. Atomic database transactions ensure credits and history belong strictly to you.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* --- TESTIMONIALS --- */}
        <motion.div 
          variants={scrollStaggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="w-full max-w-7xl mx-auto px-6 mb-32 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-200/50 dark:bg-blue-500/5 blur-[120px] pointer-events-none rounded-full transition-colors duration-300" />
          
          <motion.div variants={fadeUpVariant} className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-4">
              What creators are saying.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Join thousands of professionals accelerating their workflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              {
                name: "Alex Rivera",
                role: "Content Creator",
                image: "https://i.pravatar.cc/150?u=creator",
                quote: "As a solo creator, this workspace feels like having a full-time writing team. I can draft YouTube scripts, engaging hooks, and social posts in minutes instead of hours."
              },
              {
                name: "Samantha Lee",
                role: "Marketing Manager",
                image: "https://i.pravatar.cc/150?u=marketing",
                quote: "The ability to generate SEO-optimized articles and targeted outreach emails natively within one unified dashboard has completely streamlined our marketing pipeline."
              },
              {
                name: "David Chen",
                role: "Startup Founder",
                image: "https://i.pravatar.cc/150?u=founder",
                quote: "When you're building a startup, speed is everything. AI Workspace gives us the content velocity we need to scale our brand presence without needing to hire an expensive agency."
              }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                variants={fadeUpVariant}
                whileHover={{ y: -5 }}
                className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] hover:border-slate-300 dark:hover:border-white/[0.1] hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.05)] overflow-hidden flex flex-col justify-between"
              >
                <Quote className="absolute -top-4 -right-4 w-24 h-24 text-slate-200 dark:text-white/[0.02] -rotate-12 transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-slate-300 dark:group-hover:text-white/5" />

                <div>
                  <div className="flex items-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-800 dark:text-slate-300 text-[15px] leading-relaxed mb-8 relative z-10">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 relative z-10 border-t border-slate-200 dark:border-white/[0.05] pt-6 mt-auto">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-white/[0.1] grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <div>
                    <h4 className="text-slate-950 dark:text-white text-sm font-bold tracking-tight">{testimonial.name}</h4>
                    <p className="text-slate-600 dark:text-slate-500 text-xs font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* --- PRICING TIERS --- */}
        <motion.div 
          variants={scrollStaggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="w-full max-w-7xl mx-auto px-6 mb-32"
        >
          <motion.div variants={fadeUpVariant} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-4">Simple, transparent pricing.</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Start for free, upgrade when you need to scale.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div variants={fadeUpVariant} className="p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] flex flex-col transition-colors duration-300">
              <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">Hobby</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">For casual creators trying out the platform.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-950 dark:text-white">$0</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-300">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> 10 Free Generations / mo
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-300">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> Basic Templates
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-300">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> Community Support
                </li>
              </ul>
              <Link href="/login" className="w-full py-3 px-4 rounded-xl font-bold text-sm text-center bg-slate-950 text-white dark:bg-white/[0.05] hover:bg-slate-800 dark:hover:bg-white/[0.1] dark:text-white transition-colors border border-slate-950 dark:border-white/[0.05]">
                Get Started
              </Link>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="p-8 rounded-3xl bg-linear-to-b from-blue-100 to-white dark:from-blue-900/20 dark:to-[#0A0A0A] border border-blue-200 dark:border-blue-500/30 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(59,130,246,0.1)] dark:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">Pro</h3>
              <p className="text-blue-950/70 dark:text-blue-200/70 text-sm mb-6">For professionals scaling their output.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-950 dark:text-white">$19</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-950 dark:text-slate-100">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> Unlimited Generations
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-950 dark:text-slate-100">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> Advanced Custom Templates
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-950 dark:text-slate-100">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> Export to PDF & TXT
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-950 dark:text-slate-100">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> Priority Support
                </li>
              </ul>
              <Link href="/login" className="w-full py-3 px-4 rounded-xl font-bold text-sm text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors shadow-lg shadow-blue-500/25">
                Upgrade to Pro
              </Link>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] flex flex-col transition-colors duration-300">
              <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">Enterprise</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">For teams requiring custom integrations.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-950 dark:text-white">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-300">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> Everything in Pro
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-300">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> Custom AI Fine-tuning
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-300">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> Dedicated Account Manager
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-300">
                  <Check size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" /> SSO & Advanced Security
                </li>
              </ul>
              <Link href="/login" className="w-full py-3 px-4 rounded-xl font-bold text-sm text-center bg-slate-950 text-white dark:bg-white/[0.05] hover:bg-slate-800 dark:hover:bg-white/[0.1] dark:text-white transition-colors border border-slate-950 dark:border-white/[0.05]">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* --- BOTTOM CTA --- */}
        <motion.div 
          variants={scrollStaggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="w-full max-w-5xl mx-auto px-6 mb-32 CTA-section"
        >
          <motion.div variants={fadeUpVariant} className="relative rounded-4xl border border-slate-200 dark:border-white/8 bg-linear-to-b from-slate-100 dark:from-white/5 to-white dark:to-transparent p-12 md:p-20 text-center overflow-hidden transition-colors duration-300 CTA-content">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-200 dark:bg-blue-500/10 blur-[100px] pointer-events-none transition-colors duration-300" />
            
            <h2 className="CTA-title relative z-10 text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-8 transition-colors duration-300">Ready to transform your workflow?</h2>
            
            <div className="CTA-checks relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 transition-colors duration-300">
              <div className="CTA-check-item flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors duration-300">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 CTA-check-icon" /> Free to start
              </div>
              <div className="CTA-check-item flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors duration-300">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 CTA-check-icon" /> No setup required
              </div>
              <div className="CTA-check-item flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors duration-300">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 CTA-check-icon" /> Cancel anytime
              </div>
            </div>
            
            <Link 
              href="/login"
              className="CTA-button relative z-10 inline-flex items-center justify-center gap-2 bg-slate-950 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-200 font-bold text-base px-10 py-4 rounded-full transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
            >
              Start Generating <Zap size={18} className="fill-black dark:fill-white dark:group-hover:fill-slate-900 Transition-all CTA-zap-icon" />
            </Link>
          </motion.div>
        </motion.div>

      </main>

      {/* --- ENTERPRISE FOOTER --- */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportSettings}
        transition={{ duration: 1 }}
        className="border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0A0A0A] pt-16 pb-8 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-6 gap-8 mb-16">
       <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 group mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-black dark:bg-white shadow-sm group-hover:scale-105 transition-all duration-300">
                <Sparkles size={16} className="text-white dark:text-black" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-[19px] tracking-tight text-gray-900 dark:text-white transition-colors">
                AI <span className="text-blue-600 dark:text-blue-400">Content Creator</span>
              </span>
            
            
            
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-500 max-w-xs leading-relaxed">
              Building the future of generative content architecture. Engineered for scale, speed, and precision.
            </p>
          </div>
          
          <div>
            <h4 className="text-slate-950 dark:text-white font-bold mb-4 tracking-tight">Product</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-500">
              <li><Link href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-slate-950 dark:hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-slate-950 dark:text-white font-bold mb-4 tracking-tight">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-500">
              <li><Link href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="https://github.com" target="_blank" className="hover:text-slate-950 dark:hover:text-white transition-colors">GitHub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-950 dark:text-white font-bold mb-4 tracking-tight">Company</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-500">
              <li><Link href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-950 dark:text-white font-bold mb-4 tracking-tight">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-500">
              <li><Link href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-300">
          <p className="text-xs text-slate-600 dark:text-slate-600 font-medium">
            © {new Date().getFullYear()} AI Workspace Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-600">
            <span>Built with Next.js App Router</span>
            <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span>Supabase</span>
            <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span>Tailwind v4</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}