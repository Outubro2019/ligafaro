
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from './Dashboard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="space-y-12">
      <section className="pb-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Bem-vindo ao LigaFaro
          </h1>
          <p className="text-xl text-muted-foreground">
            Conecte-se com a sua comunidade, descubra eventos locais e muito mais.
          </p>
          <div className="mt-4">
            <Button className="gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Explorar Painel <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-soft-blue p-6 transition-all hover:shadow-md">
          <h3 className="font-display font-semibold text-xl mb-2">Eventos Locais</h3>
          <p className="text-muted-foreground">Descubra o que está a acontecer em Faro esta semana.</p>
        </div>
        <div className="rounded-xl bg-soft-peach p-6 transition-all hover:shadow-md">
          <h3 className="font-display font-semibold text-xl mb-2">Fórum da Comunidade</h3>
          <p className="text-muted-foreground">Participe em discussões e conecte-se com os vizinhos.</p>
        </div>
        <div className="rounded-xl bg-soft-green p-6 transition-all hover:shadow-md">
          <h3 className="font-display font-semibold text-xl mb-2">Mercado</h3>
          <p className="text-muted-foreground">Compre, venda e troque localmente com membros da comunidade.</p>
        </div>
      </div>
      
      <div className="bg-soft-purple rounded-xl p-8">
        <h2 className="font-display text-2xl font-semibold mb-4">Próximos Eventos em Faro</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white/80 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-500">Este Fim-de-semana</p>
            <h3 className="font-semibold">Dia de Limpeza da Praia</h3>
            <p className="text-muted-foreground text-sm">Junte-se a nós para manter as nossas praias bonitas</p>
          </div>
          <div className="bg-white/80 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-500">Próxima Semana</p>
            <h3 className="font-semibold">Festival de Gastronomia Local</h3>
            <p className="text-muted-foreground text-sm">Prove a melhor cozinha local</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
