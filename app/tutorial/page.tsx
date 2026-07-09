import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Sparkles, Wand2, Camera, MessageSquareText, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const steps = [
  {
    icon: MessageSquareText,
    title: "1. Defina o prompt",
    text: "Escreva a descrição da imagem que você quer gerar. Quanto mais específico, melhor o resultado.",
  },
  {
    icon: Camera,
    title: "2. Escolha a referência",
    text: "Você pode gerar com apenas o prompt ou adicionar uma foto para guiar o estilo, o cenário ou a composição.",
  },
  {
    icon: Wand2,
    title: "3. Gera e refine",
    text: "Ajuste detalhes, experimente variações e obtenha imagens mais próximas do que você imaginou.",
  },
];

const options = [
  {
    title: "Prompt simples",
    description: "Ideal para criar imagens rápidas a partir de uma ideia textual.",
    icon: Sparkles,
  },
  {
    title: "Prompt + imagem de referência",
    description: "Ideal para manter estilo, composição e identidade visual mais próximas do seu objetivo.",
    icon: ImagePlus,
  },
];

export default function TutorialPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050505] text-white pt-24">
        <section className="mx-auto flex max-w-6xl flex-col px-6 py-16 md:px-8 lg:px-10">
          <Link
            href="/"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-gray-400 transition hover:text-green-neon"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-12">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-neon">
                Tutorial rápido
              </p>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Como gerar imagens com o melhor resultado
              </h1>
              <p className="mt-4 text-base leading-8 text-gray-400 md:text-lg">
                Se você não está logado, ainda pode entender o fluxo básico. Você pode gerar imagens com apenas um prompt ou enriquecer o resultado com uma foto de referência para deixar a criação mais fiel à sua ideia.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.title}
                    className="rounded-2xl border border-white/10 bg-black/30 p-6"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-green-neon/20 bg-green-neon/10 text-green-neon">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">{option.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-gray-400">{option.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="rounded-2xl border border-white/10 bg-black/20 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-green-neon">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-gray-400">{step.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <h2 className="text-xl font-semibold text-white">Exemplo com imagem de referência</h2>
                <p className="mt-3 text-sm leading-7 text-gray-400">
                  Quando você usa uma foto de referência, o resultado fica mais alinhado com o estilo visual desejado. Veja abaixo um exemplo do fluxo com imagem inicial e imagem final.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <Image
                      src="/home/inicial.jpg"
                      alt="Imagem inicial de referência"
                      width={600}
                      height={400}
                      className="h-48 w-full object-cover"
                    />
                    <p className="px-4 py-3 text-sm text-gray-400">Imagem de referência</p>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <Image
                      src="/home/final.jpeg"
                      alt="Imagem final gerada a partir da referência"
                      width={600}
                      height={400}
                      className="h-48 w-full object-cover"
                    />
                    <p className="px-4 py-3 text-sm text-gray-400">Resultado final</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-green-neon/20 bg-green-neon/10 p-6">
                <h2 className="text-xl font-semibold text-white">Quando usar cada opção</h2>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-neon" />
                    Use somente o prompt para ideias rápidas, conceitos e testes imediatos.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-neon" />
                    Use prompt + referência quando você quer preservar estilo, composição ou identidade visual.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-neon" />
                    Combine as duas abordagens para chegar mais perto do resultado desejado.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
