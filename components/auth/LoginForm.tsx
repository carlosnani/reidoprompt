"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "Email ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/protected");
    router.refresh();
  };

  return (
    <form className="flex flex-col gap-4 animate-in fade-in duration-500" onSubmit={handleLogin}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
        <Input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com" 
          className="bg-black/50 border-green-deep text-white placeholder:text-gray-500 rounded-xl h-12 focus-visible:ring-green-neon/50 focus-visible:border-green-neon transition-all"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
          <label className="text-sm font-medium text-gray-300">Senha</label>
          <Link href="/auth/forgot-password" className="text-xs text-green-neon hover:text-green-neon/80 hover:underline transition-all">
            Esqueceu sua senha?
          </Link>
        </div>
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="bg-black/50 border-green-deep text-white placeholder:text-gray-500 rounded-xl h-12 focus-visible:ring-green-neon/50 focus-visible:border-green-neon transition-all pr-12"
            required
            disabled={loading}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-neon transition-colors p-1"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <Button 
        disabled={loading}
        className="w-full h-14 mt-4 rounded-xl bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_20px_rgba(72,255,36,0.4)] transition-all font-bold text-lg disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
      </Button>

      <div className="text-center mt-2">
        <span className="text-sm text-gray-400">Não tem uma conta? </span>
        <Link 
          href="/auth/sign-up"
          className="text-sm font-medium text-green-neon hover:text-green-neon/80 hover:underline transition-all"
        >
          Criar Conta
        </Link>
      </div>
    </form>
  );
}
