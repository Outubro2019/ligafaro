
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  resetPassword,
  logOut,
  onAuthChange,
  getCurrentUser,
  AuthUser
} from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
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

  const loginWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${user.displayName || 'utilizador'}!`,
        });
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Não foi possível fazer login com Google. Tente novamente mais tarde.",
      });
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const user = await signInWithEmail(email, password);
      if (user) {
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${user.displayName || 'utilizador'}!`,
        });
      }
    } catch (error) {
      console.error("Erro no login com email:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Email ou senha incorretos. Verifique suas credenciais e tente novamente.",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const user = await registerWithEmail(email, password);
      if (user) {
        toast({
          title: "Registro bem-sucedido",
          description: "Sua conta foi criada com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: "Não foi possível criar sua conta. Este email pode já estar em uso.",
      });
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await resetPassword(email);
      toast({
        title: "Email enviado",
        description: "Enviamos um email com instruções para redefinir sua senha.",
      });
    } catch (error) {
      console.error("Erro ao enviar email de redefinição:", error);
      toast({
        variant: "destructive",
        title: "Erro ao redefinir senha",
        description: "Não foi possível enviar o email de redefinição. Verifique se o email está correto.",
      });
      throw error;
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
    <AuthContext.Provider value={{
      user,
      isLoading,
      loginWithGoogle,
      loginWithEmail,
      register,
      forgotPassword,
      logout
    }}>
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
