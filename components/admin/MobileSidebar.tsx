"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sidebarLinks } from "./Sidebar";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
        <Menu className="w-5 h-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setOpen(false)} 
          />
          
          {/* Sidebar drawer */}
          <div className="relative w-64 max-w-sm bg-background flex flex-col shadow-2xl animate-in slide-in-from-left-4 duration-200">
            <div className="h-16 flex items-center justify-between px-6 border-b">
              <Link href="/" className="font-bold text-xl flex items-center gap-2" onClick={() => setOpen(false)}>
                <span className="bg-primary text-primary-foreground p-1 rounded-md">
                  <ImageIcon className="w-5 h-5" />
                </span>
                Admin
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="grid gap-1 px-4">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/admin" && pathname.startsWith(link.href));

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                onClick={() => setOpen(false)}
              >
                <LogOut className="w-4 h-4" />
                Exit Admin
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
