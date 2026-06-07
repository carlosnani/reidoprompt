'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw, Home, AlertTriangle } from "lucide-react";
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro para serviços de monitoramento (ex: Sentry)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden px-4">
      {/* Background Effects */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="inline-flex p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 mb-4">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Algo deu errado
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Ocorreu um erro inesperado ao processar sua solicitação. Nossa equipe de IAs já foi notificada para corrigir isso.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-600 font-mono mt-4">
              ID do erro: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => reset()}
            className="bg-white text-black hover:bg-gray-200 font-bold h-12 px-8 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCcw className="w-4 h-4" />
            Tentar Novamente
          </Button>
          
          <Link href="/">
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 h-12 px-8 rounded-xl flex items-center gap-2 transition-all">
              <Home className="w-4 h-4" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 text-sm font-medium">
        O Rei do Prompt &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
