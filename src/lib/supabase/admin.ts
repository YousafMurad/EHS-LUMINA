// Supabase Admin - Admin client with service role (use carefully)
import { createClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDatabase = any;

// WARNING: Only use in server-side code, never expose to client
export function createAdminClient() {
  return createClient<AnyDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
