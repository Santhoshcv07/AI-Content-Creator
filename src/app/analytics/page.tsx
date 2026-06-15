import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import Navbar from "../../components/Navbar";
import AnalyticsCharts from "./AnalyticsCharts"; // ➕ Import the new charts
import Link from "next/link";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  const { data: generations } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const safeGenerations = generations || [];

  // --- METRICS CALCULATION ---
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfToday - 7 * 24 * 60 * 60 * 1000;

  let todayCount = 0;
  let weekCount = 0;
  let templateCount = 0;

  const templateTriggers = [
    { name: "Blog Post", trigger: "Write a comprehensive, SEO-optimized" },
    { name: "LinkedIn Post", trigger: "Write an engaging LinkedIn post" },
    { name: "Instagram Caption", trigger: "Write a catchy Instagram caption" },
    { name: "Email Generator", trigger: "Write a professional email" },
    { name: "YouTube Script", trigger: "Create a YouTube video script" },
    { name: "Product Description", trigger: "Write a compelling product description" }
  ];

  // --- CHART DATA PREPARATION ---
  
  // 1. Prepare Last 7 Days Array
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }), // e.g., "Mon"
      fullDate: d.toISOString().split('T')[0],
      count: 0
    };
  });

  // 2. Prepare Template Distribution Object
  const templateUsage: Record<string, number> = {};

  // Loop through all generations to fill metrics and chart data
  safeGenerations.forEach((g) => {
    const createdTime = new Date(g.created_at).getTime();
    if (createdTime >= startOfToday) todayCount++;
    if (createdTime >= startOfWeek) weekCount++;
    
    // Fill 7-Day Chart Data
    const gDate = new Date(g.created_at).toISOString().split('T')[0];
    const dayMatch = weeklyData.find(d => d.fullDate === gDate);
    if (dayMatch) dayMatch.count++;

    // Fill Template Donut Chart Data
    let matched = false;
    for (const t of templateTriggers) {
      if (g.prompt.includes(t.trigger)) {
        templateCount++;
        templateUsage[t.name] = (templateUsage[t.name] || 0) + 1;
        matched = true;
        break;
      }
    }
    if (!matched) {
      templateUsage["Custom Prompt"] = (templateUsage["Custom Prompt"] || 0) + 1;
    }
  });

  // Convert template object to array for Recharts
  const templateData = Object.entries(templateUsage).map(([name, value]) => ({
    name, value
  }));

  const recentActivity = safeGenerations.slice(0, 5);
  const userProfile = {
    name: user.user_metadata?.full_name || "SaaS User",
    email: user.email || "",
    avatarUrl: user.user_metadata?.avatar_url || "",
  };

  return (
 
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 transition-colors duration-500">
     <Navbar userProfile={userProfile} />
      
      <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white p-6 transition-colors duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Performance Analytics</h1>
         <p className="text-gray-500 dark:text-slate-400 mt-1"> Track your content generation volume and workspace usage.</p>
        </div>

       {/* Top Section: Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
   <div className="relative group bg-white/50 backdrop-blur-xl border border-slate-200 dark:bg-white/[0.03] dark:backdrop-blur-3xl dark:border-white/20 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-3xl p-6 transition-all duration-500">
            <span className="text-slate-400 text-sm font-semibold mb-2 flex items-center gap-2">
              <span>📚</span> Total Generations
            </span>
            <span className="text-4xl font-extrabold text-blue-400">
              {safeGenerations.length}
            </span>
          </div>
          
          <div className="relative group bg-white/50 backdrop-blur-xl border border-slate-200 dark:bg-white/[0.03] dark:backdrop-blur-3xl dark:border-white/20 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-3xl p-6 transition-all duration-500">
            <span className="text-slate-400 text-sm font-semibold mb-2 flex items-center gap-2">
              <span>⚡</span> Generated Today
            </span>
            <span className="text-4xl font-extrabold text-blue-400">
              {todayCount}
            </span>
          </div>
          
          <div className="relative group bg-white/50 backdrop-blur-xl border border-slate-200 dark:bg-white/[0.03] dark:backdrop-blur-3xl dark:border-white/20 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-3xl p-6 transition-all duration-500">
            <span className="text-slate-400 text-sm font-semibold mb-2 flex items-center gap-2">
              <span>📅</span> Past 7 Days
            </span>
            <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {weekCount}
            </span>
          </div>
          
          <div className="relative group bg-white/50 backdrop-blur-xl border border-slate-200 dark:bg-white/[0.03] dark:backdrop-blur-3xl dark:border-white/20 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-3xl p-6 transition-all duration-500">
            <span className="text-slate-400 text-sm font-semibold mb-2 flex items-center gap-2">
              <span>🎨</span> Templates Used
            </span>
            <span className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {templateCount}
            </span>
          </div>
        </div>

        {/* ➕ NEW: Render Interactive Charts */}
        <AnalyticsCharts weeklyData={weeklyData} templateData={templateData} />

        {/* Bottom Section: Recent Activity Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          </div>
          
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No activity found yet.</div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {recentActivity.map((item) => (
                <li key={item.id} className="p-6 hover:bg-slate-800 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {item.prompt}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 truncate max-w-2xl">
                      {item.result.replace(/\n/g, ' ').substring(0, 100)}...
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString(undefined, { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}