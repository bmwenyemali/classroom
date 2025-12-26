import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LibrariesClient from "./LibrariesClient";

export default async function LibrariesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get user profile for home location
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get all libraries
  const { data: libraries } = await supabase
    .from("libraries")
    .select("*")
    .order("name");

  // Get book count for each library
  const { data: bookCounts } = await supabase
    .from("books")
    .select("library_id, count");

  const librariesWithCounts = libraries?.map((library) => ({
    ...library,
    bookCount:
      bookCounts?.find((bc: any) => bc.library_id === library.id)?.count || 0,
  }));

  return (
    <LibrariesClient
      libraries={librariesWithCounts || []}
      userLocation={null}
      homeLocation={
        profile?.home_latitude && profile?.home_longitude
          ? [profile.home_longitude, profile.home_latitude]
          : null
      }
    />
  );
}
