import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import Navbar from "../../components/Navbar";
import SettingsForm from "./SettingsForm";
import Link from "next/link";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const userProfile = {
    name: user.user_metadata?.full_name || "SaaS User",
    email: user.email || "",
    avatarUrl: user.user_metadata?.avatar_url || "",
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0A0A0A] flex flex-col font-sans transition-colors relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20 pointer-events-none" />

      <Navbar userProfile={userProfile} />
      
    <main className="flex-1 p-6 md:p-12 max-w-3xl w-full mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Account Settings</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">Manage your profile, preferences, and workspace identity.</p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 ease-out fill-mode-both w-full">
          <SettingsForm 
            initialName={userProfile.name} 
            initialAvatarUrl={userProfile.avatarUrl} 
          />
        </div>
      </main>
    </div>
  );
}