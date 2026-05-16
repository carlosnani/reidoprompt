"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { addAiModelAction } from "../app/admin/actions";

type ActionState = {
  error?: string;
  success?: boolean;
} | null;

export function AddAiModelForm() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    addAiModelAction,
    null
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success("Modelo criado com sucesso!");
      // Opcional: resetar o formulário após sucesso
      const form = document.querySelector("form[action]");
      if (form) (form as HTMLFormElement).reset();
    }
  }, [state]);

  return (
    <Card className="bg-admin-surface border-admin-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-admin-text">Add AI Model</CardTitle>
        <CardDescription className="text-admin-text-muted">
          Register a new AI model for prompts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-admin-text">
              Model Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Midjourney v6"
              required
              disabled={isPending}
              className="bg-admin-bg border-admin-border text-admin-text"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="provider" className="text-sm font-medium text-admin-text">
              Provider
            </label>
            <Input
              id="provider"
              name="provider"
              placeholder="e.g. Midjourney"
              disabled={isPending}
              className="bg-admin-bg border-admin-border text-admin-text"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium text-admin-text">
              Slug
            </label>
            <Input
              id="slug"
              name="slug"
              placeholder="e.g. midjourney-v6"
              required
              disabled={isPending}
              className="bg-admin-bg border-admin-border text-admin-text"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-admin-primary hover:bg-admin-primary-hover text-white disabled:opacity-50"
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Salvando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Model
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}