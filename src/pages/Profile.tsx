import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Camera,
  AlertCircle,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Plus,
  Trash2,
  Upload,
  Award,
  Calendar,
  Sparkles,
  Zap
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserActivity, UserSocialMedia } from "@/services/types/userTypes";
import { useEvents } from "@/hooks/useEvents";
import { useEventParticipation } from "@/utils/eventParticipationUtil";

// Esquema de validação para o formulário de informações pessoais
const personalInfoSchema = z.object({
  displayName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").optional(),
  photoURL: z.string().optional(),
});

// Esquema de validação para o formulário de outras informações
const otherInfoSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  profession: z.string().optional(),
});

// Esquema de validação para o formulário de redes sociais
const socialMediaSchema = z.object({
  platform: z.enum(['facebook', 'twitter', 'instagram', 'linkedin', 'other']),
  url: z.string().url("URL inválida"),
  username: z.string().optional(),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
type OtherInfoFormValues = z.infer<typeof otherInfoSchema>;
type SocialMediaFormValues = z.infer<typeof socialMediaSchema>;

export default function Profile() {
  const { 
    user,
    userExtendedInfo,
    updateProfile,
    uploadPhoto,
    updateExtendedInfo,
    addUserSocialMedia,
    removeUserSocialMedia,
    getUserActivities,
    getUserTotalPoints,
    refreshUserExtendedInfo,
    fetchUserEventHistory,
    fetchUserEventInterests
  } = useAuth();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { events } = useEvents();
  const { simulateParticipation, simulateInterest } = useEventParticipation();
  
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingOther, setIsEditingOther] = useState(false);
  const [isSubmittingPersonal, setIsSubmittingPersonal] = useState(false);
  const [isSubmittingOther, setIsSubmittingOther] = useState(false);
  const [isSubmittingSocial, setIsSubmittingSocial] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [eventActivities, setEventActivities] = useState<UserActivity[]>([]);
  const [eventInterests, setEventInterests] = useState<UserActivity[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Formulário de informações pessoais
  const personalForm = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
    },
  });
  
  // Formulário de outras informações
  const otherInfoForm = useForm<OtherInfoFormValues>({
    resolver: zodResolver(otherInfoSchema),
    defaultValues: {
      phone: userExtendedInfo?.phone || "",
      address: userExtendedInfo?.address || "",
      bio: userExtendedInfo?.bio || "",
      profession: userExtendedInfo?.profession || "",
    },
  });
  
  // Formulário de redes sociais
  const socialMediaForm = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      platform: 'facebook',
      url: '',
      username: '',
    },
  });
  
  // Carrega as atividades e pontuação do utilizador
  useEffect(() => {
    if (user) {
      loadUserActivities();
      loadUserPoints();
      loadUserEventHistory();
      loadUserEventInterests();
    }
  }, [user]);
  
  // Atualiza os valores padrão do formulário quando userExtendedInfo muda
  useEffect(() => {
    if (userExtendedInfo) {
      otherInfoForm.reset({
        phone: userExtendedInfo.phone || "",
        address: userExtendedInfo.address || "",
        bio: userExtendedInfo.bio || "",
        profession: userExtendedInfo.profession || "",
      });
    }
  }, [userExtendedInfo, otherInfoForm]);
  
  const loadUserActivities = async () => {
    const userActivities = await getUserActivities();
    setActivities(userActivities);
  };
  
  const loadUserEventHistory = async () => {
    const history = await fetchUserEventHistory();
    setEventActivities(history);
  };
  
  const loadUserEventInterests = async () => {
    const interests = await fetchUserEventInterests();
    setEventInterests(interests);
  };
  
  const loadUserPoints = async () => {
    const points = await getUserTotalPoints();
    setTotalPoints(points);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    
    try {
      await uploadPhoto(selectedFile);
      setSelectedFile(null);
      
      // Limpa o input de arquivo
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
    }
  };
  
  const onSubmitPersonalInfo = async (values: PersonalInfoFormValues) => {
    try {
      setError(null);
      setIsSubmittingPersonal(true);
      
      // Só atualizamos o displayName se ele for diferente do atual
      if (values.displayName !== user?.displayName) {
        await updateProfile(values.displayName, undefined);
      }
      
      setIsEditingPersonal(false);
    } catch (error) {
      setError("Não foi possível atualizar o perfil");
    } finally {
      setIsSubmittingPersonal(false);
    }
  };
  
  const onSubmitOtherInfo = async (values: OtherInfoFormValues) => {
    try {
      setError(null);
      setIsSubmittingOther(true);
      
      await updateExtendedInfo({
        phone: values.phone,
        address: values.address,
        bio: values.bio,
        profession: values.profession,
      });
      
      setIsEditingOther(false);
    } catch (error) {
      setError("Não foi possível atualizar as informações adicionais");
    } finally {
      setIsSubmittingOther(false);
    }
  };
  
  const onSubmitSocialMedia = async (values: SocialMediaFormValues) => {
    try {
      setError(null);
      setIsSubmittingSocial(true);
      
      const socialMedia: UserSocialMedia = {
        platform: values.platform,
        url: values.url,
        username: values.username,
      };
      
      await addUserSocialMedia(socialMedia);
      
      // Limpa o formulário
      socialMediaForm.reset({
        platform: 'facebook',
        url: '',
        username: '',
      });
    } catch (error) {
      setError("Não foi possível adicionar a rede social");
    } finally {
      setIsSubmittingSocial(false);
    }
  };
  
  const handleRemoveSocialMedia = async (platform: string, url: string) => {
    try {
      await removeUserSocialMedia(platform, url);
    } catch (error) {
      console.error("Erro ao remover rede social:", error);
    }
  };
  
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Precisa de estar autenticado para aceder a esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Perfil do Utilizador</CardTitle>
          <CardDescription>
            Visualize e edite as suas informações de perfil.
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
              <TabsTrigger value="other">Outras Informações</TabsTrigger>
            </TabsList>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mx-6 mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Aba de Informações Pessoais */}
          <TabsContent value="personal" className="p-0">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.photoURL || "/Logo_Liga_Faro.png"} alt="Foto de perfil" />
                  <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => document.getElementById('photo-upload')?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Selecionar foto
                    </Button>
                    
                    {selectedFile && (
                      <Button 
                        size="sm" 
                        onClick={handleUploadPhoto}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    )}
                  </div>
                  
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Informações de Registo</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Data de Registo: </span>
                        <span className="text-sm font-medium">
                          {userExtendedInfo?.registrationDate 
                            ? formatDate(userExtendedInfo.registrationDate)
                            : "Não disponível"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">ID: </span>
                        <span className="text-sm font-medium">{user.uid}</span>
                      </div>
                      
                      {/* QR Code do perfil do usuário */}
                      <div className="mt-4 flex flex-col items-center">
                        <span className="text-sm mb-2">QR Code do seu perfil:</span>
                        <div className="p-2 bg-white rounded-lg">
                          <QRCode
                            value={`https://ligafaro.netlify.app/profile/${user.uid}`}
                            size={150}
                            level="H"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground mt-2">
                          Escaneie para ver seu perfil completo
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Redes Sociais</h3>
                    <div className="mt-2 space-y-2">
                      {userExtendedInfo?.socialMedia && userExtendedInfo.socialMedia.length > 0 ? (
                        userExtendedInfo.socialMedia.map((social, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getSocialIcon(social.platform)}
                              <a 
                                href={social.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {social.username || social.url}
                              </a>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveSocialMedia(social.platform, social.url)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma rede social adicionada</p>
                      )}
                    </div>
                    
                    <Form {...socialMediaForm}>
                      <form onSubmit={socialMediaForm.handleSubmit(onSubmitSocialMedia)} className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <FormField
                            control={socialMediaForm.control}
                            name="platform"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Plataforma" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="facebook">Facebook</SelectItem>
                                    <SelectItem value="twitter">X</SelectItem>
                                    <SelectItem value="instagram">Instagram</SelectItem>
                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                    <SelectItem value="other">Outra</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={socialMediaForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Nome de utilizador"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={socialMediaForm.control}
                          name="url"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="URL do perfil"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          size="sm"
                          disabled={isSubmittingSocial}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {isSubmittingSocial ? "Adicionando..." : "Adicionar Rede Social"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <Form {...personalForm}>
                  <form onSubmit={personalForm.handleSubmit(onSubmitPersonalInfo)} className="space-y-4">
                    <FormField
                      control={personalForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                placeholder="Seu nome"
                                className="pl-10"
                                disabled={!isEditingPersonal}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalForm.control}
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
                                disabled={true} // Email não pode ser alterado
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Este é o nome e o email que serão exibidos para os outros utilizadores na comunidade.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isEditingPersonal ? (
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditingPersonal(false)}
                          disabled={isSubmittingPersonal}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmittingPersonal}
                        >
                          {isSubmittingPersonal ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end pt-4">
                        <Button
                          type="button"
                          onClick={() => setIsEditingPersonal(true)}
                        >
                          Editar Informações
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </div>
            </CardContent>
          </TabsContent>
          
          {/* Aba de Atividade */}
          <TabsContent value="activity" className="p-0">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-medium">Pontuação Total</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Award className="h-6 w-6 text-yellow-500" />
                    <span className="text-2xl font-bold">{totalPoints} pontos</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={loadUserActivities}>
                    Atualizar Atividades
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (events.length > 0) {
                        const success = await simulateParticipation(events, 3);
                        if (success) {
                          toast({
                            title: "Participação simulada",
                            description: "Foram adicionadas 3 participações em eventos ao seu perfil.",
                            variant: "default"
                          });
                          loadUserActivities();
                          loadUserEventHistory();
                          loadUserPoints();
                        }
                      } else {
                        toast({
                          title: "Sem eventos disponíveis",
                          description: "Não há eventos disponíveis para simular participação.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                    Simular Participações
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (events.length > 0) {
                        const success = await simulateInterest(events, 5);
                        if (success) {
                          toast({
                            title: "Interesse simulado",
                            description: "Foram adicionados 5 interesses em eventos ao seu perfil.",
                            variant: "default"
                          });
                          loadUserActivities();
                          loadUserEventInterests();
                          loadUserPoints();
                        }
                      } else {
                        toast({
                          title: "Sem eventos disponíveis",
                          description: "Não há eventos disponíveis para simular interesse.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <Zap className="h-4 w-4 mr-2 text-blue-500" />
                    Simular Interesses
                  </Button>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Histórico de Atividades</h3>
                
                <Tabs defaultValue="all" className="mt-4">
                  <TabsList>
                    <TabsTrigger value="all">Todas Atividades</TabsTrigger>
                    <TabsTrigger value="events">Eventos</TabsTrigger>
                    <TabsTrigger value="interests">Interesses</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    {activities.length > 0 ? (
                      <div className="space-y-4 mt-4">
                        {activities.map((activity, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between gap-2">
                                <div>
                                  <h4 className="font-medium">{activity.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.description || "Sem descrição"}
                                  </p>
                                  <p className="text-sm mt-1">
                                    {formatDate(activity.date)}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <Badge variant="secondary" className="ml-auto">
                                    <Award className="h-4 w-4 mr-1 text-yellow-500" />
                                    {activity.points} pontos
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Você ainda não participou de nenhuma atividade.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="events">
                    {eventActivities.length > 0 ? (
                      <div className="space-y-4 mt-4">
                        {eventActivities.map((activity, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between gap-2">
                                <div>
                                  <h4 className="font-medium">{activity.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.description || "Sem descrição"}
                                  </p>
                                  <p className="text-sm mt-1">
                                    {formatDate(activity.date)}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <Badge variant="secondary" className="ml-auto">
                                    <Award className="h-4 w-4 mr-1 text-yellow-500" />
                                    {activity.points} pontos
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Você ainda não participou de nenhum evento.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="interests">
                    {eventInterests.length > 0 ? (
                      <div className="space-y-4 mt-4">
                        {eventInterests.map((activity, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between gap-2">
                                <div>
                                  <h4 className="font-medium">{activity.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.description || "Sem descrição"}
                                  </p>
                                  <p className="text-sm mt-1">
                                    {formatDate(activity.date)}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <Badge variant="secondary" className="ml-auto">
                                    <Award className="h-4 w-4 mr-1 text-yellow-500" />
                                    {activity.points} pontos
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Você ainda não demonstrou interesse em nenhum evento.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </TabsContent>
          
          {/* Aba de Outras Informações */}
          <TabsContent value="other" className="p-0">
            <CardContent className="pt-6">
              <Form {...otherInfoForm}>
                <form onSubmit={otherInfoForm.handleSubmit(onSubmitOtherInfo)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={otherInfoForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                placeholder="Seu telefone"
                                className="pl-10"
                                disabled={!isEditingOther}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={otherInfoForm.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Atividade Profissional</FormLabel>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                placeholder="Sua profissão"
                                className="pl-10"
                                disabled={!isEditingOther}
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
                    control={otherInfoForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Morada</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="Sua morada"
                              className="pl-10"
                              disabled={!isEditingOther}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={otherInfoForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biografia</FormLabel>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Textarea
                              placeholder="Conte um pouco sobre você"
                              className="pl-10 min-h-[120px]"
                              disabled={!isEditingOther}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {isEditingOther ? (
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingOther(false)}
                        disabled={isSubmittingOther}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmittingOther}
                      >
                        {isSubmittingOther ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        onClick={() => setIsEditingOther(true)}
                      >
                        Editar Informações
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-end border-t pt-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}