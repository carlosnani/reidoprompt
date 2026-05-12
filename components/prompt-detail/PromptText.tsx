"use client";

import { DetailedPrompt } from "@/lib/data/mockPrompts";
import { Button } from "@/components/ui/button";
import { Copy, Terminal } from "lucide-react";
import { toast } from "sonner";

interface PromptTextProps {
  prompt: DetailedPrompt;
}

export function PromptText({ prompt }: PromptTextProps) {
  const handleCopy = () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(prompt.promptText ?? "");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = prompt.promptText ?? "";
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      toast.success("Prompt copiado com sucesso!", {
        style: {
          background: '#121212',
          color: '#fff',
          border: '1px solid rgba(72, 255, 36, 0.3)',
        },
        icon: <Copy className="w-4 h-4 text-green-neon" />
      });
    } catch {
      toast.error("Erro ao tentar copiar o prompt.");
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex items-center gap-2">
        <Terminal className="w-5 h-5 text-green-neon" />
        <h2 className="text-xl font-bold text-white tracking-tight">Prompt</h2>
      </div>

      <div className="relative group">
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm pointer-events-none"></div>

        {/* Text Content */}
        <div className="relative p-6 pr-8 max-h-80 overflow-y-auto custom-scrollbar">
          <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-green-neon/30 selection:text-white">
            {prompt.promptText}
          </p>
        </div>
      </div>

      <Button
        onClick={handleCopy}
        className="w-full sm:w-auto self-start mt-2 bg-white text-black hover:bg-green-neon hover:text-black font-semibold h-12 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(72,255,36,0.3)]"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copiar Prompt
      </Button>

      {/* Global Custom Scrollbar Styles for the prompt box */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(72, 255, 36, 0.5);
        }
      `}} />
    </div>
  );
}
