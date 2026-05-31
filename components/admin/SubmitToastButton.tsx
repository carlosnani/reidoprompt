"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import React, { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

interface SubmitToastButtonProps extends React.ComponentProps<typeof Button> {
  message: string;
}

export function SubmitToastButton({ message, onClick, children, ...props }: SubmitToastButtonProps) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      // Pequeno delay para garantir que o redirecionamento ou revalidação começou
      const timer = setTimeout(() => {
        toast.success(message);
      }, 100);
      return () => clearTimeout(timer);
    }
    wasPending.current = pending;
  }, [pending, message]);

  return (
    <Button type="submit" disabled={pending} onClick={onClick} {...props}>
      {children}
    </Button>
  );
}
