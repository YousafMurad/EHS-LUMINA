// Supabase Server - Server client for server components and actions
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Note: We use 'any' for the Database type to avoid TypeScript inference issues
// with the newer Supabase postgrest-js library that returns 'never' for table types.
// This is a known issue and the workaround is to use explicit type assertions.
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookies in read-only context (middleware)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Handle cookies in read-only context
          }
        },
      },
    }
  );
}
