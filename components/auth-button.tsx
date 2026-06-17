import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const adminEmail =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const isAdmin =
    user?.app_metadata?.role === "admin" ||
    (!!adminEmail && user?.email?.toLowerCase() === adminEmail.toLowerCase());

  return user ? (
    <div className="flex flex-wrap items-center gap-4">
      <div className="text-sm">Olá, {user.email}!</div>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/conta">Minha Conta</Link>
        </Button>
        {isAdmin ? (
          <Button asChild size="sm" variant="outline">
            <Link href="/admin">Admin</Link>
          </Button>
        ) : null}
      </div>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Entrar</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Cadastrar</Link>
      </Button>
    </div>
  );
}
