import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import DashboardClient from "./DashboardClient";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: generations } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id);

  const safeGenerations = generations || [];

  const totalGenerations = safeGenerations.length;

  const totalWords = safeGenerations.reduce((sum, item) => {
    return sum + (item.result?.split(/\s+/).length || 0);
  }, 0);

  const templateUsage = safeGenerations.filter(
    (item) => item.template_id
  ).length;

  const analytics = {
    totalGenerations,
    totalWords,
    templateUsage,
    activeStreak: 0,
  };

  const userProfile = {
    name: user.user_metadata?.full_name || "SaaS User",
    email: user.email || "",
    avatarUrl: user.user_metadata?.avatar_url || "",
  };

  return (
    <DashboardClient
      userProfile={userProfile}
      analytics={analytics}
    />
  );
}