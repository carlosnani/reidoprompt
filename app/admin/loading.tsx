import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48 bg-admin-muted/50 rounded-lg" />
        <Skeleton className="h-10 w-32 bg-admin-muted/50 rounded-lg" />
      </div>

      <div className="border border-admin-border rounded-md bg-admin-surface shadow-sm overflow-hidden">
        <div className="w-full">
          {/* Table Header */}
          <div className="h-12 border-b border-admin-border bg-admin-muted/30 flex items-center px-4 gap-4">
            <Skeleton className="h-4 w-12 bg-admin-muted" />
            <Skeleton className="h-4 w-48 bg-admin-muted" />
            <Skeleton className="h-4 w-24 bg-admin-muted" />
            <Skeleton className="h-4 w-16 bg-admin-muted ml-auto" />
          </div>
          
          {/* Table Rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 border-b border-admin-border flex items-center px-4 gap-4">
              <Skeleton className="h-10 w-10 bg-admin-muted rounded-md" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-48 bg-admin-muted" />
                <Skeleton className="h-3 w-32 bg-admin-muted" />
              </div>
              <Skeleton className="h-5 w-20 bg-admin-muted rounded-full ml-auto" />
              <Skeleton className="h-8 w-8 bg-admin-muted rounded-md" />
              <Skeleton className="h-8 w-8 bg-admin-muted rounded-md" />
            </div>
          ))}
        </div>
        
        {/* Pagination Skeleton */}
        <div className="h-16 bg-admin-muted/20 flex items-center justify-center">
          <Skeleton className="h-8 w-64 bg-admin-muted" />
        </div>
      </div>
    </div>
  );
}
