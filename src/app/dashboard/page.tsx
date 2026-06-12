import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Securely retrieve the user session from cookies
  const { data: { user }, error } = await supabase.auth.getUser();

  // Fallback protection if middleware is bypassed
  if (error || !user) {
    redirect("/login");
  }

  // Extract Google profile metadata
  const userProfile = {
    name: user.user_metadata?.full_name || "SaaS User",
    email: user.email || "",
    avatarUrl: user.user_metadata?.avatar_url || "",
  };

  return <DashboardClient userProfile={userProfile} />;
}