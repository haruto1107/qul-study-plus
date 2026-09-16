import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

// Server Components / Server Actions から呼び出す Supabase クライアント。
// 常にユーザーの JWT (anon key + cookie) で動作し、RLS がすべての操作に適用される。
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component から呼ばれた場合、cookie の書き込みはできない。
            // middleware 側でセッションのリフレッシュを行うため無視して問題ない。
          }
        }
      }
    }
  );
}
