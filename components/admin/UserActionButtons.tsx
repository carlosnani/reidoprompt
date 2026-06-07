"use client";

import { UserX, UserCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toggleProAccessAction, toggleUserBanAction } from "@/app/admin/actions";

interface UserActionButtonsProps {
  userId: string;
  isPro: boolean;
  isBanned: boolean;
}

export function UserActionButtons({ userId, isPro, isBanned }: UserActionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePro = async () => {
    setIsLoading(true);
    const result = await toggleProAccessAction(userId, isPro);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(isPro ? "Acesso Pro removido!" : "Acesso Pro concedido!");
    }
  };

  const handleToggleBan = async () => {
    setIsLoading(true);
    const result = await toggleUserBanAction(userId, isBanned);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(isBanned ? "Usuário desbanido!" : "Usuário banido!");
    }
  };

  // return (
  //   <div className="flex items-center gap-2">
  //     {/* Toggle Pro Button */}
  //     <Button
  //       variant="ghost"
  //       size="icon"
  //       title={isPro ? "Remover Pro" : "Dar Pro"}
  //       className="text-admin-text-muted hover:bg-admin-muted"
  //       onClick={handleTogglePro}
  //       disabled={isLoading}
  //     >
  //       {isPro ? (
  //         <UserX className="h-4 w-4 hover:text-admin-danger" />
  //       ) : (
  //         <UserCheck className="h-4 w-4 hover:text-admin-success" />
  //       )}
  //     </Button>

  //     {/* Toggle Ban Dialog */}
  //     <AlertDialog>
  //       <AlertDialogTrigger asChild>
  //         <Button
  //           variant="ghost"
  //           size="icon"
  //           title={isBanned ? "Desbanir Usuário" : "Banir Usuário"}
  //           className="text-admin-text-muted hover:bg-admin-muted"
  //           disabled={isLoading}
  //         >
  //           {isBanned ? (
  //             <ShieldCheck className="h-4 w-4 text-admin-success" />
  //           ) : (
  //             <ShieldAlert className="h-4 w-4 hover:text-admin-danger" />
  //           )}
  //         </Button>
  //       </AlertDialogTrigger>
  //       <AlertDialogContent className="border-admin-border bg-admin-surface bg-white">
  //         <AlertDialogHeader>
  //           <AlertDialogTitle className="text-admin-text text-black">
  //             {isBanned ? "Desbanir Usuário?" : "Banir Usuário?"}
  //           </AlertDialogTitle>
  //           <AlertDialogDescription className="text-admin-text-muted text-black">
  //             {isBanned
  //               ? "O usuário recuperará o acesso à plataforma imediatamente."
  //               : "O usuário perderá o acesso à plataforma imediatamente. Esta ação pode ser revertida depois."}
  //           </AlertDialogDescription>
  //         </AlertDialogHeader>
  //         <AlertDialogFooter>
  //           <AlertDialogCancel className="border-admin-border text-admin-text hover:bg-admin-muted">Cancelar</AlertDialogCancel>
  //           <AlertDialogAction
  //             onClick={(e) => {
  //               e.preventDefault();
  //               handleToggleBan();
  //             }}
  //             disabled={isLoading}
  //             className={isBanned ? "bg-admin-success hover:bg-admin-success/90 text-white" : "bg-admin-danger hover:bg-admin-danger/90 text-white"}
  //           >
  //             {isLoading ? "Processando..." : (isBanned ? "Desbanir" : "Banir")}
  //           </AlertDialogAction>
  //         </AlertDialogFooter>
  //       </AlertDialogContent>
  //     </AlertDialog>
  //   </div>
  // );
  return (
    <div className="flex items-center gap-2">
      {/* Toggle Pro Button */}
      <Button
        variant="ghost"
        size="icon"
        title={isPro ? "Remover Pro" : "Dar Pro"}
        className="text-admin-text-muted hover:bg-admin-muted hover:text-admin-text"
        onClick={handleTogglePro}
        disabled={isLoading}
      >
        {isPro ? (
          <UserX className="h-4 w-4" />
        ) : (
          <UserCheck className="h-4 w-4" />
        )}
      </Button>

      {/* Toggle Ban Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title={isBanned ? "Desbanir Usuário" : "Banir Usuário"}
            className="text-admin-text-muted hover:bg-admin-muted hover:text-admin-text"
            disabled={isLoading}
          >
            {isBanned ? (
              <ShieldCheck className="h-4 w-4 text-admin-success" />
            ) : (
              <ShieldAlert className="h-4 w-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-admin-surface border-admin-border text-admin-text">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-admin-text">
              {isBanned ? "Desbanir Usuário?" : "Banir Usuário?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-admin-text-muted">
              {isBanned
                ? "O usuário recuperará o acesso à plataforma imediatamente."
                : "O usuário perderá o acesso à plataforma imediatamente. Esta ação pode ser revertida depois."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-admin-border bg-admin-surface text-admin-text hover:bg-admin-muted">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleToggleBan();
              }}
              disabled={isLoading}
              className={
                isBanned
                  ? "bg-admin-success hover:bg-admin-success-hover text-white"
                  : "bg-admin-danger hover:bg-admin-danger-hover text-white"
              }
            >
              {isLoading ? "Processando..." : (isBanned ? "Desbanir" : "Banir")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
