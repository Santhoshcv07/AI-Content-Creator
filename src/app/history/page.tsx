import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import Navbar from "../../components/Navbar";
import HistoryList from "./HistoryList";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const { data: generations } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const userProfile = {
    name: user.user_metadata?.full_name || "SaaS User",
    email: user.email || "",
    avatarUrl: user.user_metadata?.avatar_url || "",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors">
     <Navbar userProfile={userProfile} />
      
      <main className="flex-1 p-6 md:p-12 max-w-4xl w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Generation History</h1>
          <p className="text-gray-500 mt-1">Review, search, and manage your workspace outputs.</p>
        </div>

        {/* ➕ NEW: Pass data to interactive client component */}
        <HistoryList initialData={generations || []} />
      </main>
    </div>
  );
}