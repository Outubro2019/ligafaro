import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Phone, MapPin, Calendar, Briefcase, AlertCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

// Esquema de validação para o formulário de perfil
const profileSchema = z.object({
  displayName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500, "A biografia deve ter no máximo 500 caracteres").optional(),
  occupation: z.string().optional(),
  birthdate: z.string().optional(),
  linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
  twitter: z.string().url("URL inválida").optional().or(z.literal("")),
  facebook: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().url("URL inválida").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileDialogProps {
  children?: React.ReactNode;
  defaultTab?: "info" | "activity" | "contacts";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProfileDialog({
  children,
  defaultTab = "info",
  isOpen,
  onOpenChange
}: ProfileDialogProps) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Usar estado controlado se as props forem fornecidas, caso contrário usar estado interno
  const dialogOpen = isOpen !== undefined ? isOpen : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;
  
  // Estado para controlar a abertura do diálogo
  const [activeTab, setActiveTab] = useState<"info" | "activity" | "contacts">(defaultTab);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formulário de perfil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      phone: "",
      address: "",
      bio: "",
      occupation: "",
      birthdate: "",
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
    },
  });

  // Função para lidar com a atualização do perfil
  const onProfileSubmit = async (values: ProfileFormValues) => {
    try {
      setError(null);
      // Aqui você implementaria a lógica para atualizar o perfil do usuário
      console.log("Dados do perfil a serem atualizados:", values);
      
      // Simulação de sucesso
      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Não foi possível atualizar o perfil");
    }
  };
  

  if (!user) {
    return null;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children !== undefined && (
          <DialogTrigger asChild>
            {children}
          </DialogTrigger>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Perfil do Utilizador</DialogTitle>
          <DialogDescription>
            Visualize e edite as suas informações pessoais.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-24 w-24 mb-2">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "Usuário"} />
            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-medium">{user.displayName || "Usuário"}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "info" | "activity" | "contacts")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="info">
            <div className="space-y-4 py-2">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="Seu nome completo"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="seu.email@exemplo.com"
                              className="pl-10"
                              disabled={true}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="birthdate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="date"
                                className="pl-10"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Atividade profissional</FormLabel>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                placeholder="A sua atividade profissional..."
                                className="pl-10"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biografia</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conte um pouco de si..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Fechar
                    </Button>
                    <Button type="submit">
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-4 py-2">
              <h3 className="text-lg font-medium">Atividade Recente</h3>
              <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
              
              <div className="border rounded-md p-4 bg-muted/50">
                <p className="text-center text-muted-foreground">Nenhuma atividade registrada</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="space-y-4 py-2">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="+351 123 456 789"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Morada</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="A sua morada"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <h3 className="text-lg font-medium mt-6 mb-2">Redes Sociais</h3>
                  
                  <FormField
                    control={profileForm.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <div className="relative">
                          <svg className="absolute left-3 top-3 h-4 w-4" viewBox="0 0 24 24" fill="#0077B5">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                          </svg>
                          <FormControl>
                            <Input
                              placeholder="https://linkedin.com/in/seu-perfil"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X (Twitter)</FormLabel>
                        <div className="relative">
                          <svg className="absolute left-3 top-3 h-4 w-4" viewBox="0 0 24 24" fill="#000000">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          <FormControl>
                            <Input
                              placeholder="https://x.com/seu-perfil"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <div className="relative">
                            <svg className="absolute left-3 top-3 h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
                              <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                            </svg>
                            <FormControl>
                              <Input
                                placeholder="https://facebook.com/seu-perfil"
                                className="pl-10"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <div className="relative">
                            <svg className="absolute left-3 top-3 h-4 w-4" viewBox="0 0 24 24" fill="#E4405F">
                              <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                            </svg>
                            <FormControl>
                              <Input
                                placeholder="https://instagram.com/seu-perfil"
                                className="pl-10"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                   <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
  Fechar
</Button>
                    <Button type="submit">
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}