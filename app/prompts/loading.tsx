import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212]">
      <div className="relative z-50">
        <Header />
      </div>

      <main className="flex-grow relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="max-w-3xl space-y-4">
            <Skeleton className="h-12 w-3/4 bg-white/5 rounded-xl" />
            <Skeleton className="h-6 w-1/2 bg-white/5 rounded-lg" />
          </div>
          <Skeleton className="h-16 w-full bg-white/5 rounded-2xl border border-white/10" />
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden aspect-[4/5] p-4 flex flex-col gap-4">
              <Skeleton className="w-full aspect-square bg-white/10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4 bg-white/10 rounded-lg" />
                <Skeleton className="h-4 w-1/2 bg-white/10 rounded-lg" />
              </div>
              <div className="mt-auto flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-16 bg-white/10 rounded-md" />
                <Skeleton className="h-8 w-24 bg-white/10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}
