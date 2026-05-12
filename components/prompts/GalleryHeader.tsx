import { Search, SlidersHorizontal, Heart, Grid2X2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GalleryHeader() {
  return (
    <div className="flex flex-col gap-8 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Title & Subtitle */}
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Prompts de IA – <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon to-green-500">
            Coleção Cinematográfica & Identidade
          </span>
        </h1>

        <p className="text-lg text-gray-400 leading-relaxed">
          Explore prompts premium para criação de imagens cinematográficas,
          retratos, cenas urbanas e identidades visuais realistas.
        </p>
      </div>

      {/* Search & Filters Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">

        {/* Search */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>

          <Input
            type="text"
            placeholder="Buscar prompts, categorias..."
            className="w-full pl-10 h-12 bg-black/40 border-transparent focus-visible:ring-1 focus-visible:ring-green-neon text-white rounded-xl placeholder:text-gray-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-hidden">

          <Button
            variant="ghost"
            className="h-12 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white gap-2 whitespace-nowrap"
          >
            <Grid2X2 className="w-4 h-4" />
            Todos os prompts
          </Button>

          <Button
            variant="ghost"
            className="h-12 px-4 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white gap-2 whitespace-nowrap"
          >
            <Heart className="w-4 h-4" />
            Favoritos
          </Button>

          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

          <Select defaultValue="recentes">
            <SelectTrigger className="h-12 w-[180px] bg-black/40 border-white/10 rounded-xl text-white focus:ring-green-neon focus:ring-1 overflow-hidden">
              <div className="flex items-center gap-2 truncate">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                <SelectValue placeholder="Ordenar" />
              </div>
            </SelectTrigger>

            <SelectContent
              className="
                bg-[#121212]
                border border-white/10
                text-white
                rounded-xl
                overflow-hidden
                min-w-[180px]
              "
              
              position="popper"
              sideOffset={8}
            >
              <SelectItem
                value="recentes"
                className="focus:bg-white/10 focus:text-white cursor-pointer"
              >
                Mais recentes
              </SelectItem>

              <SelectItem
                value="populares"
                className="focus:bg-white/10 focus:text-white cursor-pointer"
              >
                Mais populares
              </SelectItem>

              <SelectItem
                value="favoritos"
                className="focus:bg-white/10 focus:text-white cursor-pointer"
              >
                Mais favoritados
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}