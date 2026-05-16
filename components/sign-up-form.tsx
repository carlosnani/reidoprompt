"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, UserPlus, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as any } }),
};

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ caracteres", ok: password.length >= 8 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(password) },
    { label: "Número", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-red-500", "bg-yellow-500", "bg-yellow-400", "bg-green-neon"];
  const labels = ["Fraca", "Razoável", "Boa", "Forte"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score] : "bg-white/10"}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${score >= 3 ? "text-green-neon" : score >= 2 ? "text-yellow-400" : "text-red-400"}`}>
          {labels[score]}
        </span>
        <div className="flex gap-3">
          {checks.map((c, i) => (
            <span key={i} className={`text-xs flex items-center gap-1 ${c.ok ? "text-green-neon" : "text-gray-600"}`}>
              <CheckCircle className="w-3 h-3" /> {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const passwordMismatch = repeatPassword.length > 0 && password !== repeatPassword;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/conta` },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <motion.div initial="hidden" animate="visible" className="relative w-full max-w-md mx-auto">
        {/* Glow */}
        <div className="absolute -inset-1 rounded-3xl bg-green-neon/10 blur-2xl pointer-events-none" />

        <div className="relative bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">

          {/* Back link */}
          <motion.div variants={fadeUp} custom={0} className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-neon transition-colors duration-200 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Voltar ao início
            </Link>
          </motion.div>

          {/* Logo + header */}
          <motion.div variants={fadeUp} custom={1} className="flex flex-col items-center mb-8 gap-3">
            <div className="p-3 rounded-2xl bg-green-deep/30 border border-green-neon/20 shadow-[0_0_20px_rgba(72,255,36,0.15)]">
              <Image src="/logo.svg" alt="Rei do Prompt" width={32} height={32} className="w-8 h-8 object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-white">Criar conta</h1>
              <p className="text-gray-400 text-sm mt-1">Acesse os melhores prompts do Brasil</p>
            </div>
          </motion.div>

          <form onSubmit={handleSignUp} noValidate>
            <div className="flex flex-col gap-5">

              {/* Email */}
              <motion.div variants={fadeUp} custom={2} className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-green-neon/50 focus:ring-2 focus:ring-green-neon/20 focus-visible:ring-green-neon/20 focus-visible:ring-offset-0 transition-all duration-200"
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeUp} custom={3} className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-green-neon/50 focus:ring-2 focus:ring-green-neon/20 focus-visible:ring-green-neon/20 focus-visible:ring-offset-0 transition-all duration-200"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-green-neon transition-colors duration-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </motion.div>

              {/* Repeat password */}
              <motion.div variants={fadeUp} custom={4} className="flex flex-col gap-1.5">
                <Label htmlFor="repeat-password" className="text-sm font-medium text-gray-300">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="repeat-password"
                    type={showRepeat ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className={`h-12 pr-12 bg-white/5 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus-visible:ring-offset-0 transition-all duration-200 ${
                      passwordMismatch
                        ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20 focus-visible:ring-red-500/20"
                        : "border-white/10 focus:border-green-neon/50 focus:ring-green-neon/20 focus-visible:ring-green-neon/20"
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={showRepeat ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowRepeat((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-green-neon transition-colors duration-200 cursor-pointer"
                  >
                    {showRepeat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    As senhas não coincidem
                  </p>
                )}
              </motion.div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Submit */}
              <motion.div variants={fadeUp} custom={5}>
                <Button
                  type="submit"
                  disabled={isLoading || passwordMismatch}
                  className="w-full h-12 rounded-xl bg-green-neon text-black font-bold hover:bg-green-neon/90 hover:shadow-[0_0_25px_rgba(72,255,36,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Criando conta...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Criar conta grátis
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Terms note */}
              <motion.p variants={fadeUp} custom={6} className="text-center text-xs text-gray-600 leading-relaxed">
                Ao criar uma conta, você concorda com nossos{" "}
                <Link href="/termos-de-uso" className="text-gray-400 hover:text-green-neon transition-colors duration-200">Termos de Uso</Link>{" "}
                e{" "}
                <Link href="/privacidade" className="text-gray-400 hover:text-green-neon transition-colors duration-200">Política de Privacidade</Link>.
              </motion.p>
            </div>

            {/* Login link */}
            <motion.p variants={fadeUp} custom={7} className="mt-6 text-center text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-green-neon font-medium hover:text-green-neon/80 transition-colors duration-200">
                Entrar
              </Link>
            </motion.p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
