export interface UserActivity {
  id: string;
  name: string;
  date: string;
  points: number;
  description?: string;
  imageUrl?: string;
}

export interface UserSocialMedia {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'other';
  url: string;
  username?: string;
}

export interface UserExtendedInfo {
  registrationDate: string;
  phone?: string;
  address?: string;
  bio?: string;
  profession?: string;
  socialMedia?: UserSocialMedia[];
  activities?: UserActivity[];
  totalPoints?: number;
  otherInfo?: Record<string, string>;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  extendedInfo?: UserExtendedInfo;
}