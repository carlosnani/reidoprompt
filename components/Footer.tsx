"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/80 backdrop-blur-lg pt-20 pb-10 px-6">
      <div className="max-w-360 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-full bg-green-deep/30 border border-green-neon/20">
                <Image src="/logo.svg" alt="Logo" width={24} height={24} className="w-6 h-6 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">REI DO PROMPT</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A maior e mais completa biblioteca de prompts premium do Brasil. Eleve seus resultados com inteligência artificial.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Produtos</h4>
            <ul className="space-y-4">
              <li><Link href="/prompts" className="text-gray-400 hover:text-green-neon text-sm transition-colors">Prompts ChatGPT</Link></li>
              <li><Link href="/prompts" className="text-gray-400 hover:text-green-neon text-sm transition-colors">Prompts Midjourney</Link></li>
              <li><Link href="/prompts" className="text-gray-400 hover:text-green-neon text-sm transition-colors">Prompts Flow</Link></li>
              <li><Link href="/planos" className="text-gray-400 hover:text-green-neon text-sm transition-colors">Prompts Premium</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Empresa</h4>
            <ul className="space-y-4">
              <li><Link href="/sobre" className="text-gray-400 hover:text-green-neon text-sm transition-colors">Sobre Nós</Link></li>
              {/* <li><Link href="#" className="text-gray-400 hover:text-green-neon text-sm transition-colors">Blog</Link></li> */}
              {/* <li><Link href="#" className="text-gray-400 hover:text-green-neon text-sm transition-colors">Afiliados</Link></li> */}
              <li><Link href="/termos-de-uso" className="text-gray-400 hover:text-green-neon text-sm transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contato</h4>
            <ul className="space-y-4">
              <li><Link href="/suporte" className="text-gray-400 hover:text-green-neon text-sm transition-colors">Suporte</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-green-neon text-sm transition-colors">FAQ</Link></li>
              <li><Link href="mailto:contato@reidoprompt.com" className="text-gray-400 hover:text-green-neon text-sm transition-colors">contato@reidoprompt.com</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2026 Rei do Prompt. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/privacidade" className="text-gray-500 hover:text-white transition-colors text-sm">Privacidade</Link>
            <Link href="/termos" className="text-gray-500 hover:text-white transition-colors text-sm">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
