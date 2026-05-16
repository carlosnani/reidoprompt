"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import React from "react";

interface SubmitToastButtonProps extends React.ComponentProps<typeof Button> {
  message: string;
}

export function SubmitToastButton({ message, onClick, children, ...props }: SubmitToastButtonProps) {
  // Se estamos usando em um formulário real com Server Actions, NÃO fazemos preventDefault
  return (
    <Button type="submit" onClick={onClick} {...props}>
      {children}
    </Button>
  );
}
