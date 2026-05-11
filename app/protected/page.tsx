import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/lib/supabase/auth";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

function ProtectedPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center">Carregando dashboard...</div>}>
      <ProtectedDashboard />
    </Suspense>
  );
}

async function ProtectedDashboard() {
  const user = await requireUser();
  const adminEmail =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const isAdmin =
    user.user_metadata?.role === "admin" ||
    (!!adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase());

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Welcome to your user dashboard.
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Minha área de usuário</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Aqui você encontra as informações da sessão atual e as próximas ações.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Função:</strong> {user.user_metadata?.role ?? "usuário comum"}
            </p>
          </div>
          {isAdmin ? (
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/admin"
                className="inline-flex rounded-md border border-border bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
              >
                Ir para painel admin
              </Link>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Detalhes da sessão</h2>
          <div className="mt-4 overflow-auto rounded-lg border bg-background p-4 text-xs font-mono max-h-64">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-2xl mb-4">Próximos passos</h2>
        <FetchDataSteps />
      </section>
    </div>
  );
}

export default ProtectedPage;
