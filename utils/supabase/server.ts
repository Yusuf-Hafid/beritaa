import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type AdminSupabaseClient = SupabaseClient<any, 'public', any>;

let cachedClient: AdminSupabaseClient | null = null;

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Server-only Supabase client.
 *
 * Custom auth tidak memakai Supabase Auth, sehingga operasi baca/tulis
 * ke tabel admin dan storage harus memakai service-role key.
 */
export function createAdminClient(): AdminSupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('createAdminClient hanya boleh dipanggil dari server.');
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi. Tambahkan secret key ke .env.local.'
    );
  }

  if (!cachedClient) {
    cachedClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return cachedClient;
}
