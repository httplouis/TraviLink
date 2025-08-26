import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabaseServer";

async function getCurrentUserRole(): Promise<"admin"|"driver"|"faculty"|null> {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("auth_user_id", user.id)   // ← here
    .single();
  return (data?.role ?? "faculty") as any;
}

export default async function Home() {
  const role = await getCurrentUserRole();
  if (!role) redirect("/login");
  if (role === "admin") redirect("/admin");
  if (role === "driver") redirect("/driver");
  redirect("/faculty");
}
