"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

export function UserSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    
    const params = new URLSearchParams(searchParams);
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    params.set("page", "1"); // Reseta para a página 1 ao buscar
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-sm:max-w-none max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-text-muted" />
      <Input
        name="q"
        type="search"
        placeholder="Buscar usuários por nome ou e-mail..."
        className="pl-8 bg-admin-surface border-admin-border text-admin-text"
        defaultValue={searchParams.get("q")?.toString() || ""}
        onChange={handleClear}
      />
    </form>
  );
}
