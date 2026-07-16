import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/auth/login");
  }

  return data.user;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAdmin(user: any) {
  // Check app_metadata first (set via auth admin API)
  if (user?.app_metadata?.role === "admin") return true;

  // Fallback: check email against server-side ADMIN_EMAIL
  // Note: only checks process.env.ADMIN_EMAIL (NOT NEXT_PUBLIC_ADMIN_EMAIL)
  // to avoid exposing admin email to the client bundle
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user?.email?.toLowerCase() === adminEmail?.toLowerCase()) {
    return true;
  }

  return false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPro(user: any) {
  if (isAdmin(user)) return true;
  
  const plan = (user?.app_metadata?.plan || "").toLowerCase();
  const subscription = (user?.app_metadata?.subscription || "").toLowerCase();
  
  return plan === "pro" || subscription === "active";
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdmin(user)) {
    redirect("/conta");
  }
  return user;
}
