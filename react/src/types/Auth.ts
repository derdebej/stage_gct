export interface User {
  email: string;
  role?: string;
  nom?: string;
  prenom?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}