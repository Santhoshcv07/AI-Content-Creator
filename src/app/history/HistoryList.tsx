"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";

interface GenerationRecord {
  id: string;
  prompt: string;
  result: string;
  created_at: string;
}

export default function HistoryList({ initialData }: { initialData: GenerationRecord[] }) {
  const supabase = createClient();
  const [generations, setGenerations] = useState<GenerationRecord[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ➕ NEW: Delete Functionality
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    setDeletingId(id);
    const { error } = await supabase.from("generations").delete().eq("id", id);
    
    if (!error) {
      setGenerations(generations.filter((item) => item.id !== id));
    } else {
      console.error("Failed to delete:", error);
    }
    setDeletingId(null);
  };

  // ➕ NEW: Search Filter Logic
  const filteredGenerations = generations.filter((item) => 
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.result.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search your history by prompt or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {filteredGenerations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-500">No results found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredGenerations.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md relative group">
              
              {/* Delete Button (Appears on hover) */}
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold shadow-sm"
              >
                {deletingId === item.id ? "Deleting..." : "🗑️ Delete"}
              </button>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 pr-20">
                <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg max-w-xl truncate">
                  <span className="font-bold uppercase tracking-wider text-[10px] mr-1 opacity-75">Prompt:</span>
                  {item.prompt}
                </div>
                <span className="text-xs text-gray-400 font-medium sm:self-center">
                  {new Date(item.created_at).toLocaleDateString(undefined, {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                {item.result}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}