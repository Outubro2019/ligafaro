import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Users, 
  ShoppingBag, 
  Heart, 
  Sun,
  Moon,
  Newspaper
} from 'lucide-react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserMenu } from './UserMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sky-blue">
        <AppSidebar />
        <SidebarInset className="pb-8">
          <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">LigaFaro</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">{children}</main>
          <footer className="text-center p-6 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} LigaFaro. Todos os direitos reservados.</p>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navigationItems = [
    { name: 'Painel Principal', path: '/', icon: LayoutDashboard },
    { name: 'Eventos', path: '/events', icon: Calendar },
    { name: 'Notícias', path: '/news', icon: Newspaper },
    { name: 'Fórum', path: '/forum', icon: MessageSquare },
    { name: 'Comunidade', path: '/community', icon: Users },
    { name: 'Mercado', path: '/marketplace', icon: ShoppingBag },
    { name: 'Voluntariado', path: '/volunteer', icon: Heart },
    { name: 'Chatbot', path: '/chatbot', icon: MessageSquare }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="pt-3">
        <div className="flex items-center gap-2 px-4">
          {user && (
            <>
              <img 
                src={user.photoURL || '/placeholder.svg'} 
                alt={`Foto de ${user.displayName || 'Utilizador'}`} 
                className="w-10 h-10 rounded-full"
              />
              <span className="font-display font-semibold text-lg">
                {user.displayName || 'Utilizador'}
              </span>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.path}
                className="transition-all duration-200 font-medium"
              >
                <Link to={item.path}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          <p className="font-medium mb-1">LigaFaro</p>
          <p>Ligando a comunidade</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainLayout;
