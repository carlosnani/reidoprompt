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
  const adminEmail =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;

  return (
    user?.user_metadata?.role === "admin" ||
    user?.app_metadata?.role === "admin" ||
    (adminEmail && user?.email?.toLowerCase() === adminEmail?.toLowerCase())
  );
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdmin(user)) {
    redirect("/conta");
  }
  return user;
}
