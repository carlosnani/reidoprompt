"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  maxImages?: number;
}

export function ImageUploader({ maxImages = 6 }: ImageUploaderProps) {
  const [images, setImages] = useState<{ id: string; url: string; file: File }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const addFiles = (files: File[]) => {
    // Filter out non-images
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    
    // Calculate how many more we can add
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) return;

    const filesToAdd = validFiles.slice(0, remainingSlots);

    const newImages = filesToAdd.map((file) => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
    
    // Reset file input so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (idToRemove: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== idToRemove);
      // Revoke the object URL to avoid memory leaks
      const removed = prev.find((img) => img.id === idToRemove);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
  };

  return (
    <div className="space-y-6">
      {/* 🖼️ Grid de Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-admin-border-strong bg-admin-bg shadow-sm">
              <img src={image.url} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-[10px] text-white font-medium truncate">{image.file.name}</p>
              </div>
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
              <p className="text-lg font-bold text-admin-text">Click to upload or drag and drop</p>
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
