import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-neon/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="space-y-2">
          <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 select-none">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Página não encontrada
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            O prompt que você está procurando parece ter sido gerado em outra realidade ou o link está quebrado.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button className="bg-green-neon text-black hover:bg-green-neon/90 font-bold h-12 px-8 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
              <Home className="w-4 h-4" />
              Voltar ao Início
            </Button>
          </Link>
          <Link href="/prompts">
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 h-12 px-8 rounded-xl flex items-center gap-2 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Ver Galeria
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer-like subtle text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 text-sm font-medium">
        O Rei do Prompt &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
