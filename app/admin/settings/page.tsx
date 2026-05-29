import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Save, Globe, CreditCard, Layout } from "lucide-react";
import { SubmitToastButton } from "@/components/admin/SubmitToastButton";

export default function AdminSettingsPage() {
  return (
    <div className="flex-1 space-y-8 max-w-4xl mx-auto w-full pb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Configurações</h2>
        <p className="text-admin-text-secondary">Gerencie as configurações globais e preferências da plataforma.</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card className="bg-admin-surface border-admin-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-admin-border-light bg-admin-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-admin-primary-soft text-admin-primary">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-admin-text">Detalhes da Plataforma</CardTitle>
                <CardDescription className="text-admin-text-muted">Informações básicas sobre sua plataforma SaaS.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="platformName" className="text-sm font-semibold text-admin-text">Nome da Plataforma</label>
                <Input id="platformName" defaultValue="Rei do Prompt" className="bg-admin-bg border-admin-border-strong text-admin-text focus-visible:ring-admin-primary" />
              </div>
              <div className="space-y-2">
                <label htmlFor="supportEmail" className="text-sm font-semibold text-admin-text">E-mail de Suporte</label>
                <Input id="supportEmail" type="email" defaultValue="suporte@reidoprompt.com" className="bg-admin-bg border-admin-border-strong text-admin-text focus-visible:ring-admin-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-admin-muted/20 border-t border-admin-border-light px-6 py-4 flex justify-end">
            <SubmitToastButton message="Detalhes da plataforma salvos com sucesso!" className="bg-admin-primary hover:bg-admin-primary-hover text-white">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </SubmitToastButton>
          </CardFooter>
        </Card>

        {/* Subscription / Payment Settings */}
        <Card className="bg-admin-surface border-admin-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-admin-border-light bg-admin-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-admin-primary-soft text-admin-primary">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-admin-text">Configuração de Assinatura</CardTitle>
                <CardDescription className="text-admin-text-muted">Gerencie os preços e as configurações do gateway de pagamento.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="monthlyPrice" className="text-sm font-semibold text-admin-text">Preço Mensal (R$)</label>
                <Input id="monthlyPrice" type="number" defaultValue="39.90" step="0.01" className="bg-admin-bg border-admin-border-strong text-admin-text focus-visible:ring-admin-primary" />
              </div>
              <div className="space-y-2">
                <label htmlFor="yearlyPrice" className="text-sm font-semibold text-admin-text">Preço Anual (R$)</label>
                <Input id="yearlyPrice" type="number" defaultValue="399.00" step="0.01" className="bg-admin-bg border-admin-border-strong text-admin-text focus-visible:ring-admin-primary" />
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-admin-info-soft border border-admin-info/20 text-sm text-admin-info flex gap-3 shadow-sm">
              <div className="shrink-0 mt-0.5">ℹ️</div>
              <p className="font-bold text-admin-text">As chaves da API do Stripe são gerenciadas com segurança via variáveis de ambiente e não são expostas neste painel.</p>
            </div>
          </CardContent>
          <CardFooter className="bg-admin-muted/20 border-t border-admin-border-light px-6 py-4 flex justify-end">
            <SubmitToastButton message="Configurações de assinatura salvas com sucesso!" className="bg-admin-primary hover:bg-admin-primary-hover text-white">
              <Save className="w-4 h-4 mr-2" />
              Salvar Configuração
            </SubmitToastButton>
          </CardFooter>
        </Card>

        {/* SEO Settings */}
        <Card className="bg-admin-surface border-admin-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-admin-border-light bg-admin-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-admin-primary-soft text-admin-primary">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-admin-text">SEO e Metadados</CardTitle>
                <CardDescription className="text-admin-text-muted">Configure as tags de SEO padrão para a plataforma.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label htmlFor="seoTitle" className="text-sm font-semibold text-admin-text">Título Meta Padrão</label>
              <Input id="seoTitle" defaultValue="Rei do Prompt - A maior galeria de Prompts" className="bg-admin-bg border-admin-border-strong text-admin-text focus-visible:ring-admin-primary" />
            </div>
            <div className="space-y-2">
              <label htmlFor="seoDesc" className="text-sm font-semibold text-admin-text">Descrição Meta Padrão</label>
              <textarea 
                id="seoDesc" 
                rows={4}
                className="flex w-full rounded-md border border-admin-border-strong bg-admin-bg px-3 py-2 text-sm ring-offset-background placeholder:text-admin-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 text-admin-text transition-all"
                defaultValue="Encontre e copie os melhores prompts testados para Midjourney, DALL-E, ChatGPT e muito mais."
              />
            </div>
          </CardContent>
          <CardFooter className="bg-admin-muted/20 border-t border-admin-border-light px-6 py-4 flex justify-end">
            <SubmitToastButton message="Dados de SEO salvos com sucesso!" className="bg-admin-primary hover:bg-admin-primary-hover text-white">
              <Save className="w-4 h-4 mr-2" />
              Salvar Dados de SEO
            </SubmitToastButton>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
