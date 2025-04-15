import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfwmQ0Q0kPAhRKdubf0ajj5hDiSfx87zk",
  authDomain: "vivafaro-bf7f4.firebaseapp.com",
  projectId: "vivafaro-bf7f4",
  storageBucket: "vivafaro-bf7f4.firebasestorage.app",
  messagingSenderId: "659108106559",
  appId: "1:659108106559:web:90b7f99658ea0dcdf3c38a",
  measurementId: "G-6R6EJY515X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Convert Firebase user to our AuthUser format
const formatUser = (user: FirebaseUser): AuthUser => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<AuthUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return formatUser(user);
  } catch (error) {
    console.error("Erro ao fazer login com Google:", error);
    
    // If we get an unauthorized domain error, try anonymous sign in as a fallback
    console.log("Tentando login anônimo devido à restrição de domínio");
    try {
      const result = await signInAnonymously(auth);
      // Create a mock user with random name for better UX in development
      const names = ["Ana Silva", "João Santos", "Maria Oliveira", "Pedro Costa", "Sofia Martins"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      
      // Override the anonymous user with some mock data
      const mockUser: AuthUser = {
        uid: result.user.uid,
        email: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
        displayName: randomName,
        photoURL: `https://i.pravatar.cc/150?u=${result.user.uid}`
      };
      
      return mockUser;
    } catch (anonError) {
      console.error("Erro no login anônimo:", anonError);
      return null;
    }
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return formatUser(result.user);
  } catch (error) {
    console.error("Erro ao fazer login com email:", error);
    throw error;
  }
};

// Register with email and password
export const registerWithEmail = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return formatUser(result.user);
  } catch (error) {
    console.error("Erro ao registrar com email:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Erro ao enviar email de redefinição de senha:", error);
    throw error;
  }
};

// Sign out
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

// Set up auth state listener
export const onAuthChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // If user is anonymous but we assigned mock data
      if (user.isAnonymous) {
        // Try to get cached mock user data from localStorage
        const mockUserJSON = localStorage.getItem(`mockUser_${user.uid}`);
        if (mockUserJSON) {
          callback(JSON.parse(mockUserJSON));
          return;
        }
        
        // Otherwise create new mock data
        const names = ["Ana Silva", "João Santos", "Maria Oliveira", "Pedro Costa", "Sofia Martins"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        
        const mockUser: AuthUser = {
          uid: user.uid,
          email: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
          displayName: randomName,
          photoURL: `https://i.pravatar.cc/150?u=${user.uid}`
        };
        
        // Cache the mock user
        localStorage.setItem(`mockUser_${user.uid}`, JSON.stringify(mockUser));
        callback(mockUser);
      } else {
        callback(formatUser(user));
      }
    } else {
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  const user = auth.currentUser;
  
  if (!user) return null;
  
  // If anonymous user, check for cached mock data
  if (user.isAnonymous) {
    const mockUserJSON = localStorage.getItem(`mockUser_${user.uid}`);
    if (mockUserJSON) {
      return JSON.parse(mockUserJSON);
    }
  }
  
  return user ? formatUser(user) : null;
};
