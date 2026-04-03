export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  nationality?: string;
  date_of_birth?: string;
  is_verified: boolean;
  role?: {
    id: number;
    name: string;
  };
  avatarUrl?: string;
  preferences?: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  newsletter: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone_number?: string;
  nationality?: string;
  date_of_birth?: string;
  preferences?: Partial<UserPreferences>;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  fullName: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
