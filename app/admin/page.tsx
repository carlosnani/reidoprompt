import Link from "next/link";
import { Suspense } from "react";
import { InfoIcon } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

function AdminPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center">Carregando painel admin...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}

async function AdminDashboard() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Admin dashboard: acesso restrito apenas para usuários com permissão de administrador.
        </div>
      </div>

      <div className="grid gap-6">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Você está autenticado como administrador e pode acessar recursos exclusivos.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/protected"
              className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Voltar ao dashboard do usuário
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Seu perfil de administrador</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Verifique os dados da sessão atual e confirme as permissões.
            </p>
            <div className="mt-4 text-sm font-mono overflow-auto max-h-64 rounded-lg border bg-background p-4">
              <pre>{JSON.stringify({ user: data.user, session: user }, null, 2)}</pre>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Ações recomendadas</h2>
            <ul className="mt-4 list-disc pl-5 text-sm leading-7 text-muted-foreground">
              <li>Gerencie conteúdo compartilhado somente para administradores.</li>
              <li>Use `ADMIN_EMAIL` ou a claim `role: admin` no Supabase para controle de acesso.</li>
              <li>Consulte o painel de usuários no Supabase para gerenciar autenticação.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminPage;
