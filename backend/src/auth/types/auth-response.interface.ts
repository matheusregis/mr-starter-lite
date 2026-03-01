export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  tokens: {
    accessToken: string;
  };
}
