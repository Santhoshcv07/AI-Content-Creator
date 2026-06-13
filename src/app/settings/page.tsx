import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import Navbar from "../../components/Navbar";
import SettingsForm from "./SettingsForm";

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors">
      <Navbar userProfile={userProfile} />
      
      <main className="flex-1 p-6 md:p-12 max-w-6xl w-full mx-auto">
        <div className="mb-8 border-b border-gray-200 dark:border-slate-800 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Account Settings</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your profile, preferences, and workspace identity.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col space-y-1">
              <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg font-semibold text-sm transition-colors">
                General Profile
              </div>
              <div className="px-3 py-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg font-medium text-sm cursor-not-allowed opacity-60">
                Billing & Subscription
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* ➕ NEW: Pass initialAvatarUrl to the form */}
            <SettingsForm 
              initialName={userProfile.name} 
              email={userProfile.email} 
              initialAvatarUrl={userProfile.avatarUrl} 
            />
          </div>

        </div>
      </main>
    </div>
  );
}