"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import React from "react";

interface SubmitToastButtonProps extends React.ComponentProps<typeof Button> {
  message: string;
}

export function SubmitToastButton({ message, onClick, children, ...props }: SubmitToastButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Evita o reload da página enquanto estamos usando dados mockados (sem action real de form)
    e.preventDefault();
    
    // Mostra a confirmação visual
    toast.success(message);
    
    // Se houver lógica adicional passada via prop, executa
    if (onClick) onClick(e);
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
