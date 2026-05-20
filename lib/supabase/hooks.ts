import { useEffect, useState } from 'react';
import { createClient } from './client';
import type { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  
  const isAdmin = user?.user_metadata?.role === "admin" || 
                  user?.app_metadata?.role === "admin" || 
                  (!!adminEmail && user?.email?.toLowerCase() === adminEmail.toLowerCase());
  
  const isPro = isAdmin || 
                user?.user_metadata?.plan === "pro" || 
                user?.user_metadata?.subscription === "active" ||
                user?.app_metadata?.plan === "pro" || 
                user?.app_metadata?.subscription === "active";

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, isPro, isAdmin };
}