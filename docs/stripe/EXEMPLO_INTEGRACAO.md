// EXEMPLO DE INTEGRAÇÃO NA PÁGINA DE PLANOS
// Substitua a seção de botões com este código:

// No seu app/planos/page.tsx, importe:
import { useUser } from '@/lib/supabase/hooks/use-user';
import { StripeCheckoutButton } from '@/components/stripe-checkout-button';

export default function PricingPage() {
  const { user } = useUser();
  const [monthlyPrice, setMonthlyPrice] = useState<string>("4,99");
  const [yearlyPrice, setYearlyPrice] = useState<string>("44,90");

  // ... resto do código

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      {/* ... Header e background */}
      
      <main className="flex-1 relative pb-24 pt-40">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* ... Título e badge */}
          
          {/* 💳 Grid de Planos */}
          <motion.div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Free Plan */}
            <motion.div className="h-full">
              <Card className="h-full flex flex-col border-white/5 bg-white/5 backdrop-blur-xl">
                {/* ... conteúdo do plano free */}
                
                <CardFooter className="mt-auto">
                  {user ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled
                    >
                      Você está no plano Free
                    </Button>
                  ) : (
                    <Button 
                      asChild 
                      className="w-full"
                    >
                      <Link href="/auth/sign-up">Começar Grátis</Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div className="h-full">
              <Card className="h-full flex flex-col border-green-neon/30 bg-green-neon/5 backdrop-blur-xl relative overflow-hidden group">
                {/* Badge Popular */}
                <div className="absolute top-4 right-4 bg-green-neon/20 text-green-neon px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Popular
                </div>

                {/* ... conteúdo do plano premium */}

                <CardFooter className="mt-auto">
                  {user ? (
                    <StripeCheckoutButton
                      priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!}
                      userId={user.id}
                      email={user.email || ''}
                      className="w-full bg-green-neon hover:bg-green-dark text-black font-bold"
                    >
                      Assinar por R${monthlyPrice}/mês
                    </StripeCheckoutButton>
                  ) : (
                    <Button 
                      asChild 
                      className="w-full bg-green-neon hover:bg-green-dark text-black font-bold"
                    >
                      <Link href="/auth/sign-up">Assinar Agora</Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* ... Footer */}
    </div>
  );
}
