"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface SettingsFormProps {
  initialName: string;
  initialAvatarUrl: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function SettingsForm({ initialName, initialAvatarUrl }: SettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setMessage({ text: "Please upload a valid JPG, PNG, or WebP image.", type: "error" });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage({ text: "Image must be less than 2MB.", type: "error" });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage({ text: "", type: "" });
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Authentication error.");

      let finalAvatarUrl = avatarUrl;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) throw new Error("Failed to upload image.");

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          full_name: name,
          avatar_url: finalAvatarUrl
        }
      });

      if (updateError) throw updateError;
      
      setAvatarUrl(finalAvatarUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      setMessage({ text: "Profile updated successfully!", type: "success" });
      
      router.refresh(); 
      
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile.";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const displayImage = previewUrl || avatarUrl;

  return (
    <div className="bg-white dark:bg-[#0e0e11] p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 transition-colors w-full relative overflow-hidden group">
      
      {/* Subtle background flair */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
      
      <form onSubmit={handleSave} className="space-y-8 relative z-10">
        
        {/* Avatar Upload Section */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-md group-hover:shadow-blue-500/10 transition-all duration-300">
            {displayImage ? (
              <img src={displayImage} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <span className="text-2xl font-bold text-gray-400 dark:text-slate-500">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            
            {isSaving && selectedFile && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-sm active:scale-95 cursor-pointer"
                disabled={isSaving}
              >
                <Upload size={16} /> Choose Image
              </button>
              
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer"
                  disabled={isSaving}
                >
                  <X size={16} /> Remove
                </button>
              )}
            </div>
            <p className="text-[13px] text-gray-500 dark:text-slate-500 mt-3 font-medium">
              JPG or PNG. Maximum 2MB.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg, image/png, image/jpg, image/webp"
              className="hidden"
            />
          </div>
        </div>

        {/* Name Field Only */}
        <div className="space-y-5 border-t border-gray-100 dark:border-white/5 pt-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-[15px] font-medium shadow-inner"
            />
          </div>
        </div>

        {/* Action Button & Messages */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/5 mt-8">
          <button
            type="submit"
            disabled={isSaving || (!selectedFile && name === initialName)}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold text-[15px] py-3.5 px-8 rounded-xl hover:bg-blue-700 disabled:bg-gray-100 dark:disabled:bg-white/5 disabled:text-gray-400 dark:disabled:text-slate-600 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.97] disabled:active:scale-100 disabled:shadow-none cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving Updates...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          
          {message.text && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold animate-in zoom-in-95 duration-300 ${
              message.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
                : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <X size={16} />}
              {message.text}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}