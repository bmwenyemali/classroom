import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UserManagementClient from "./UserManagementClient";

export default async function UserManagementPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "tenured_professor") {
    redirect("/dashboard");
  }

  // Get all users
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return <UserManagementClient users={users || []} />;
}
