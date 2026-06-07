"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { fetchSiteSettings, SiteSettings } from "@/lib/supabase/site-settings";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Buscar sessão atual
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsPending(false);
    });

    // Buscar configurações usando o cliente do browser
    fetchSiteSettings(supabase).then(setSettings);

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsPending(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Verificar se o usuário é admin pelo metadata ou role
  const isAdmin = user?.user_metadata?.role === "admin" || user?.app_metadata?.role === "admin";
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";
  const platformName = settings?.platform_name || "O REI DO PROMPT";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-full bg-green-deep/30 border border-green-neon/20 group-hover:shadow-[0_0_15px_rgba(72,255,36,0.5)] transition-all duration-300">
            <Image src="/logo.svg" alt="Logo" width={24} height={24} className="w-6 h-6 object-contain" onError={() => { }} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">{platformName}</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            Início
          </Link>
          <Link
            href="/planos"
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            Planos
          </Link>
          <Link
            href="/prompts"
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            Prompts
          </Link>
          {user && (
            <Link
              href="/conta"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              Minha Conta
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-medium text-green-neon hover:text-green-neon/80 rounded-full hover:bg-white/5 transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-400">
                Olá, <span className="text-white">{userName}</span>
              </span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                Sair
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Entrar
              </Link>
              <Link href="/auth/sign-up" className="hidden sm:block">
                <Button className="rounded-full bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_20px_rgba(72,255,36,0.4)] transition-all font-semibold px-6 border border-green-neon">
                  Criar Conta
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
