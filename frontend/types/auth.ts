export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}
