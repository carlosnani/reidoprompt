import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function GalleryPagination() {
  return (
    <div className="mt-16 mb-8 w-full flex justify-center animate-in fade-in duration-1000 delay-300">
      <Pagination>
        <PaginationContent className="gap-2">
          
          <PaginationItem>
            {/* 
              Estilização customizada para dark mode:
              Normal: fundo invisível, texto cinza
              Hover: fundo verde-neon muito sutil, texto branco
              Desativado (exemplo na seta esq se fosse página 1): opacidade baixa
            */}
            <PaginationPrevious 
              href="#" 
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
            />
          </PaginationItem>

          <PaginationItem>
            {/* Active state */}
            <PaginationLink 
              href="#" 
              isActive 
              className="bg-green-neon text-black hover:bg-green-neon/90 hover:text-black font-bold border-none rounded-xl"
            >
              1
            </PaginationLink>
          </PaginationItem>
          
          <PaginationItem>
            <PaginationLink 
              href="#"
              className="text-gray-400 hover:text-white hover:bg-white/10 border-transparent rounded-xl"
            >
              2
            </PaginationLink>
          </PaginationItem>
          
          <PaginationItem>
            <PaginationLink 
              href="#"
              className="text-gray-400 hover:text-white hover:bg-white/10 border-transparent rounded-xl hidden sm:flex"
            >
              3
            </PaginationLink>
          </PaginationItem>

          <PaginationItem className="hidden sm:flex text-gray-500">
            <PaginationEllipsis />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink 
              href="#"
              className="text-gray-400 hover:text-white hover:bg-white/10 border-transparent rounded-xl"
            >
              8
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext 
              href="#" 
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  );
}
