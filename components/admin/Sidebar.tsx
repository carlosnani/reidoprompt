"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Tags,
  Cpu,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";

export const sidebarLinks = [
  { name: "Painel", href: "/admin", icon: LayoutDashboard },
  { name: "Prompts", href: "/admin/prompts", icon: ImageIcon },
  { name: "Categorias", href: "/admin/categories", icon: Tags },
  { name: "Modelos de IA", href: "/admin/models", icon: Cpu },
  { name: "Usuários", href: "/admin/users", icon: Users },
  { name: "Configurações", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-admin-border bg-admin-surface/50 backdrop-blur-xl flex flex-col hidden md:flex sticky top-0 h-screen">
      <div className="h-16 flex items-center px-6 border-b border-admin-border">
        <Link href="/" className="font-bold text-xl flex items-center gap-1 text-admin-text">
           
            <div className="p-2 rounded-full bg-black border border-green-neon/20">
              <Image src="/logo.svg" alt="Logo" width={24} height={24} className="w-6 h-6 object-contain" />
            </div>
          
          O Rei do Prompt
        </Link>
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
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-admin-primary-soft text-admin-primary"
                    : "text-admin-text-secondary hover:bg-admin-muted hover:text-admin-text"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-admin-border">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-admin-text-secondary hover:text-admin-text hover:bg-admin-muted transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair do Admin
        </Link>
      </div>
    </aside>
  );
}
