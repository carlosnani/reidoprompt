"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { registerSchema } from "@/lib/validations";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    const validated = registerSchema.safeParse({ fullName: name, email, password });
    if (!validated.success) {
      setError(validated.error.issues[0].message);
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) {
      setError(authError.message || "Erro ao criar conta.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-6 space-y-4 animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-green-neon/10 border border-green-neon/30 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Conta criada!</h2>
        <p className="text-sm text-gray-400">
          Verifique seu email <span className="text-green-neon font-medium">{email}</span> para confirmar a sua conta.
        </p>
        <Link 
          href="/auth/login"
          className="inline-block text-sm font-medium text-green-neon hover:text-green-neon/80 hover:underline transition-all"
        >
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4 animate-in fade-in duration-500" onSubmit={handleRegister}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 ml-1">Nome</label>
        <Input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome completo" 
          className="bg-black/50 border-green-deep text-white placeholder:text-gray-500 rounded-xl h-12 focus-visible:ring-green-neon/50 focus-visible:border-green-neon transition-all"
          required
          disabled={loading}
        />
      </div>

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
        <label className="text-sm font-medium text-gray-300 ml-1">Senha</label>
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

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 ml-1">Confirmar senha</label>
        <div className="relative">
          <Input 
            type={showConfirmPassword ? "text" : "password"} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••" 
            className="bg-black/50 border-green-deep text-white placeholder:text-gray-500 rounded-xl h-12 focus-visible:ring-green-neon/50 focus-visible:border-green-neon transition-all pr-12"
            required
            disabled={loading}
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-neon transition-colors p-1"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <Button 
        disabled={loading}
        className="w-full h-14 mt-4 rounded-xl bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_20px_rgba(72,255,36,0.4)] transition-all font-bold text-lg disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar Conta"}
      </Button>

      <div className="text-center mt-2">
        <span className="text-sm text-gray-400">Já possui conta? </span>
        <Link 
          href="/auth/login"
          className="text-sm font-medium text-green-neon hover:text-green-neon/80 hover:underline transition-all"
        >
          Entrar
        </Link>
      </div>
    </form>
  );
}
