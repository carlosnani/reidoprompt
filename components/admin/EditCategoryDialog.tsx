"use client";

import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { editCategoryAction } from "@/app/admin/actions";

interface EditCategoryDialogProps {
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);

    const result = await editCategoryAction(category.id, formData);
    setIsSaving(false);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Categoria atualizada com sucesso!");
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-admin-primary hover:bg-admin-primary-soft">
          <Edit className="w-4 h-4" />
          <span className="sr-only">Editar</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-admin-border bg-admin-surface text-admin-text max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Categoria</AlertDialogTitle>
          <AlertDialogDescription className="text-admin-text-muted">
            Altere o nome e o slug da categoria abaixo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-admin-text">Nome</Label>
            <Input 
              id="edit-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="bg-admin-bg border-admin-border text-admin-text focus-visible:ring-admin-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-slug" className="text-admin-text">Slug</Label>
            <Input 
              id="edit-slug" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              required 
              className="bg-admin-bg border-admin-border text-admin-text focus-visible:ring-admin-primary/50"
            />
          </div>

          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel 
              type="button" 
              onClick={() => setIsOpen(false)} 
              disabled={isSaving}
              className="border-admin-border text-admin-text hover:bg-admin-muted"
            >
              Cancelar
            </AlertDialogCancel>
            <Button 
              type="submit" 
              disabled={isSaving}
              className="bg-admin-primary hover:bg-admin-primary-hover text-white min-w-[120px]"
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
