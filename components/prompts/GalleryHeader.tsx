'use client';

import { Search, SlidersHorizontal, Heart, Grid2X2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import type { Category } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

interface GalleryHeaderProps {
  categories: Category[];
}

export function GalleryHeader({ categories }: GalleryHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || "");
  const currentCategory = searchParams.get('category') || "";
  const currentSort = searchParams.get('sort') || "recentes";

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 on filter change
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchValue });
  };

  // const clearFilters = () => {
  //   setSearchValue("");
  //   router.push(pathname);
  // };

  return (
    <div className="flex flex-col gap-8 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Title & Subtitle */}
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Prompts de IA – <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon to-green-500">
            Os Melhores Prompts da Web
          </span>
        </h1>

        <p className="text-lg text-gray-400 leading-relaxed">
          Explore prompts premium para criação de imagens cinematográficas,
          retratos, cenas urbanas e identidades visuais realistas.
        </p>
      </div>

      {/* Search & Filters Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className={cn("h-5 w-5 transition-colors", isPending ? "text-green-neon animate-pulse" : "text-gray-500")} />
          </div>

          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Buscar prompts, categorias..."
            className="w-full pl-10 h-12 bg-black/40 border-transparent focus-visible:ring-1 focus-visible:ring-green-neon text-white rounded-xl placeholder:text-gray-500"
          />
          
          {searchValue && (
            <button 
              type="button"
              onClick={() => { setSearchValue(""); updateFilters({ search: null }); }}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">

          <Button
            variant="ghost"
            onClick={() => updateFilters({ category: null })}
            className={cn(
              "h-12 px-4 rounded-xl gap-2 whitespace-nowrap transition-all",
              !currentCategory 
                ? "bg-green-neon text-black hover:bg-green-neon/90 font-bold" 
                : "bg-white/5 hover:bg-white/10 text-white"
            )}
          >
            <Grid2X2 className="w-4 h-4" />
            Todos
          </Button>

          {/* Categories select or scrollable list */}
          <Select 
            value={currentCategory || "all"} 
            onValueChange={(val) => updateFilters({ category: val === "all" ? null : val })}
          >
            <SelectTrigger className={cn(
              "h-12 min-w-[140px] bg-black/40 border-white/10 rounded-xl text-white focus:ring-green-neon focus:ring-1",
              currentCategory && "border-green-neon/50 text-green-neon"
            )}>
              <SelectValue placeholder="Categorias" />
            </SelectTrigger>
            <SelectContent className="bg-[#121212] border-white/10 text-white rounded-xl">
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="focus:bg-white/10 focus:text-white">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            className="h-12 px-4 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white gap-2 whitespace-nowrap"
          >
            <Heart className="w-4 h-4" />
            Favoritos
          </Button>

          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

          <Select value={currentSort} onValueChange={(val) => updateFilters({ sort: val })}>
            <SelectTrigger className="h-12 w-[180px] bg-black/40 border-white/10 rounded-xl text-white focus:ring-green-neon focus:ring-1 overflow-hidden">
              <div className="flex items-center gap-2 truncate">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                <SelectValue placeholder="Ordenar" />
              </div>
            </SelectTrigger>

            <SelectContent
              className="bg-[#121212] border border-white/10 text-white rounded-xl overflow-hidden min-w-[180px]"
              position="popper"
              sideOffset={8}
            >
              <SelectItem value="recentes" className="focus:bg-white/10 focus:text-white cursor-pointer">
                Mais recentes
              </SelectItem>
              <SelectItem value="populares" className="focus:bg-white/10 focus:text-white cursor-pointer">
                Mais populares
              </SelectItem>
              <SelectItem value="favoritos" className="focus:bg-white/10 focus:text-white cursor-pointer">
                Mais favoritados
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
