import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateUserProfile } from "./authService";
import { UserExtendedInfo, UserProfile, UserSocialMedia, UserActivity } from "./types/userTypes";

// Inicializa o Firestore
const db = getFirestore();
const storage = getStorage();

// Coleção onde os perfis de usuário serão armazenados
const USERS_COLLECTION = "users";

// Função para obter o perfil estendido do usuário
export const getUserProfile = async (uid: string): Promise<UserExtendedInfo | null> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserExtendedInfo;
    }
    
    // Se o documento não existir, cria um novo com informações básicas
    const newUserProfile: UserExtendedInfo = {
      registrationDate: new Date().toISOString(),
      activities: [],
      totalPoints: 0,
      socialMedia: []
    };
    
    await setDoc(userDocRef, newUserProfile);
    return newUserProfile;
  } catch (error) {
    console.error("Erro ao obter perfil do usuário:", error);
    return null;
  }
};

// Função para atualizar as informações básicas do perfil
export const updateBasicProfile = async (
  uid: string, 
  displayName?: string, 
  photoURL?: string
): Promise<boolean> => {
  try {
    // Atualiza no Firebase Auth
    await updateUserProfile(displayName, photoURL);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar perfil básico:", error);
    return false;
  }
};

// Função para atualizar as informações estendidas do perfil
export const updateExtendedProfile = async (
  uid: string, 
  data: Partial<UserExtendedInfo>
): Promise<boolean> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, { ...data });
    return true;
  } catch (error) {
    console.error("Erro ao atualizar perfil estendido:", error);
    return false;
  }
};

// Função para fazer upload de uma nova foto de perfil
export const uploadProfilePhoto = async (
  uid: string, 
  file: File
): Promise<string | null> => {
  try {
    const storageRef = ref(storage, `profile_photos/${uid}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    
    // Atualiza a URL da foto no Auth
    await updateUserProfile(undefined, photoURL);
    
    return photoURL;
  } catch (error) {
    console.error("Erro ao fazer upload da foto de perfil:", error);
    return null;
  }
};

// Função para adicionar uma rede social
export const addSocialMedia = async (
  uid: string, 
  socialMedia: UserSocialMedia
): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile) return false;
    
    const socialMediaList = userProfile.socialMedia || [];
    socialMediaList.push(socialMedia);
    
    return await updateExtendedProfile(uid, { socialMedia: socialMediaList });
  } catch (error) {
    console.error("Erro ao adicionar rede social:", error);
    return false;
  }
};

// Função para remover uma rede social
export const removeSocialMedia = async (
  uid: string, 
  platform: string, 
  url: string
): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile || !userProfile.socialMedia) return false;
    
    const socialMediaList = userProfile.socialMedia.filter(
      sm => !(sm.platform === platform && sm.url === url)
    );
    
    return await updateExtendedProfile(uid, { socialMedia: socialMediaList });
  } catch (error) {
    console.error("Erro ao remover rede social:", error);
    return false;
  }
};

// Função para adicionar uma atividade genérica
export const addActivity = async (
  uid: string,
  activity: UserActivity
): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile) return false;
    
    const activities = userProfile.activities || [];
    activities.push(activity);
    
    const totalPoints = (userProfile.totalPoints || 0) + activity.points;
    
    return await updateExtendedProfile(uid, { 
      activities, 
      totalPoints 
    });
  } catch (error) {
    console.error("Erro ao adicionar atividade:", error);
    return false;
  }
};

// Função para registrar participação em um evento
export const registerEventParticipation = async (
  uid: string,
  event: {
    id: number;
    title: string;
    date: string;
    category: string;
    imageUrl?: string;
  },
  points: number = 10
): Promise<boolean> => {
  try {
    // Cria uma atividade baseada no evento
    const activity: UserActivity = {
      id: `event_${event.id}_${Date.now()}`,
      name: event.title,
      date: new Date().toISOString(),
      points: points,
      description: `Participação no evento: ${event.title}`,
      imageUrl: event.imageUrl
    };
    
    return await addActivity(uid, activity);
  } catch (error) {
    console.error("Erro ao registrar participação em evento:", error);
    return false;
  }
};

// Função para registrar interesse em um evento
export const registerEventInterest = async (
  uid: string,
  event: {
    id: number;
    title: string;
    date: string;
    category: string;
    imageUrl?: string;
  },
  points: number = 2
): Promise<boolean> => {
  try {
    // Cria uma atividade baseada no evento
    const activity: UserActivity = {
      id: `event_interest_${event.id}_${Date.now()}`,
      name: `Interesse: ${event.title}`,
      date: new Date().toISOString(),
      points: points,
      description: `Demonstrou interesse no evento: ${event.title}`,
      imageUrl: event.imageUrl
    };
    
    return await addActivity(uid, activity);
  } catch (error) {
    console.error("Erro ao registrar interesse em evento:", error);
    return false;
  }
};

// Função para obter o histórico completo de atividades
export const getActivitiesHistory = async (uid: string): Promise<UserActivity[]> => {
  try {
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile || !userProfile.activities) return [];
    
    // Ordena as atividades por data (mais recentes primeiro)
    return [...userProfile.activities].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Erro ao obter histórico de atividades:", error);
    return [];
  }
};

// Função para obter a pontuação total
export const getTotalPoints = async (uid: string): Promise<number> => {
  try {
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile) return 0;
    
    return userProfile.totalPoints || 0;
  } catch (error) {
    console.error("Erro ao obter pontuação total:", error);
    return 0;
  }
};

// Função para obter o histórico de eventos em que o usuário participou
export const getUserEventHistory = async (uid: string): Promise<UserActivity[]> => {
  try {
    const activities = await getActivitiesHistory(uid);
    
    // Filtra apenas as atividades relacionadas a eventos
    return activities.filter(activity =>
      activity.id.startsWith('event_') && !activity.id.includes('interest')
    );
  } catch (error) {
    console.error("Erro ao obter histórico de eventos:", error);
    return [];
  }
};

// Função para obter o histórico de interesses em eventos
export const getUserEventInterests = async (uid: string): Promise<UserActivity[]> => {
  try {
    const activities = await getActivitiesHistory(uid);
    
    // Filtra apenas as atividades relacionadas a interesses em eventos
    return activities.filter(activity =>
      activity.id.includes('event_interest')
    );
  } catch (error) {
    console.error("Erro ao obter histórico de interesses em eventos:", error);
    return [];
  }
};

// Função para obter o perfil completo (Auth + Firestore)
export const getCompleteUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    // Obtém as informações básicas do Auth
    const authUser = {
      uid,
      email: null,
      displayName: null,
      photoURL: null
    };
    
    // Obtém as informações estendidas do Firestore
    const extendedInfo = await getUserProfile(uid);
    
    return {
      ...authUser,
      extendedInfo
    };
  } catch (error) {
    console.error("Erro ao obter perfil completo:", error);
    return null;
  }
};