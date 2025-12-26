import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import LibraryDetailClient from "./LibraryDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LibraryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get library details
  const { data: library } = await supabase
    .from("libraries")
    .select("*")
    .eq("id", id)
    .single();

  if (!library) notFound();

  // Get books from this library
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .eq("library_id", id)
    .order("title");

  return (
    <LibraryDetailClient
      library={library}
      books={books || []}
      userLocation={null}
      homeLocation={
        profile?.home_latitude && profile?.home_longitude
          ? [profile.home_longitude, profile.home_latitude]
          : null
      }
    />
  );
}
