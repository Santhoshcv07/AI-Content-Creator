"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";

interface SettingsFormProps {
  initialName: string;
  email: string;
  initialAvatarUrl: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function SettingsForm({ initialName, email, initialAvatarUrl }: SettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. Handle File Selection & Validation ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate Type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setMessage({ text: "Please upload a valid JPG or PNG image.", type: "error" });
      return;
    }

    // Validate Size (2MB)
    if (file.size > MAX_FILE_SIZE) {
      setMessage({ text: "Image must be less than 2MB.", type: "error" });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Show instant local preview
    setMessage({ text: "", type: "" });
  };

  // --- 2. Clear File Selection ---
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- 3. Master Save Function (Upload Image + Update Profile) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Authentication error.");

      let finalAvatarUrl = avatarUrl;

      // If the user selected a new file, upload it to Supabase Storage first
      if (selectedFile) {
        // Create a unique file path to prevent browser caching issues
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) throw new Error("Failed to upload image. Please try again.");

        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      // Update the user's Auth metadata with the new name and new avatar URL
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
      setMessage({ text: "Profile updated successfully.", type: "success" });
      
      // Force Next.js Server Components (like the Navbar) to re-fetch the fresh data
      router.refresh(); 
      
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile.";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Determine which image to show in the circle
  const displayImage = previewUrl || avatarUrl;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
      
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Avatar Upload Section */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {displayImage ? (
              <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-400 dark:text-slate-500">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            
            {/* Show an overlay spinner if currently uploading */}
            {isSaving && selectedFile && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
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
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                disabled={isSaving}
              >
                <Upload size={16} /> Choose Image
              </button>
              
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-semibold transition-colors"
                  disabled={isSaving}
                >
                  <X size={16} /> Cancel
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
              JPG or PNG. Maximum 2MB.
            </p>
            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg, image/png, image/jpg"
              className="hidden"
            />
          </div>
        </div>

        {/* Name & Email Fields */}
        <div className="space-y-5 border-t border-gray-100 dark:border-slate-800 pt-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 dark:text-slate-500 cursor-not-allowed transition-all text-sm"
            />
          </div>
        </div>

        {/* Action Button & Messages */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={isSaving || (!selectedFile && name === initialName)}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold text-sm py-3 px-6 rounded-xl hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-600 transition-colors shadow-sm"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {isSaving ? "Saving Data..." : "Save Changes"}
          </button>
          
          {message.text && (
            <span className={`text-sm font-bold ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message.text}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}