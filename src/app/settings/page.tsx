import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import SettingsHeader from "./SettingsHeader";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Securely verify user
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
      <SettingsHeader userProfile={userProfile} />
      
      <main className="flex-1 p-6 md:p-12 max-w-6xl w-full mx-auto">
        <div className="mb-8 border-b border-gray-200 dark:border-slate-800 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Account Settings</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your profile, preferences, and workspace identity.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mock SaaS Navigation Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col space-y-1">
              <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg font-semibold text-sm transition-colors">
                General Profile
              </div>
              <div className="px-3 py-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg font-medium text-sm cursor-not-allowed opacity-60">
                Billing & Subscription (Soon)
              </div>
              <div className="px-3 py-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg font-medium text-sm cursor-not-allowed opacity-60">
                API Keys (Soon)
              </div>
            </nav>
          </aside>

          {/* Main Settings Form */}
          <div className="flex-1">
            <SettingsForm initialName={userProfile.name} email={userProfile.email} />
            
            {/* Danger Zone */}
            <div className="mt-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 transition-colors max-w-2xl">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-500 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
             <button
  type="button"
  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-800 font-bold text-sm py-2.5 px-6 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
>
  Delete Account
</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}