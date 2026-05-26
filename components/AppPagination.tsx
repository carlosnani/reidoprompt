import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
  variant?: 'admin' | 'public';
}

export function AppPagination({ 
  currentPage, 
  totalPages, 
  baseUrl, 
  className,
  variant = 'public'
}: AppPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const url = new URL(baseUrl, 'http://localhost'); // dummy base for URL parsing
    url.searchParams.set('page', page.toString());
    return `${url.pathname}${url.search}`;
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const isAdmin = variant === 'admin';

  const linkStyles = isAdmin 
    ? "text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted/50 border-admin-border rounded-md"
    : "text-gray-400 hover:text-white hover:bg-white/10 border-transparent rounded-xl";

  const activeStyles = isAdmin
    ? "bg-admin-primary text-white hover:bg-admin-primary-hover border-admin-primary"
    : "bg-green-neon text-black hover:bg-green-neon/90 hover:text-black font-bold border-none";

  // Logic to show a few pages around current page
  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={cn("flex w-full justify-center py-4", className)}>
      <Pagination>
        <PaginationContent className={cn("gap-1", !isAdmin && "gap-2")}>
          <PaginationItem>
            <PaginationPrevious 
              href={isFirstPage ? "#" : getPageUrl(currentPage - 1)}
              className={cn(
                linkStyles,
                isFirstPage && "opacity-50 pointer-events-none"
              )}
            />
          </PaginationItem>

          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink href={getPageUrl(1)} className={linkStyles}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && <PaginationEllipsis className={isAdmin ? "text-admin-text-muted" : "text-gray-500"} />}
            </>
          )}

          {pageNumbers.map(page => (
            <PaginationItem key={page}>
              <PaginationLink 
                href={getPageUrl(page)}
                isActive={page === currentPage}
                className={cn(
                  linkStyles,
                  page === currentPage && activeStyles
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <PaginationEllipsis className={isAdmin ? "text-admin-text-muted" : "text-gray-500"} />}
              <PaginationItem>
                <PaginationLink href={getPageUrl(totalPages)} className={linkStyles}>{totalPages}</PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext 
              href={isLastPage ? "#" : getPageUrl(currentPage + 1)}
              className={cn(
                linkStyles,
                isLastPage && "opacity-50 pointer-events-none"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
