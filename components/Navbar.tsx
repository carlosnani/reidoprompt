"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { Loader2, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { fetchSiteSettings, type SiteSettings } from "@/lib/supabase/site-settings";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleLogoutAndCloseMenu = async () => {
    closeMobileMenu();
    await handleLogout();
  };

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsPending(false);
    });

    fetchSiteSettings(supabase).then(setSettings);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsPending(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = user?.app_metadata?.role === "admin";
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";
  const platformName = settings?.platform_name || "O REI DO PROMPT";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-full bg-green-deep/30 border border-green-neon/20 group-hover:shadow-[0_0_15px_rgba(72,255,36,0.5)] transition-all duration-300">
            <Image src="/logo.svg" alt="Logo" width={24} height={24} className="w-6 h-6 object-contain" onError={() => {}} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">{platformName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            Início
          </Link>
          <Link href="/prompts" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            Prompts
          </Link>                    
          <Link href="/planos" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            Planos
          </Link>
                    <Link href="/tutorial" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            Tutorial
          </Link>
          {user && (
            <Link href="/conta" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors">
              Minha Conta
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="px-4 py-2 text-sm font-medium text-green-neon hover:text-green-neon/80 rounded-full hover:bg-white/5 transition-colors">
              Admin Dashboard
            </Link>
          )}
          <Link href="/sobre" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            Sobre Nós
          </Link>
        </nav>

        <button
          type="button"
          onClick={toggleMobileMenu}
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-gray-200 md:hidden hover:bg-white/10 transition"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="hidden md:flex items-center gap-4">
          {isPending ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-400">
                Olá, <span className="text-white">{userName}</span>
              </span>
              <Button onClick={handleLogout} variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                Sair
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Entrar
              </Link>
              {settings?.allow_registration && (
                <Link href="/auth/sign-up" className="hidden sm:block">
                  <Button className="rounded-full bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_20px_rgba(72,255,36,0.4)] transition-all font-semibold px-6 border border-green-neon">
                    Criar Conta
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/90 border-t border-white/10 backdrop-blur-xl">
          <div className="max-w-[1440px] mx-auto px-6 py-4 space-y-3">
            <Link href="/" onClick={closeMobileMenu} className="block rounded-xl px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/5 transition-colors">
              Início
            </Link>
             <Link href="/prompts" onClick={closeMobileMenu} className="block rounded-xl px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/5 transition-colors">
              Prompts
            </Link>
             <Link href="/tutorial" onClick={closeMobileMenu} className="block rounded-xl px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/5 transition-colors">
              Tutorial
            </Link>
            <Link href="/planos" onClick={closeMobileMenu} className="block rounded-xl px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/5 transition-colors">
              Planos
            </Link>
           
            {user && (
              <Link href="/conta" onClick={closeMobileMenu} className="block rounded-xl px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/5 transition-colors">
                Minha Conta
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" onClick={closeMobileMenu} className="block rounded-xl px-4 py-3 text-base font-medium text-green-neon hover:text-green-neon/80 hover:bg-white/5 transition-colors">
                Admin Dashboard
              </Link>
            )}
            <Link href="/sobre" onClick={closeMobileMenu} className="block rounded-xl px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/5 transition-colors">
              Sobre Nós
            </Link>

            <div className="border-t border-white/10 pt-4">
              {isPending ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando...
                </div>
              ) : user ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">
                    Olá, <span className="text-white">{userName}</span>
                  </p>
                  <Button onClick={handleLogoutAndCloseMenu} variant="ghost" className="w-full justify-center text-gray-300 hover:text-white hover:bg-white/10">
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/auth/login" onClick={closeMobileMenu} className="block rounded-xl px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/5 transition-colors">
                    Entrar
                  </Link>
                  {settings?.allow_registration && (
                    <Link href="/auth/sign-up" onClick={closeMobileMenu}>
                      <Button className="w-full rounded-full bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_20px_rgba(72,255,36,0.4)] transition-all font-semibold px-6 border border-green-neon">
                        Criar Conta
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
