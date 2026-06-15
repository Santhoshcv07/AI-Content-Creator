"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import Link from "next/link";
import { 
  Copy, 
  Check, 
  FileText, 
  Download, 
  Clock, 
  Type, 
  Hash 
} from "lucide-react";

interface OutputCardProps {
  content: string;
}

export default function OutputCard({ content }: OutputCardProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- METRICS CALCULATION ---
  const words = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
  const characters = content.length;
  // Average reading speed is ~200 words per minute
  const readingTime = Math.max(1, Math.ceil(words / 200)); 

  // --- TOAST HANDLER ---
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- ACTION: COPY ---
  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    showToast("Copied to clipboard!");
  };

  // --- ACTION: TXT DOWNLOAD ---
  const handleDownloadTXT = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AI_Workspace_Asset_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("TXT file downloaded!");
  };

  // --- ACTION: PDF DOWNLOAD ---
  const handleDownloadPDF = () => {
    if (!content) return;
    try {
      const doc = new jsPDF();
      
      // Document Branding/Header
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("AI Workspace Generation Asset", 20, 20);
      
      // Document Metadata
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 28);
      
      // Divider Line
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.line(20, 32, 190, 32);
      
      // Core Content (Wrapped to fit A4 page)
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59); // Slate-800
      const splitText = doc.splitTextToSize(content, 170);
      doc.text(splitText, 20, 42);
      
      doc.save(`AI_Workspace_Asset_${Date.now()}.pdf`);
      showToast("PDF file downloaded!");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      showToast("Failed to generate PDF.");
    }
  };

  if (!content) return null;

  return (
    <div className="relative mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Floating Success Toast Notification */}
      {toastMessage && (
        <div className="absolute -top-12 right-0 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-10 animate-in slide-in-from-bottom-2 fade-in duration-300">
          <Check size={16} className="text-green-400 dark:text-green-600" />
          {toastMessage}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors">
        
        {/* TOP BAR: Title & Metrics */}
        <div className="px-6 py-4 bg-gray-50/80 dark:bg-slate-900/80 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <h2 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            Output Result
          </h2>
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm">
              <Type size={12} /> {words} Words
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm">
              <Hash size={12} /> {characters} Chars
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm">
              <Clock size={12} /> ~{readingTime} Min Read
            </div>
          </div>
        </div>
        
        {/* MIDDLE: The Actual Generated Content */}
        <div className="p-6 md:p-8 text-gray-800 dark:text-slate-200 text-base leading-relaxed whitespace-pre-wrap selection:bg-blue-200 dark:selection:bg-blue-900/50">
          {content}
        </div>

        {/* BOTTOM BAR: Export Actions */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
          >
            <Copy size={16} /> Copy Text
          </button>
          
          <button 
            onClick={handleDownloadTXT}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
          >
            <FileText size={16} /> Save .TXT
          </button>

          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>

      </div>
    </div>
  );
}