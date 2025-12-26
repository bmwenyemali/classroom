import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BooksClient from "./BooksClient";

export default async function BooksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get all books with library info
  const { data: books } = await supabase
    .from("books")
    .select("*, library:libraries(*)")
    .order("title");

  return <BooksClient books={books || []} />;
}
