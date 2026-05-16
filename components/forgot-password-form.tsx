"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Loader2, AlertCircle, Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as any } }),
};

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
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
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-neon transition-colors duration-200 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Voltar para login
            </Link>
          </motion.div>

          {/* Logo */}
          <motion.div variants={fadeUp} custom={1} className="flex flex-col items-center mb-8 gap-3">
            <div className="p-3 rounded-2xl bg-green-deep/30 border border-green-neon/20 shadow-[0_0_20px_rgba(72,255,36,0.15)]">
              <Image src="/logo.svg" alt="Rei do Prompt" width={32} height={32} className="w-8 h-8 object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-white">Recuperar senha</h1>
              <p className="text-gray-400 text-sm mt-1">Enviaremos um link para redefinir sua senha</p>
            </div>
          </motion.div>

          {success ? (
            /* ── SUCCESS STATE ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-5 py-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-neon/10 border border-green-neon/30 flex items-center justify-center shadow-[0_0_25px_rgba(72,255,36,0.15)]">
                <CheckCircle className="w-8 h-8 text-green-neon" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">E-mail enviado!</p>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-xs mx-auto">
                  Se o endereço <span className="text-white">{email}</span> estiver cadastrado, você receberá um link para redefinir sua senha.
                </p>
              </div>
              <p className="text-gray-500 text-xs">Não recebeu? Verifique sua caixa de spam.</p>
              <button
                onClick={() => { setSuccess(false); setEmail(""); }}
                className="text-green-neon text-sm hover:text-green-neon/80 transition-colors duration-200 cursor-pointer"
              >
                Tentar outro e-mail
              </button>
            </motion.div>
          ) : (
            /* ── FORM ── */
            <form onSubmit={handleForgotPassword} noValidate>
              <div className="flex flex-col gap-5">

                <motion.div variants={fadeUp} custom={2} className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">E-mail cadastrado</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-green-neon/50 focus:ring-2 focus:ring-green-neon/20 focus-visible:ring-green-neon/20 focus-visible:ring-offset-0 transition-all duration-200"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </motion.div>

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

                <motion.div variants={fadeUp} custom={3}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-green-neon text-black font-bold hover:bg-green-neon/90 hover:shadow-[0_0_25px_rgba(72,255,36,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Enviar link de recuperação
                      </span>
                    )}
                  </Button>
                </motion.div>
              </div>

              <motion.p variants={fadeUp} custom={4} className="mt-6 text-center text-sm text-gray-500">
                Lembrou a senha?{" "}
                <Link href="/auth/login" className="text-green-neon font-medium hover:text-green-neon/80 transition-colors duration-200">
                  Entrar
                </Link>
              </motion.p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
