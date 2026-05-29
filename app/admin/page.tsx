import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ImageIcon, CreditCard, Activity } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function AdminDashboardPage() {
  await requireAdmin();
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-admin-surface border-admin-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">
              Receita Total
            </CardTitle>
            <CreditCard className="h-4 w-4 text-admin-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">R$ 15.231,89</div>
            <p className="text-xs text-admin-text-muted">
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card className="bg-admin-surface border-admin-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">
              Assinaturas Ativas
            </CardTitle>
            <Users className="h-4 w-4 text-admin-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">+2350</div>
            <p className="text-xs text-admin-text-muted">
              +180.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card className="bg-admin-surface border-admin-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">Total de Prompts</CardTitle>
            <ImageIcon className="h-4 w-4 text-admin-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">+12.234</div>
            <p className="text-xs text-admin-text-muted">
              +19% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card className="bg-admin-surface border-admin-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">
              Ativos Agora
            </CardTitle>
            <Activity className="h-4 w-4 text-admin-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">+573</div>
            <p className="text-xs text-admin-text-muted">
              +201 na última hora
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-admin-surface border-admin-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-admin-text">Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 flex justify-center items-center h-[300px] text-admin-text-muted border-2 border-dashed border-admin-border m-4 rounded-lg bg-admin-muted/50">
            [Espaço para Gráfico]
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-admin-surface border-admin-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-admin-text">Assinantes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-admin-primary-soft text-admin-primary flex items-center justify-center font-bold">
                    U{i}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-admin-text">Usuário {i}</p>
                    <p className="text-sm text-admin-text-muted">
                      usuario{i}@exemplo.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-admin-success">
                    +R$ 39,00
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
