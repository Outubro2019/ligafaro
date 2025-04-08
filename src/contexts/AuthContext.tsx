
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  signInWithGoogle, 
  logOut, 
  onAuthChange, 
  getCurrentUser, 
  AuthUser 
} from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${user.displayName || 'utilizador'}!`,
        });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Não foi possível fazer login. Tente novamente mais tarde.",
      });
    }
  };

  const logout = async () => {
    try {
      await logOut();
      toast({
        title: "Sessão terminada",
        description: "Você saiu da sua conta com sucesso.",
      });
    } catch (error) {
      console.error("Erro no logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível terminar a sessão. Tente novamente.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
