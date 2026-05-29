'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavoriteAction } from '@/app/actions';
import { toast } from 'sonner';

interface FavoriteButtonCardProps {
  promptId: string;
  initialIsFavorite: boolean;
}

export function FavoriteButtonCard({ promptId, initialIsFavorite }: FavoriteButtonCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      const result = await toggleFavoriteAction(promptId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      setIsFavorite(result.isFavorite ?? !isFavorite);
    } catch (error) {
      toast.error('Erro ao favoritar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isLoading}
      className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
        isFavorite 
          ? 'bg-green-neon text-black scale-110' 
          : 'bg-black/40 border border-white/10 text-white hover:bg-white/10'
      }`}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
}
