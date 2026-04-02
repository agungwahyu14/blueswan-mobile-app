export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
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
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
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
