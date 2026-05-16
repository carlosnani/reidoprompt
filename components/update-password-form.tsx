"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, CheckCircle } from "lucide-react";
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
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score] : "bg-white/10"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between flex-wrap gap-1">
        <span className={`text-xs font-medium ${score >= 3 ? "text-green-neon" : score >= 2 ? "text-yellow-400" : "text-red-400"}`}>
          Senha: {labels[score]}
        </span>
        <div className="flex gap-3 flex-wrap">
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

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/conta");
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

          {/* Logo + header */}
          <motion.div variants={fadeUp} custom={0} className="flex flex-col items-center mb-8 gap-3">
            <div className="p-3 rounded-2xl bg-green-deep/30 border border-green-neon/20 shadow-[0_0_20px_rgba(72,255,36,0.15)]">
              <Image src="/logo.svg" alt="Rei do Prompt" width={32} height={32} className="w-8 h-8 object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-white">Nova senha</h1>
              <p className="text-gray-400 text-sm mt-1">Defina uma nova senha segura para sua conta</p>
            </div>
          </motion.div>

          <form onSubmit={handleUpdatePassword} noValidate>
            <div className="flex flex-col gap-5">

              {/* New password */}
              <motion.div variants={fadeUp} custom={1} className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">Nova senha</Label>
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

              {/* Confirm password */}
              <motion.div variants={fadeUp} custom={2} className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">Confirmar nova senha</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-12 pr-12 bg-white/5 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus-visible:ring-offset-0 transition-all duration-200 ${
                      passwordMismatch
                        ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20 focus-visible:ring-red-500/20"
                        : "border-white/10 focus:border-green-neon/50 focus:ring-green-neon/20 focus-visible:ring-green-neon/20"
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-green-neon transition-colors duration-200 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    As senhas não coincidem
                  </p>
                )}
                {!passwordMismatch && confirmPassword.length > 0 && (
                  <p className="text-xs text-green-neon flex items-center gap-1.5 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Senhas conferem
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

              {/* Tips */}
              <motion.div variants={fadeUp} custom={3} className="rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  💡 Use pelo menos 8 caracteres, incluindo letras maiúsculas e números para uma senha forte.
                </p>
              </motion.div>

              {/* Submit */}
              <motion.div variants={fadeUp} custom={4}>
                <Button
                  type="submit"
                  disabled={isLoading || passwordMismatch || password.length < 6}
                  className="w-full h-12 rounded-xl bg-green-neon text-black font-bold hover:bg-green-neon/90 hover:shadow-[0_0_25px_rgba(72,255,36,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Salvar nova senha
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
