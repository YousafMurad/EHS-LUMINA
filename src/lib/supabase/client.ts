// Supabase Client - Browser client for client components
import { createBrowserClient } from "@supabase/ssr";

// Note: We use 'any' for the Database type to avoid TypeScript inference issues
// with the newer Supabase postgrest-js library that returns 'never' for table types.
export function createClient() {
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
