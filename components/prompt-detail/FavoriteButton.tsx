'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { toggleFavoriteAction } from '@/app/actions';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  promptId: string;
  initialIsFavorite: boolean;
}

export function FavoriteButton({ promptId, initialIsFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await toggleFavoriteAction(promptId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      setIsFavorite(result.isFavorite ?? !isFavorite);
      toast.success(result.isFavorite ? 'Adicionado aos favoritos!' : 'Removido dos favoritos.');
    } catch (error) {
      toast.error('Ocorreu um erro ao processar sua solicitação.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleToggle}
      disabled={isLoading}
      className={`bg-transparent border-white/10 text-white hover:bg-green-neon/10 hover:text-green-neon hover:border-green-neon/30 transition-all h-10 ${isFavorite ? 'text-green-neon border-green-neon/50 bg-green-neon/5' : ''}`}
    >
      {isFavorite ? (
        <>
          <BookmarkCheck className="w-4 h-4 mr-2" />
          Favoritado
        </>
      ) : (
        <>
          <BookmarkPlus className="w-4 h-4 mr-2" />
          Favoritar
        </>
      )}
    </Button>
  );
}
