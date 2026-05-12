"use client";

import { Card } from "./ui/card";
import { MessageSquare, Image, Video, PenTool, Type, Mic, Wand2, Hexagon } from "lucide-react";

export function ToolsGrid() {
  const tools = [
    { name: "ChatGPT", icon: MessageSquare, color: "text-emerald-400" },
    { name: "Midjourney", icon: Image, color: "text-purple-400" },
    { name: "Claude", icon: Type, color: "text-amber-400" },
    { name: "Gemini", icon: Hexagon, color: "text-blue-400" },
    { name: "Runway", icon: Video, color: "text-pink-400" },
    { name: "Leonardo AI", icon: Wand2, color: "text-orange-400" },
    { name: "Canva IA", icon: PenTool, color: "text-cyan-400" },
    { name: "ElevenLabs", icon: Mic, color: "text-red-400" }
  ];

  return (
    <section id="ferramentas" className="py-24 px-6 max-w-[1440px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Confuso sobre qual IA escolher?
        </h2>
        <p className="text-gray-400 text-lg">Descubra nossa coleção premium de ferramentas</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {tools.map((tool, i) => (
          <Card 
            key={i}
            className="group bg-black/40 border border-white/5 hover:border-green-neon/40 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:bg-white/[0.02]"
          >
            <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/10 ${tool.color}`}>
              <tool.icon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-gray-200 group-hover:text-white transition-colors">{tool.name}</h3>
          </Card>
        ))}
      </div>
    </section>
  );
}
