import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabaseServer";

export default async function AdminPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") redirect("/"); // i-redirect sa universal landing

  return <div>Admin Dashboard</div>;
}
