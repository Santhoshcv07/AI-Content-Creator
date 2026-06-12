"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { jsPDF } from "jspdf";
import Navbar from "../../components/Navbar"; // ➕ NEW: Master Navbar imported

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface DashboardClientProps {
  userProfile: UserProfile;
}

const AI_TEMPLATES = [
  { id: "blog", icon: "📝", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400", title: "Blog Post", desc: "SEO-optimized articles", prompt: "Write a comprehensive, SEO-optimized blog post about [Insert Topic Here]. Include a catchy headline, an engaging introduction, 3-4 structured body paragraphs with subheadings, and a strong conclusion." },
  { id: "linkedin", icon: "💼", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400", title: "LinkedIn Post", desc: "Professional networking", prompt: "Write an engaging LinkedIn post about [Insert Topic/Insight Here]. Keep the tone professional but conversational. Use short paragraphs, include 3 relevant hashtags, and end with a question to drive engagement." },
  { id: "instagram", icon: "📸", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400", title: "Instagram Caption", desc: "Catchy social copy", prompt: "Write a catchy Instagram caption for a photo about [Insert Subject Here]. Include a hook, a short engaging story or description, relevant emojis, and 5-7 targeted hashtags." },
  { id: "email", icon: "✉️", color: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400", title: "Email Generator", desc: "Cold outreach & newsletters", prompt: "Write a professional email to [Target Audience/Person] regarding [Subject/Offer]. The tone should be persuasive and polite. Include a clear subject line, a personalized opening, the main value proposition, and a clear call-to-action (CTA)." },
  { id: "youtube", icon: "▶️", color: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400", title: "YouTube Script", desc: "Video hooks & outlines", prompt: "Create a YouTube video script outline about [Insert Video Topic]. Include a high-retention hook for the first 15 seconds, an intro, 4 main talking points, and an outro asking viewers to like and subscribe." },
  { id: "product", icon: "🛍️", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400", title: "Product Description", desc: "E-commerce conversions", prompt: "Write a compelling product description for [Insert Product Name/Type]. Highlight its top 3 features, explain the primary benefits to the customer, and use persuasive language to drive sales." }
];

export default function DashboardClient({ userProfile }: DashboardClientProps) {
  const supabase = createClient();

  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function handleGenerate() {
    setIsLoading(true);
    setContent("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await response.json();
      
      if (data.result) {
        setContent(data.result);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("generations").insert({
            user_id: user.id,
            prompt: prompt,
            result: data.result,
          });
        }
      } else {
        setContent("Failed to compile generation. Ensure your API key is configured.");
      }
    } catch (error) {
      setContent("Network configuration error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!content) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("AI Content Generation", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, 30);
    doc.save("AI_Workspace_Export.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors">
      
      {/* ➕ NEW: The entire navigation bar is now just this one line! */}
      <Navbar userProfile={userProfile} />

      <main className="flex-1 p-6 md:p-12 max-w-5xl w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Content</h1>
          <p className="text-gray-500 dark:text-slate-400">Select a template to get started, or write your own custom prompt below.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {AI_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setPrompt(template.prompt)}
              className="flex items-start text-left p-5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 mr-4 ${template.color}`}>
                {template.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {template.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {template.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
          <h2 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">Workspace Engine</h2>
          
          <textarea
            className="w-full p-4 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-slate-100 transition-all text-base"
            rows={6}
            placeholder="Describe what you want the AI to draft, or click a template above..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button
            onClick={handleGenerate}
            disabled={isLoading || prompt.trim() === ""}
            className="w-full bg-blue-600 text-white font-semibold text-base py-3 px-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-500 transition-colors shadow-sm"
          >
            {isLoading ? "Running pipeline analytics..." : "Execute Workspace Generation"}
          </button>

          {content && (
            <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Engine Output (Saved to History)</h2>
                
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                    {isCopied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                  <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                    📄 PDF
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {content}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}