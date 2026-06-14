"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import Navbar from "../../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Search,
  Star,
  Clock,
  Copy,
  Trash2,
  Check,
  FileText,
  AlertTriangle
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface Generation {
  id: string;
  prompt: string;
  result: string;
  is_favorite: boolean;
  created_at: string;
}

interface HistoryClientProps {
  userProfile: UserProfile;
  initialGenerations: Generation[];
}

export default function HistoryClient({ userProfile, initialGenerations }: HistoryClientProps) {
  const supabase = createClient();
  
  // State Management
  const [generations, setGenerations] = useState<Generation[]>(initialGenerations);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Derived State: Filter the generations based on Search and Tabs
  const filteredGenerations = generations.filter((gen) => {
    const matchesSearch = 
      gen.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || 
      gen.result.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "favorites" ? gen.is_favorite === true : true;
    return matchesSearch && matchesTab;
  });

  // Action: Copy to Clipboard
  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Action: Toggle Star/Favorite
  const handleToggleStar = async (id: string, currentState: boolean) => {
    const newState = !currentState;
    
    // Optimistic UI Update
    setGenerations((prev) => 
      prev.map((g) => g.id === id ? { ...g, is_favorite: newState } : g)
    );

    const { error } = await supabase
      .from("generations")
      .update({ is_favorite: newState })
      .eq("id", id);

    if (error) {
      console.error("Failed to update favorite status");
      // Revert on failure
      setGenerations((prev) => 
        prev.map((g) => g.id === id ? { ...g, is_favorite: currentState } : g)
      );
    }
  };

  // Action: Delete Generation
  const handleDelete = async (id: string) => {
    
    // Optimistic UI Update
    setGenerations((prev) => prev.filter((g) => g.id !== id));

    const { error } = await supabase
      .from("generations")
      .delete()
      .eq("id", id);
      
      console.log("Deleting ID:", id);
console.log("Delete Error:", error);

    if (error) {
      console.error("Failed to delete generation");
      alert("Failed to delete. Please try again.");
    }
  };

  return (
   <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500 p-6 md:p-8">
  

      <Navbar userProfile={userProfile} />

      <main className="flex-1 p-4 md:p-12 max-w-5xl w-full mx-auto space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Content History</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">View, search, and manage all your past AI generations.</p>
          </div>

          <div className="w-full md:w-auto relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search prompts or outputs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-72 pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-slate-100 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Filters / Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-px">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "all" 
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" 
                : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            All Generations
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "favorites" 
                ? "border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400" 
                : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            <Star size={16} className={activeTab === "favorites" ? "fill-current" : ""} />
            Favorites
          </button>
        </div>

        {/* Content Feed */}
        <div className="space-y-6">
          {filteredGenerations.length === 0 ? (
           <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/20 backdrop-blur-3xl shadow-sm dark:shadow-none rounded-3xl p-6 transition-all duration-300">
              <FileText size={32} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-200 mb-1">No results found</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                {searchQuery 
                  ? "We couldn't find anything matching your search." 
                  : activeTab === "favorites" 
                    ? "You haven't starred any generations yet." 
                    : "You haven't generated any content yet."}
              </p>
            </div>
          ) : (
            filteredGenerations.map((gen) => (
              <div key={gen.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col">
                
                {/* Card Header: Prompt & Metadata */}
                <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800 flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate mb-1">
                      {gen.prompt}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 font-medium">
                      <Clock size={12} />
                      {new Date(gen.created_at).toLocaleDateString(undefined, { 
                        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleToggleStar(gen.id, gen.is_favorite)}
                      className={`p-2 rounded-lg transition-colors ${
                        gen.is_favorite 
                          ? "bg-amber-50 dark:bg-amber-900/30 text-amber-500" 
                          : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                      title={gen.is_favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star size={16} className={gen.is_favorite ? "fill-current" : ""} />
                    </button>
                    <button 
                      onClick={() => handleCopy(gen.id, gen.result)}
                      className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Copy result"
                    >
                      {copiedId === gen.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                    <button 
                     onClick={() => {
  setItemToDelete(gen.id);
  setIsDeleteModalOpen(true);
}}
                     className="
p-2 text-gray-400
rounded-lg
transition-all duration-300
hover:bg-red-500/10
hover:text-red-500
hover:scale-110
hover:rotate-6
hover:shadow-lg
"
                      title="Delete generation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Card Body: Result */}
                <div className="p-6 text-[15px] sm:text-base text-gray-800 dark:text-[#ececec] font-sans antialiased whitespace-pre-wrap leading-[1.8] max-h-96 overflow-y-auto custom-scrollbar">
  {gen.result
    ? gen.result
        .replace(/(\*\*|__)(.*?)\1/g, "$2")         // Remove bold
        .replace(/(\*|_)(.*?)\1/g, "$2")            // Remove italics
        .replace(/~~(.*?)~~/g, "$1")                // Remove strikethrough
        .replace(/`{3}[\s\S]*?`{3}/g, "[Code Block]") // Collapse code blocks
        .replace(/`(.+?)`/g, "$1")                  // Remove inline code
        .replace(/^#+\s+/gm, "")                    // Remove headings
        .replace(/^\s*[*\-+]\s+/gm, "• ")           // Clean bullet points
        .replace(/^\s*\d+\.\s+/gm, "")              // Remove numbered lists (optional, keeps numbers out)
        .replace(/!\[.*?\]\(.*?\)/g, "[Image]")     // Remove images
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")    // Remove links, keep text
        .replace(/^>+\s?/gm, "")                    // Remove blockquotes
        .replace(/^-{3,}/gm, "")                    // Remove horizontal rules
        .trim()
    : "No content generated."}
</div>
              </div>
            ))
          )}
        </div>

      </main>
      {isDeleteModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    onClick={() => setIsDeleteModalOpen(false)}
  >
    <div
     className="
bg-[#0e0e11]
border border-white/10
rounded-3xl
p-8
w-full max-w-sm
shadow-2xl
shadow-red-500/10
animate-in zoom-in-95 duration-300
"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="text-red-500" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white text-center mb-2">
        Delete Generation?
      </h3>

      <p className="text-slate-400 text-center mb-6">
        This action cannot be undone.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="flex-1 py-3 rounded-xl bg-white/5 text-slate-300"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (itemToDelete) handleDelete(itemToDelete);
            setIsDeleteModalOpen(false);
          }}
          className="
flex-1 py-3 rounded-xl
bg-red-600 text-white font-semibold
transition-all duration-300 ease-out
hover:bg-red-500
hover:shadow-[0_0_25px_rgba(239,68,68,0.45)]
hover:scale-105
active:scale-95
cursor-pointer
"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}