import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./MobileSidebar";

export function Header() {
  return (
    <header className="h-16 border-b border-admin-border bg-admin-surface/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        <MobileSidebar />
        <div className="w-full max-w-md hidden md:flex items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-admin-text-muted" />
          <Input
            type="search"
            placeholder="Search across admin..."
            className="w-full pl-9 bg-admin-muted border-transparent focus-visible:bg-admin-surface focus-visible:border-admin-primary text-admin-text placeholder:text-admin-text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-admin-primary rounded-full" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="w-8 h-8 rounded-full bg-admin-muted overflow-hidden border border-admin-border">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
