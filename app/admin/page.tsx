import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ImageIcon, CreditCard, UserCheck } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import stripe from "@/lib/stripe";
import { AdminChart } from "@/components/admin/AdminChart";

export default async function AdminDashboardPage() {
  await requireAdmin();
  
  const adminSupabase = createServiceRoleClient();

  // 1. Total Prompts
  let promptsCount = 0;
  try {
    const { count } = await adminSupabase
      .from('prompts')
      .select('*', { count: 'exact', head: true });
    promptsCount = count || 0;
  } catch (err) {
    console.error("Error fetching prompts count:", err);
  }

  // 2. Fetch all users from Supabase Auth
  let users: any[] = [];
  try {
    const { data } = await adminSupabase.auth.admin.listUsers({ perPage: 1000 });
    users = data?.users || [];
  } catch (err) {
    console.error("Error listing auth users:", err);
  }

  const totalUsers = users.length;

  // Active subscriptions from user metadata
  const activeSubscriptions = users.filter(
    u => u.user_metadata?.plan === 'pro' || u.user_metadata?.subscription === 'active'
  ).length;

  // 3. Stripe Invoice metrics for Revenue calculation
  let totalRevenue = 0;
  try {
    const charges = await stripe.charges.list({ limit: 100 });
    totalRevenue = charges.data
      .filter(c => c.paid && !c.refunded)
      .reduce((sum, c) => sum + c.amount, 0) / 100;
  } catch (err) {
    console.error("Error listing stripe charges:", err);
  }

  // 4. Last 6 Months Growth Data
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(1); // avoid month overflow issues
    d.setMonth(d.getMonth() - i);
    return {
      monthName: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
      year: d.getFullYear(),
      monthNum: d.getMonth(),
      newUsers: 0,
      paidUsers: 0,
    };
  }).reverse();

  users.forEach(u => {
    const date = new Date(u.created_at);
    const userMonth = date.getMonth();
    const userYear = date.getFullYear();
    const isPaid = u.user_metadata?.plan === 'pro' || u.user_metadata?.subscription === 'active';

    const monthObj = last6Months.find(m => m.monthNum === userMonth && m.year === userYear);
    if (monthObj) {
      monthObj.newUsers += 1;
      if (isPaid) {
        monthObj.paidUsers += 1;
      }
    }
  });

  // 5. Recent signups
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Receita Total */}
        <Card className="bg-admin-surface border-admin-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">
              Receita Total
            </CardTitle>
            <CreditCard className="h-4 w-4 text-admin-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">
              {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-admin-text-muted">
              Faturamento real do Stripe
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Assinaturas Ativas */}
        <Card className="bg-admin-surface border-admin-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">
              Assinaturas Ativas
            </CardTitle>
            <Users className="h-4 w-4 text-admin-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">+{activeSubscriptions}</div>
            <p className="text-xs text-admin-text-muted">
              Usuários ativos com plano PRO
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Total de Prompts */}
        <Card className="bg-admin-surface border-admin-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">Total de Prompts</CardTitle>
            <ImageIcon className="h-4 w-4 text-admin-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">+{promptsCount}</div>
            <p className="text-xs text-admin-text-muted">
              Prompts cadastrados na plataforma
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Usuários Totais */}
        <Card className="bg-admin-surface border-admin-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-text">
              Usuários Totais
            </CardTitle>
            <UserCheck className="h-4 w-4 text-admin-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-text">+{totalUsers}</div>
            <p className="text-xs text-admin-text-muted">
              Cadastrados no banco de dados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico de Visão Geral */}
        <div className="col-span-4">
          <AdminChart data={last6Months} />
        </div>

        {/* Usuários Recentes */}
        <Card className="col-span-3 bg-admin-surface border-admin-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-admin-text">Usuários Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentUsers.map((user) => {
                const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário';
                const isPaid = user.user_metadata?.plan === 'pro' || user.user_metadata?.subscription === 'active';
                return (
                  <div key={user.id} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-admin-primary-soft text-admin-primary flex items-center justify-center font-bold text-sm">
                      {name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none text-admin-text">{name}</p>
                      <p className="text-xs text-admin-text-muted truncate max-w-[150px] sm:max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                    <div className={`ml-auto font-bold text-[10px] px-2.5 py-1 rounded-full ${
                      isPaid 
                        ? 'bg-green-neon/10 text-green-neon border border-green-neon/20' 
                        : 'bg-white/5 text-gray-500 border border-white/5'
                    }`}>
                      {isPaid ? 'PRO' : 'FREE'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
