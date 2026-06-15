import { SignUpForm } from "@/components/sign-up-form";
import { fetchSiteSettings } from "@/lib/supabase/site-settings";
import { createClient } from "@/lib/supabase/server";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const supabase = await createClient();
  const settings = await fetchSiteSettings(supabase);

  if (!settings.allow_registration) {
    return (
      <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#050505] overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-green-neon/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-green-neon/3 blur-[100px] pointer-events-none" />
        
        <div className="relative w-full max-w-md mx-auto">
          <div className="absolute -inset-1 rounded-3xl bg-red-500/10 blur-2xl pointer-events-none" />
          <div className="relative bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-red-500/10 border border-red-500/30">
                <ShieldAlert className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-tight text-white">Cadastros Suspensos</h1>
              <p className="text-gray-400">Desculpe, novos cadastros estão temporariamente desativados pela administração.</p>
            </div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-green-neon hover:text-green-neon/80 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#050505] overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-green-neon/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-green-neon/3 blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(72,255,36,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(72,255,36,0.4) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
