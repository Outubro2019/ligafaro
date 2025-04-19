
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  resetPassword,
  logOut,
  onAuthChange,
  getCurrentUser,
  updateUserProfile,
  AuthUser
} from "@/services/authService";
import {
  getUserProfile,
  updateBasicProfile,
  updateExtendedProfile,
  uploadProfilePhoto,
  addSocialMedia,
  removeSocialMedia,
  addActivity,
  getActivitiesHistory,
  getTotalPoints,
  getCompleteUserProfile,
  registerEventParticipation,
  registerEventInterest,
  getUserEventHistory,
  getUserEventInterests
} from "@/services/userProfileService";
import { UserExtendedInfo, UserSocialMedia, UserActivity } from "@/services/types/userTypes";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  userExtendedInfo: UserExtendedInfo | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  uploadPhoto: (file: File) => Promise<string | null>;
  updateExtendedInfo: (data: Partial<UserExtendedInfo>) => Promise<boolean>;
  addUserSocialMedia: (socialMedia: UserSocialMedia) => Promise<boolean>;
  removeUserSocialMedia: (platform: string, url: string) => Promise<boolean>;
  addUserActivity: (activity: UserActivity) => Promise<boolean>;
  getUserActivities: () => Promise<UserActivity[]>;
  getUserTotalPoints: () => Promise<number>;
  refreshUserExtendedInfo: () => Promise<void>;
  registerUserEventParticipation: (event: { id: number; title: string; date: string; category: string; imageUrl?: string }, points?: number) => Promise<boolean>;
  registerUserEventInterest: (event: { id: number; title: string; date: string; category: string; imageUrl?: string }, points?: number) => Promise<boolean>;
  fetchUserEventHistory: () => Promise<UserActivity[]>;
  fetchUserEventInterests: () => Promise<UserActivity[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userExtendedInfo, setUserExtendedInfo] = useState<UserExtendedInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setIsLoading(false);
      
      // Carrega as informações estendidas do usuário quando ele faz login
      if (authUser) {
        getUserProfile(authUser.uid).then(extendedInfo => {
          setUserExtendedInfo(extendedInfo);
        });
      } else {
        setUserExtendedInfo(null);
      }
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

  const updateProfile = async (displayName?: string, photoURL?: string) => {
    try {
      if (!user) throw new Error("Usuário não autenticado");
      
      const success = await updateBasicProfile(user.uid, displayName, photoURL);
      
      if (success) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações. Tente novamente mais tarde.",
      });
      throw error;
    }
  };
  
  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      if (!user) throw new Error("Usuário não autenticado");
      
      const photoURL = await uploadProfilePhoto(user.uid, file);
      
      if (photoURL) {
        toast({
          title: "Foto atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
      }
      
      return photoURL;
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar foto",
        description: "Não foi possível fazer upload da foto. Tente novamente mais tarde.",
      });
      return null;
    }
  };
  
  const updateExtendedInfo = async (data: Partial<UserExtendedInfo>): Promise<boolean> => {
    try {
      if (!user) throw new Error("Usuário não autenticado");
      
      const success = await updateExtendedProfile(user.uid, data);
      
      if (success) {
        // Atualiza o estado local com as novas informações
        setUserExtendedInfo(prev => prev ? { ...prev, ...data } : null);
        
        toast({
          title: "Informações atualizadas",
          description: "Suas informações adicionais foram atualizadas com sucesso.",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Erro ao atualizar informações adicionais:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar informações",
        description: "Não foi possível atualizar suas informações adicionais. Tente novamente mais tarde.",
      });
      return false;
    }
  };
  
  const addUserSocialMedia = async (socialMedia: UserSocialMedia): Promise<boolean> => {
    try {
      if (!user) throw new Error("Usuário não autenticado");
      
      const success = await addSocialMedia(user.uid, socialMedia);
      
      if (success) {
        // Atualiza o estado local
        await refreshUserExtendedInfo();
        
        toast({
          title: "Rede social adicionada",
          description: "Sua rede social foi adicionada com sucesso.",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Erro ao adicionar rede social:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar rede social",
        description: "Não foi possível adicionar sua rede social. Tente novamente mais tarde.",
      });
      return false;
    }
  };
  
  const removeUserSocialMedia = async (platform: string, url: string): Promise<boolean> => {
    try {
      if (!user) throw new Error("Usuário não autenticado");
      
      const success = await removeSocialMedia(user.uid, platform, url);
      
      if (success) {
        // Atualiza o estado local
        await refreshUserExtendedInfo();
        
        toast({
          title: "Rede social removida",
          description: "Sua rede social foi removida com sucesso.",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Erro ao remover rede social:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover rede social",
        description: "Não foi possível remover sua rede social. Tente novamente mais tarde.",
      });
      return false;
    }
  };
  
  const addUserActivity = async (activity: UserActivity): Promise<boolean> => {
    try {
      if (!user) throw new Error("Usuário não autenticado");
      
      const success = await addActivity(user.uid, activity);
      
      if (success) {
        // Atualiza o estado local
        await refreshUserExtendedInfo();
        
        toast({
          title: "Atividade adicionada",
          description: "Sua atividade foi registrada com sucesso.",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Erro ao adicionar atividade:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar atividade",
        description: "Não foi possível registrar sua atividade. Tente novamente mais tarde.",
      });
      return false;
    }
  };
  
  const getUserActivities = async (): Promise<UserActivity[]> => {
    try {
      if (!user) return [];
      
      return await getActivitiesHistory(user.uid);
    } catch (error) {
      console.error("Erro ao obter atividades:", error);
      return [];
    }
  };
  
  const getUserTotalPoints = async (): Promise<number> => {
    try {
      if (!user) return 0;
      
      return await getTotalPoints(user.uid);
    } catch (error) {
      console.error("Erro ao obter pontuação total:", error);
      return 0;
    }
  };
  
  const refreshUserExtendedInfo = async (): Promise<void> => {
    try {
      if (!user) return;
      
      const extendedInfo = await getUserProfile(user.uid);
      setUserExtendedInfo(extendedInfo);
    } catch (error) {
      console.error("Erro ao atualizar informações estendidas:", error);
    }
  };
  
  const registerUserEventParticipation = async (
    event: { id: number; title: string; date: string; category: string; imageUrl?: string },
    points: number = 10
  ): Promise<boolean> => {
    try {
      if (!user) throw new Error("Usuário não autenticado");
      
      const success = await registerEventParticipation(user.uid, event, points);
      
      if (success) {
        // Atualiza o estado local
        await refreshUserExtendedInfo();
        
        toast({
          title: "Participação registrada",
          description: `Você ganhou ${points} pontos por participar do evento "${event.title}"`,
        });
      }
      
      return success;
    } catch (error) {
      console.error("Erro ao registrar participação em evento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar participação",
        description: "Não foi possível registrar sua participação no evento. Tente novamente mais tarde.",
      });
      return false;
    }
  };
  
  const registerUserEventInterest = async (
    event: { id: number; title: string; date: string; category: string; imageUrl?: string },
    points: number = 2
  ): Promise<boolean> => {
    try {
      if (!user) throw new Error("Usuário não autenticado");
      
      const success = await registerEventInterest(user.uid, event, points);
      
      if (success) {
        // Atualiza o estado local
        await refreshUserExtendedInfo();
        
        toast({
          title: "Interesse registrado",
          description: `Você ganhou ${points} pontos por demonstrar interesse no evento "${event.title}"`,
        });
      }
      
      return success;
    } catch (error) {
      console.error("Erro ao registrar interesse em evento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar interesse",
        description: "Não foi possível registrar seu interesse no evento. Tente novamente mais tarde.",
      });
      return false;
    }
  };
  
  const fetchUserEventHistory = async (): Promise<UserActivity[]> => {
    try {
      if (!user) return [];
      
      return await getUserEventHistory(user.uid);
    } catch (error) {
      console.error("Erro ao obter histórico de eventos:", error);
      return [];
    }
  };
  
  const fetchUserEventInterests = async (): Promise<UserActivity[]> => {
    try {
      if (!user) return [];
      
      return await getUserEventInterests(user.uid);
    } catch (error) {
      console.error("Erro ao obter interesses em eventos:", error);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      userExtendedInfo,
      loginWithGoogle,
      loginWithEmail,
      register,
      forgotPassword,
      logout,
      updateProfile,
      uploadPhoto,
      updateExtendedInfo,
      addUserSocialMedia,
      removeUserSocialMedia,
      addUserActivity,
      getUserActivities,
      getUserTotalPoints,
      refreshUserExtendedInfo,
      registerUserEventParticipation,
      registerUserEventInterest,
      fetchUserEventHistory,
      fetchUserEventInterests
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
