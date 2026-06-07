"use client";

import type { DetailedPrompt } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { Copy, Terminal, Lock } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/lib/supabase/hooks";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PromptTextProps {
  prompt: DetailedPrompt;
}

const RESTRICTED_TEXT = "ESTE CONTEÚDO É EXCLUSIVO PARA ASSINANTES PRO. AO ASSINAR O PLANO PRO, VOCÊ TERÁ ACESSO COMPLETO A ESTE PROMPT PROFISSIONAL E MILHARES DE OUTROS EXEMPLOS VALIDADOS PARA MAXIMIZAR SEUS RESULTADOS COM INTELIGÊNCIA ARTIFICIAL. ESTE É UM EXEMPLO DE COMO O PROMPT SERÁ EXIBIDO PARA VOCÊ APÓS O DESBLOQUEIO.";

export function PromptText({ prompt }: PromptTextProps) {
  const { isPro, loading } = useUser();
  
  const isRestricted = prompt.is_premium && (loading || !isPro);

  const handleCopy = async () => {
    if (isRestricted) {
      toast.error("Este prompt é exclusivo para assinantes Pro.", {
        description: "Assine o plano Pro para desbloquear este e milhares de outros prompts.",
        action: {
          label: "Ver Planos",
          onClick: () => window.location.href = "/planos"
        },
        className: "bg-white/10 border-white/20 text-white",
        descriptionClassName: "text-gray-300"
      });
      return;
    }

    try {
      // Copy com fallback para navegadores sem Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(prompt.promptText ?? "");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = prompt.promptText ?? "";
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      // Toast de sucesso com ícone renderizado corretamente
      toast.success("Prompt copiado com sucesso!", {
        description: "Cole onde quiser e aproveite!",
        icon: <Copy className="w-4 h-4 text-[#48FF24]" />,
        className: "bg-[#121212] border border-[#48FF24]/30 text-white",
        descriptionClassName: "text-gray-300",
        style: {
          background: '#121212',
          color: '#fff',
          border: '1px solid rgba(72, 255, 36, 0.3)',
        }
      });
    } catch (err) {
      console.error("Erro ao copiar:", err);
      toast.error("Erro ao tentar copiar o prompt.", {
        description: "Tente novamente ou copie manualmente.",
        className: "bg-red-500/10 border-red-500/20 text-white"
      });
    }
  };

  return (
    <div className="flex flex-col mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-lg font-bold">
          <span className="text-[#48FF24] font-mono select-none">&gt;_</span>
          <span className="text-white">Prompt</span>
        </div>
        {isRestricted && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#48FF24]/10 border border-[#48FF24]/20 text-[#48FF24] text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            Premium
          </div>
        )}
      </div>

      {/* Prompt Box */}
      <div className="relative group">
        {/* Background & Border */}
        <div className="absolute inset-0 bg-[#161616] rounded-2xl border border-white/10 pointer-events-none"></div>

        {/* Text Content */}
        <div className="relative p-6 pr-8 h-auto">
          <p className={cn(
            "text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-[#48FF24]/30 selection:text-white transition-all duration-500",
            isRestricted && "blur-md select-none opacity-50"
          )}>
            {isRestricted || !prompt.promptText ? RESTRICTED_TEXT : prompt.promptText}
          </p>

          {isRestricted && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="max-w-xs space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#48FF24]/20 flex items-center justify-center border border-[#48FF24]/30 mx-auto">
                  <Lock className="w-6 h-6 text-[#48FF24]" />
                </div>
                <h3 className="text-white font-bold text-lg">Conteúdo Bloqueado</h3>
                <p className="text-gray-400 text-sm">
                  Assine o plano Pro para visualizar este prompt e elevar o nível das suas criações.
                </p>
                <Link href="/planos">
                  <Button className="bg-[#48FF24] text-black hover:bg-[#48FF24]/90 font-bold mt-2">
                    Desbloquear Agora
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Copy Button */}
      <Button
        onClick={handleCopy}
        disabled={isRestricted && !loading}
        className={cn(
          "w-full sm:w-auto self-start mt-4 bg-white text-black hover:bg-white/90 font-bold h-12 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2",
          isRestricted && "opacity-50 grayscale cursor-not-allowed"
        )}
      >
        <Copy className="w-4 h-4" />
        {isRestricted ? "Prompt Bloqueado" : "Copiar Prompt"}
      </Button>
    </div>
  );
}