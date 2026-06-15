"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { jsPDF } from "jspdf";
import Navbar from "../../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import Link from "next/link";

import { 
  Copy, 
  FileText, 
  Download, 
  Star, 
  Loader2, 
  Sparkles, 
  Wand2, 
  Check,
  Type,
  Clock,
  LayoutTemplate,
  Zap,
  ArrowRight,
  BarChart2
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface AnalyticsData {
  totalGenerations: number;
  totalWords: number;
  templateUsage: number;
  activeStreak: number;
}

interface DashboardClientProps {
  userProfile: UserProfile;
  analytics: AnalyticsData;
}

interface GenerationState {
  id: string | null;
  isStarred: boolean;
}

const AI_TEMPLATES = [
  { id: "blog", icon: "📝", color: "from-blue-500/20 to-blue-600/5", title: "Blog Post", desc: "SEO-optimized articles", prompt: "Write a comprehensive, SEO-optimized blog post about [Insert Topic Here]. Include a catchy headline, an engaging introduction, 3-4 structured body paragraphs with subheadings, and a strong conclusion." },
  { id: "linkedin", icon: "💼", color: "from-sky-500/20 to-sky-600/5", title: "LinkedIn Post", desc: "Professional networking", prompt: "Write an engaging LinkedIn post about [Insert Topic/Insight Here]. Keep the tone professional but conversational. Use short paragraphs, include 3 relevant hashtags, and end with a question to drive engagement." },
  { id: "instagram", icon: "📸", color: "from-pink-500/20 to-pink-600/5", title: "Instagram Caption", desc: "Catchy social copy", prompt: "Write a catchy Instagram caption for a photo about [Insert Subject Here]. Include a hook, a short engaging story or description, relevant emojis, and 5-7 targeted hashtags." },
  { id: "email", icon: "✉️", color: "from-emerald-500/20 to-emerald-600/5", title: "Email Generator", desc: "Cold outreach & newsletters", prompt: "Write a professional email to [Target Audience/Person] regarding [Subject/Offer]. The tone should be persuasive and polite. Include a clear subject line, a personalized opening, the main value proposition, and a clear call-to-action (CTA)." },
  { id: "youtube", icon: "▶️", color: "from-red-500/20 to-red-600/5", title: "YouTube Script", desc: "Video hooks & outlines", prompt: "Create a YouTube video script outline about [Insert Video Topic]. Include a high-retention hook for the first 15 seconds, an intro, 4 main talking points, and an outro asking viewers to like and subscribe." },
  { id: "product", icon: "🛍️", color: "from-purple-500/20 to-purple-600/5", title: "Product Description", desc: "E-commerce conversions", prompt: "Write a compelling product description for [Insert Product Name/Type]. Highlight its top 3 features, explain the primary benefits to the customer, and use persuasive language to drive sales." }
];

export default function DashboardClient({ userProfile, analytics }: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [prompt, setPrompt] = useState("");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generationMeta, setGenerationMeta] = useState<GenerationState>({ id: null, isStarred: false });
  
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const computeMetrics = (text: string) => {
    const characters = text.length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { characters, words, readingTime };
  };

  const inputMetrics = computeMetrics(prompt);
  const outputMetrics = computeMetrics(content);

  // Core Pipeline Handler
  async function handleGenerate() {
    if (!prompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setContent("");
    setGenerationMeta({ id: null, isStarred: false });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (data.result) {
        setContent(data.result);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: dbRow, error } = await supabase
            .from("generations")
            .insert({
              user_id: user.id,
              prompt: prompt,
              result: data.result,
              is_favorite: false,
              template_id: activeTemplateId
            })
            .select("id")
            .single();

          if (!error && dbRow) {
            setGenerationMeta({ id: dbRow.id, isStarred: false });
          }
        }
        triggerToast("Content compiled successfully!");
        
        router.refresh(); 
      } else {
        setContent("Failed to compile generation. Ensure your API key is configured properly.");
      }
    } catch (error) {
      setContent("Network configuration error occurred while calling the workspace engine.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Template Click
  const handleTemplateClick = (templateId: string, templatePrompt: string) => {
    setPrompt(templatePrompt);
    setActiveTemplateId(templateId);
  };

  async function handleToggleStar() {
    if (!generationMeta.id) return;
    const targetState = !generationMeta.isStarred;
    setGenerationMeta(prev => ({ ...prev, isStarred: targetState }));

    const { error } = await supabase.from("generations").update({ is_favorite: targetState }).eq("id", generationMeta.id);

    if (error) {
      setGenerationMeta(prev => ({ ...prev, isStarred: !targetState }));
    } else {
      triggerToast(targetState ? "Saved to favorites!" : "Removed from favorites");
    }
  }

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setIsCopied(true);
    triggerToast("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadTXT = () => { /* Add logic if needed */ };
  const handleDownloadPDF = () => { /* Add logic if needed */ };

  const userFirstName = userProfile.name.split(" ")[0] || "User";

  const formatter = new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0A0A0A] flex flex-col font-sans transition-colors selection:bg-blue-200 dark:selection:bg-blue-900 overflow-hidden relative">
      
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-300">
          <div className="bg-green-500/25 text-green-400 dark:text-green-600 rounded-full p-1">
            <Check size={14} strokeWidth={3} />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/20 pointer-events-none" />

      <Navbar userProfile={userProfile} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 relative z-10">
        
        {/* SECTION 1: HERO & BENTO STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-200/80 dark:border-slate-800 p-8 shadow-sm flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="relative z-10">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100 dark:border-blue-500/20">
                <Sparkles size={12} className="animate-pulse" /> Workspace Active
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
                Welcome back, {userFirstName}.
              </h1>
              
              <p className="text-base text-gray-500 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
                Your content management framework is synced. Author programmatic text outputs, manage binary transformations, or configure analytics filters.
              </p>
              
            </div>
          </div>

          {/* DYNAMIC ANALYTICS GRID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-blue-500">
                  <FileText size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{formatter.format(analytics?.totalGenerations ?? 0)}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-500 font-medium mt-0.5">Generations</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-emerald-500">
                  <BarChart2 size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{formatter.format(analytics?.totalWords ?? 0)}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-500 font-medium mt-0.5">Words Written</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-purple-500">
                  <LayoutTemplate size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{formatter.format(analytics?.templateUsage ?? 0)}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-500 font-medium mt-0.5">Templates Used</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-orange-500">
                  <Zap size={16} />
                </div>
                {analytics.activeStreak > 0 && (
                   <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-md">
                     Fire!
                   </span>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{analytics?.activeStreak ?? 0} {(analytics?.activeStreak ?? 0) === 1 ? 'Day' : 'Days'}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-500 font-medium mt-0.5">Active Streak</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-slate-800/80" />

        {/* SECTION 2: TEMPLATE SCHEMA SELECTOR */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 ease-out fill-mode-both">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Quick Start Templates</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Inject tailored context directly into the text engine.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template.id, template.prompt)}
                className={`group flex items-start text-left p-5 backdrop-blur-sm rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden ${
                  activeTemplateId === template.id
                    ? "bg-blue-50/50 dark:bg-blue-500/5 border-blue-500 dark:border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:shadow-[0_0_20px_rgba(59,130,246,0.1)] ring-1 ring-blue-500/20 scale-[1.02]"
                    : "bg-white dark:bg-[#0e0e11] border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/5 hover:scale-[1.02]"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${template.color} transition-opacity duration-500 ${activeTemplateId === template.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                
                <div className="relative z-10 flex w-full">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shrink-0 mr-4 transition-all duration-300 ${
                    activeTemplateId === template.id
                      ? "bg-blue-500 text-white border-transparent shadow-md shadow-blue-500/20 scale-110"
                      : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-600 dark:text-slate-300 group-hover:scale-110 group-hover:border-transparent group-hover:bg-white/10"
                  }`}>
                    {template.icon}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-bold text-[15px] transition-colors truncate ${
                      activeTemplateId === template.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }`}>
                      {template.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2 font-medium">
                      {template.desc}
                    </p>
                  </div>
                  
                  <ArrowRight size={16} className={`transition-all duration-300 shrink-0 self-center ${
                    activeTemplateId === template.id
                      ? "text-blue-500 dark:text-blue-400 translate-x-1 opacity-100"
                      : "text-gray-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: TEXT CONTEXT RUNTIME UTILITY */}
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 ease-out fill-mode-both">
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-sm border border-gray-200/80 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/80 dark:bg-slate-900/80 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-[13px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Wand2 size={16} className="text-blue-500" /> Generative Input Console
              </h2>
              <div className="flex items-center gap-3 text-[12px] font-semibold text-gray-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm">
                <span>{inputMetrics.words} words</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600" />
                <span>{inputMetrics.characters} / 1000 chars</span>
              </div>
            </div>
            
            <div className="p-6">
              <textarea
                className="w-full h-[180px] bg-transparent border-none focus:ring-0 text-gray-800 dark:text-slate-200 text-base leading-relaxed resize-y placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none"
                placeholder="Describe your prompt requirements or trigger an abstract schema card metric from above..."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (e.target.value.trim() === "") setActiveTemplateId(null);
                }}
                maxLength={1000}
                disabled={isLoading}
              />
            </div>
            
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] py-3 px-8 rounded-xl disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-600 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98] disabled:active:scale-100 disabled:shadow-none cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin opacity-70" />
                    <span>Processing Pipeline Matrix...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    <span>Execute Asset Synthesis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: FLUID DATA DISPLAY LAYOUT */}
        <div className="space-y-4">
          {isLoading && (
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-gray-200/80 dark:border-slate-800 transition-colors animate-pulse space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Loader2 size={16} className="text-blue-500 animate-spin" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-32" />
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-full" />
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-[90%]" />
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-[95%]" />
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-[60%]" />
              </div>
            </div>
          )}

          {!content && !isLoading && (
            <div className="bg-white dark:bg-slate-900/30 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800/80 p-12 text-center transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 mx-auto mb-4">
                <Type size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-200 mb-1">Sandbox Execution Engine Cold</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500 max-w-sm mx-auto font-medium">
                No active payload context rendered inside the stream channel block. Submit an executive prompt matrix query above to spin up context threads.
              </p>
            </div>
          )}

          {content && !isLoading && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-gray-200/80 dark:border-slate-800/80 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-400 transition-all relative">
              <div className="px-6 py-4 bg-gray-50/70 dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Compiled Output
                  </h3>
                  <div className="flex items-center flex-wrap gap-2 text-[11px] font-semibold text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-gray-200/20">
                    <span>{outputMetrics.words} W</span>
                    <span className="w-0.5 h-2 bg-gray-300 dark:bg-slate-600" />
                    <span>{outputMetrics.characters} C</span>
                    <span className="w-0.5 h-2 bg-gray-300 dark:bg-slate-600" />
                    <span className="flex items-center gap-1 text-blue-500"><Clock size={10} /> ~{outputMetrics.readingTime}m Read</span>
                  </div>
                </div>
                
                <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
                  <button 
                    onClick={handleToggleStar}
                    disabled={!generationMeta.id}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 border rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      generationMeta.isStarred 
                        ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400" 
                        : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Star size={14} className={generationMeta.isStarred ? "fill-amber-500 text-amber-500" : ""} />
                    <span>{generationMeta.isStarred ? "Starred" : "Star Output"}</span>
                  </button>

                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer"
                  >
                    {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    <span>{isCopied ? "Copied!" : "Copy"}</span>
                  </button>

                  <button 
                    onClick={handleDownloadTXT}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>TXT</span>
                  </button>

                  <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer"
                  >
                    <Download size={14} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
              
              {/* REACT MARKDOWN RENDERER (CHATGPT STYLE) */}
              <div className="p-6 md:p-10 lg:p-12 bg-white dark:bg-[#0e0e11] shadow-inner selection:bg-blue-500/20 overflow-x-auto rounded-b-3xl">
                <div className="
                  w-full max-w-[750px] mx-auto
                  text-[15px] sm:text-[16px] text-gray-800 dark:text-[#ececec]
                  leading-[1.8] antialiased
                  
                  /* Paragraphs */
                  [&_p]:mb-6 [&_p:last-child]:mb-0
                  
                  /* Headings */
                  [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-4
                  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-gray-200 dark:[&_h2]:border-white/10 [&_h2]:pb-2
                  [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 dark:[&_h3]:text-slate-100 [&_h3]:mt-6 [&_h3]:mb-3
                  
                  /* Lists */
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul_li]:pl-1 [&_ul_li]:marker:text-gray-400 dark:[&_ul_li]:marker:text-slate-500
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2 [&_ol_li]:pl-1 [&_ol_li]:marker:text-gray-400 dark:[&_ol_li]:marker:text-slate-500
                  
                  /* Inline Formatting */
                  [&_strong]:font-semibold dark:[&_strong]:text-white
                  [&_em]:italic dark:[&_em]:text-slate-300
                  
                  /* Blockquotes */
                  [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 dark:[&_blockquote]:border-slate-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 dark:[&_blockquote]:text-slate-400
                  
                  /* Code Blocks */
                  [&_pre]:bg-gray-100 dark:[&_pre]:bg-[#0D0D12] [&_pre]:border border-gray-200 dark:[&_pre]:border-white/10 [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:text-[13px] sm:[&_pre]:text-sm [&_pre]:font-mono [&_pre]:shadow-inner
                  
                  /* Inline Code */
                  [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.9em] [&_:not(pre)>code]:bg-gray-100 dark:[&_:not(pre)>code]:bg-white/10 [&_:not(pre)>code]:text-blue-600 dark:[&_:not(pre)>code]:text-blue-300 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:break-words
                  
                  /* Dividers */
                  [&_hr]:border-t [&_hr]:border-gray-200 dark:[&_hr]:border-white/10 [&_hr]:my-8
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}