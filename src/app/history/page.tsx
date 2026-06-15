import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import HistoryClient from "./HistoryClient";
import Link from "next/link";

export default async function HistoryPage() {
  const supabase = await createClient();

  // 1. Secure Authentication Check
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // 2. Fetch User Profile Data for Navbar
  const userProfile = {
    name: user.user_metadata?.full_name || "SaaS User",
    email: user.email || "",
    avatarUrl: user.user_metadata?.avatar_url || "",
  };

  // 3. Fetch all generations for this user, newest first
  // Ensure we select 'is_favorite' so the UI knows what is starred!
  const { data: generations, error: dbError } = await supabase
    .from("generations")
    .select("id, prompt, result, is_favorite, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (dbError) {
    console.error("Error fetching history:", dbError);
  }

  // 4. Pass data to the interactive client component
  return (
    <HistoryClient 
      userProfile={userProfile} 
      initialGenerations={generations || []} 
    />
  );
}