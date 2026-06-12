"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";

interface SettingsFormProps {
  initialName: string;
  email: string;
}

export default function SettingsForm({ initialName, email }: SettingsFormProps) {
  const supabase = createClient();
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      // Update the user's metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name }
      });

      if (error) throw error;
      
      setMessage({ text: "Profile updated successfully.", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error: any) {
      setMessage({ text: error.message || "Failed to update profile.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        {/* Email Field (Disabled because it's managed by Google OAuth) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-500 dark:text-slate-400 cursor-not-allowed transition-all text-sm"
          />
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
            Your email is managed securely via Google OAuth.
          </p>
        </div>

        {/* Display Name Field */}
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

        {/* Action Button & Messages */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={isSaving || name === initialName}
            className="bg-blue-600 text-white font-bold text-sm py-2.5 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:text-gray-500 dark:disabled:text-slate-500 transition-colors shadow-sm"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          
          {message.text && (
            <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message.text}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}