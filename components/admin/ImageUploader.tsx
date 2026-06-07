"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage, deleteImage } from "@/lib/supabase/storage";
import { compressImage } from "@/lib/utils/image";
import { toast } from "sonner";

interface ImageUploaderProps {
  maxImages?: number;
  onImagesChange?: (urls: string[]) => void;
  defaultValue?: string[];
  name?: string; // name for the hidden input
}

export function ImageUploader({ 
  maxImages = 6, 
  onImagesChange, 
  defaultValue = [],
  name = "images"
}: ImageUploaderProps) {
  const [images, setImages] = useState<{ id: string; url: string; path?: string; uploading: boolean }[]>(
    defaultValue.map((url, i) => ({ id: i.toString(), url, uploading: false }))
  );
  const imagesRef = useRef(images);

  // Keep a ref in sync with latest images state so async callbacks can read current value
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await addFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      await addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const addFiles = async (files: File[]) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Você só pode enviar até ${maxImages} imagens.`);
      return;
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);
    
    // Create placeholder states
    const placeholders = filesToAdd.map((file) => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      uploading: true,
    }));

    setImages((prev) => [...prev, ...placeholders]);

    // Upload files sequentially or in parallel? Parallel for better UX
    const uploadPromises = filesToAdd.map(async (file, index) => {
      const placeholderId = placeholders[index].id;
      try {
        // 🚀 Otimização: Comprime a imagem antes de enviar para o Supabase
        const compressedFile = await compressImage(file, 1200, 0.8);
        const { url, path } = await uploadImage(compressedFile);
        console.debug("ImageUploader: upload success", { file: file.name, url, path, originalSize: file.size, compressedSize: compressedFile.size });
        
        setImages((prev) => 
          prev.map((img) => 
            img.id === placeholderId ? { ...img, url, path, uploading: false } : img
          )
        );
        return url;
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Erro ao enviar ${file.name}`);
        setImages((prev) => prev.filter((img) => img.id !== placeholderId));
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUrls = results.filter((url): url is string => url !== null);
    
    if (onImagesChange) {
      const currentUrls = imagesRef.current.filter(img => !img.uploading).map(img => img.url);
      const all = [...currentUrls, ...successfulUrls];
      console.debug("ImageUploader: reporting images to form", { all });
      onImagesChange(all);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = async (idToRemove: string) => {
    // Optimistic UI update
    setImages((prev) => prev.filter((img) => img.id !== idToRemove));

    console.debug("ImageUploader: removed image from UI", { idToRemove, remaining: imagesRef.current.map(i=>i.url) });
    if (onImagesChange) {
      const remainingUrls = imagesRef.current
        .filter(img => img.id !== idToRemove && !img.uploading)
        .map(img => img.url);
      onImagesChange(remainingUrls);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🖼️ Grid de Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-admin-border-strong bg-admin-bg shadow-sm">
              <img src={image.url} alt="Preview" className={`w-full h-full object-cover transition-transform duration-500 ${image.uploading ? 'opacity-50 blur-sm' : 'group-hover:scale-110'}`} />
              
              {image.uploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-admin-primary animate-spin" />
                </div>
              )}

              {!image.uploading && (
                <>
                  <div className="absolute inset-0 bg-admin-text/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2 backdrop-blur-[2px]">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-xl shadow-lg"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Hidden inputs to send URLs with the form */}
                  <input type="hidden" name={name} value={image.url} />
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 📤 Área de Upload */}
      {images.length < maxImages && (
        <div
          className="relative group"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-admin-primary/20 to-admin-info/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative border-2 border-dashed border-admin-border-strong rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer bg-admin-bg/50 group-hover:bg-admin-surface group-hover:border-admin-primary/50 transition-all duration-300">
            <div className="p-4 bg-admin-primary-soft text-admin-primary rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-admin-text">Clique para enviar ou arraste e solte</p>
              <p className="text-sm text-admin-text-muted">
                Suporta PNG, JPG, WEBP e SVG (Máx. 5MB)
              </p>
              <p className="text-xs font-semibold text-admin-primary mt-2">
                Capacidade: {images.length} de {maxImages} imagens
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
